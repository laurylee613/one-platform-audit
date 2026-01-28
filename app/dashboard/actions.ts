'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// ✅ Munger 已帮你修正格式：加了 const 和 引号
const COZE_API_TOKEN = 'pat_vt9MDN76GBzErTb4gJbSoTzv6n1IvnIfhSiUftdTvaIomaFPgzIA56YdBhCo82k0'
const COZE_WORKFLOW_ID = '7598337253522047016'

export async function runAuditAndSave(formData: FormData) {
  const supabase = await createClient()

  // 1. 获取当前用户
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('未授权用户')
  }

  // 2. 获取表单数据
  const rawText = formData.get('rawText') as string
  // 👇 新增：获取前端传来的文件路径 (隐藏字段)
  const evidencePath = formData.get('evidencePath') as string | null

  console.log('正在审计:', rawText?.slice(0, 20) + '...')
  if (evidencePath) {
    console.log('📎 附带证据文件:', evidencePath)
  }

  // 3. 调用 Coze AI (保持不变)
  // 注意：目前我们还没把图片传给 Coze，那是 Lesson 8 的事。
  // 现在我们先把图片存好，作为“不可篡改的证据”。
  const COZE_API_TOKEN = process.env.COZE_API_TOKEN
  const COZE_BOT_ID = process.env.COZE_BOT_ID
  const COZE_USER_ID = user.id

  let aiResponse = {}

  try {
    const response = await fetch('https://api.coze.cn/open_api/v2/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COZE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Host': 'api.coze.cn',
        'Connection': 'keep-alive'
      },
      body: JSON.stringify({
        conversation_id: "123",
        bot_id: COZE_BOT_ID,
        user: COZE_USER_ID,
        query: rawText, // 目前还是只传文本给 AI
        stream: false
      })
    })

    const data = await response.json()
    // 解析 Coze 返回的 messages
    if (data.messages && data.messages.length > 0) {
        const answerMsg = data.messages.find((m: any) => m.type === 'answer');
        if (answerMsg) {
            // 尝试解析 content 是否为 JSON
            try {
                // 有时候 Coze 会把 JSON 放在 content 字符串里
                aiResponse = { 
                    data: answerMsg.content, // 直接存 content
                    raw: data 
                }
            } catch (e) {
                aiResponse = { output: answerMsg.content }
            }
        }
    }
  } catch (error) {
    console.error('Coze API Error:', error)
    aiResponse = { error: 'AI 服务暂时不可用' }
  }

  // 4. 存入 Supabase 数据库
  const { error: insertError } = await supabase
    .from('assets')
    .insert({
      content: aiResponse,     // AI 的审计结果
      owner_id: user.id,       // 数据主权归属
      evidence_path: evidencePath // 👈 新增：把文件路径存进去！
    })

  if (insertError) {
    console.error('存储失败:', insertError)
    throw new Error('存储失败')
  }

  // 5. 刷新页面数据
  revalidatePath('/dashboard')
}