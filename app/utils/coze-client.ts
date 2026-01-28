// app/utils/coze-client.ts

const COZE_API_URL = process.env.COZE_API_BASE_URL || 'https://api.coze.cn';
const BOT_ID = process.env.COZE_BOT_ID;
const API_TOKEN = process.env.COZE_API_TOKEN;

/**
 * 调用 Coze 视觉审计 Agent
 * @param fileUrl 图片的公开访问链接 (Signed URL)
 * @param userId 用户ID (用于区分会话)
 */
export async function auditImageWithCoze(fileUrl: string, userId: string) {
  console.log('👁️ [Coze] 正在连接视觉审计官...');
  console.log('🔗 [Coze] 审计目标:', fileUrl);

  if (!BOT_ID || !API_TOKEN) {
    throw new Error('Coze 配置缺失: 请检查 .env.local');
  }

  try {
    const response = await fetch(`${COZE_API_URL}/open_api/v2/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Host': 'api.coze.cn',
        'Connection': 'keep-alive'
      },
      body: JSON.stringify({
        bot_id: BOT_ID,
        user: userId, // 区分不同用户的会话上下文
        query: "请审计这张图片", // 触发词
        stream: false,
        // 关键：构造多模态消息，把图片 URL 传过去
        additional_messages: [
          {
            role: "user",
            content_type: "object_string",
            content: JSON.stringify([
              { type: "text", text: "请严格按照 JSON 格式审计这张图片：" },
              { type: "image", file_url: fileUrl }
            ])
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [Coze API Error]', errorText);
      throw new Error(`Coze API 响应错误: ${response.status}`);
    }

    const data = await response.json();
    
    // Coze 的回复在 messages 数组里，通常是最后一条 bot 的回复
    const botMessages = data.messages.filter((m: any) => m.role === 'assistant' && m.type === 'answer');
    if (botMessages.length === 0) {
      throw new Error('Coze 未返回有效回答');
    }

    const rawContent = botMessages[0].content;
    console.log('🤖 [Coze Raw Output]:', rawContent);

    // 清洗数据：有时候 AI 会在 JSON 外面包 Markdown 代码块 (```json ... ```)，需要去掉
    const jsonString = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonString);

  } catch (error) {
    console.error('❌ [Audit Failed]:', error);
    // 返回一个“审计失败”的兜底状态，防止卡死流程
    return {
      audit_result: {
        status: "MANUAL_REVIEW_REQUIRED",
        rejection_reason: "AI Service Error",
        confidence_score: 0
      }
    };
  }
}