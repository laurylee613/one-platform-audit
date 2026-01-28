'use server';

import { createClient } from '@/utils/supabase/server_backup';
import { revalidatePath } from 'next/cache'; // 👈 新引入这个魔法工具

export async function auditAsset(assetName: string) {
  console.log('🚀 [Start] 开始呼叫 AI 审计官:', assetName);

  const BOT_ID = process.env.COZE_BOT_ID;
  const API_TOKEN = process.env.COZE_API_TOKEN?.trim();

  if (!BOT_ID || !API_TOKEN) {
    return { success: false, message: '系统错误：缺少 AI 配置钥匙' };
  }

  const authHeader = { 'Authorization': `Bearer ${API_TOKEN}` };

  try {
    // 1. 发起对话
    const createRes = await fetch('https://api.coze.cn/v3/chat', {
      method: 'POST',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bot_id: BOT_ID,
        user_id: 'user_001',
        stream: false,
        auto_save_history: true,
        additional_messages: [{ role: 'user', content: assetName, content_type: 'text' }],
      }),
    });

    const createData = await createRes.json();
    if (createData.code !== 0 || !createData.data) {
      return { success: false, message: `AI 启动失败: ${createData.msg}` };
    }

    const chatId = createData.data.id;
    const conversationId = createData.data.conversation_id;
    let status = createData.data.status;

    // 2. 轮询等待
    let retryCount = 0;
    while (status === 'in_progress') {
      if (retryCount > 20) return { success: false, message: 'AI 思考超时' };
      await new Promise(resolve => setTimeout(resolve, 1000));
      retryCount++;

      const retrieveRes = await fetch(`https://api.coze.cn/v3/chat/retrieve?chat_id=${chatId}&conversation_id=${conversationId}`, {
        method: 'GET',
        headers: authHeader,
      });
      const retrieveData = await retrieveRes.json();
      if (retrieveData.code !== 0) return { success: false, message: '查询进度失败' };
      status = retrieveData.data.status;
      
      if (status === 'failed') return { success: false, message: 'AI 处理出错' };
    }

    // 3. 获取结果
    const msgRes = await fetch(`https://api.coze.cn/v3/chat/message/list?chat_id=${chatId}&conversation_id=${conversationId}`, {
      method: 'GET',
      headers: authHeader,
    });
    const msgData = await msgRes.json();
    const aiMessages = msgData.data?.filter((m: any) => m.role === 'assistant' && m.type === 'answer');
    const finalMessage = aiMessages?.[aiMessages.length - 1];

    if (!finalMessage) return { success: false, message: 'AI 没有生成有效文本' };

    // 4. 解析并保存
    let result;
    try {
      const cleanJson = finalMessage.content.replace(/```json/g, '').replace(/```/g, '').trim();
      result = JSON.parse(cleanJson);

      const supabase = await createClient();
      
      const { error } = await supabase
        .from('assets')
        .update({
          ai_score: result.score,
          ai_risk_level: result.risk_level,
          ai_comment: result.comment
        })
        .eq('name', assetName);

      if (error) {
        console.error('❌ 数据库保存失败:', error);
      } else {
        console.log('✅ 审计结果已存入数据库');
        // 🔥 关键一击：告诉 Vercel 清除 /boss/report 页面的缓存，显示最新数据！
        revalidatePath('/boss/report');
      }

    } catch (e) {
      console.error('解析或保存失败', e);
      result = { comment: finalMessage.content, score: 'N/A', risk_level: '未知' };
    }

    return { success: true, data: result };

  } catch (error) {
    console.error('💥 系统异常:', error);
    return { success: false, message: '网络连接故障' };
  }
}