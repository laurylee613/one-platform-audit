'use server'

export async function runAuditAgent(rawText: string) {
  // 从环境变量获取密钥
  const token = process.env.COZE_API_TOKEN;
  const workflowId = process.env.COZE_WORKFLOW_ID;

  if (!token || !workflowId) {
    return { success: false, error: '系统配置缺失：API Token 或 Workflow ID 未找到' };
  }

  try {
    const response = await fetch('https://api.coze.cn/v1/workflow/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        parameters: {
          raw_text: rawText, // 对应 Coze 工作流的输入变量名
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.msg || 'API 调用失败' };
    }

    // Coze Workflow 的返回结果通常在 data.data 里面，且可能是个 JSON 字符串
    // 我们需要解析它
    try {
        const resultString = JSON.parse(data.data).output;
        const finalJson = JSON.parse(resultString);
        return { success: true, data: finalJson };
    } catch (e) {
        // 如果解析失败，直接返回原始数据
        return { success: true, data: data.data };
    }

  } catch (error) {
    console.error('Audit Agent Error:', error);
    return { success: false, error: '服务器内部错误' };
  }
}