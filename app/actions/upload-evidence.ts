'use server';

import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { auditImageWithCoze } from '@/app/utils/coze-client';


export async function uploadEvidence(formData: FormData) {
  const supabase = await createClient();
  
  // 1. 身份鉴权
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
 
// 🟢 新增这一行：如果没有用户，就叫 'anonymous'
   const userIdOrAnon = user?.id || 'anonymous';
  //if (authError || !user) {
    //return { error: 'Unauthorized: 用户未登录', success: false };
  //}

  // 2. 提取数据
  const file = formData.get('file') as File;
  const clientHash = formData.get('file_hash') as string;
  
  if (!file || !clientHash) {
    return { error: 'Missing Data', success: false };
  }

  // 3. 物理存储 (Storage Upload)
  const fileExt = file.name.split('.').pop();
   // 🔴 修改前：
  //const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
   
  // 🟢 修改后：
  const fileName = `${userIdOrAnon}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('evidence-vault')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Storage Error:', uploadError);
    return { error: 'Upload Failed: ' + uploadError.message, success: false };
  }

  // ==========================================
  // 👁️ Lesson 8 新增核心逻辑: 召唤 AI 审计
  // ==========================================
  let aiResult = null;
  let finalStatus = 'pending_verification';

  try {
    console.log('🤖 正在请求 AI 介入审计...');
    
    // 4.1 生成 Signed URL (有时效性的公开链接，供 AI 读取)
    const { data: signedUrlData, error: signError } = await supabase
      .storage
      .from('evidence-vault')
      .createSignedUrl(fileName, 60); // 60秒有效期，足够AI看一眼了

    if (signError || !signedUrlData) {
      throw new Error('无法生成签名链接供 AI 审计');
    }

    // 4.2 调用 Coze
    // 注意：这里我们传入 user.id 是为了让 Coze 区分会话
//    const cozeResponse = await auditImageWithCoze(signedUrlData.signedUrl, user.id);
    const cozeResponse = await auditImageWithCoze(signedUrlData.signedUrl, userIdOrAnon);
    aiResult = cozeResponse.audit_result; // 获取核心结果部分


    console.log('🤖 AI 审计完成:', aiResult?.status);

    // 4.3 依据 Darrow 的法律逻辑定性
    if (aiResult?.status === 'APPROVED') {
      finalStatus = 'verified_compliant'; // 合规
    } else if (aiResult?.status === 'REJECTED') {
      finalStatus = 'rejected_fraud';     // 欺诈/不合规
    } else {
      finalStatus = 'manual_review_required'; // 存疑
    }

  } catch (aiError) {
    console.error('⚠️ AI 审计服务暂时离线或出错 (降级处理):', aiError);
    // 如果 AI 挂了，我们不能让上传失败，而是标记为“待人工复核”
    finalStatus = 'pending_manual_review';
  }

  // ==========================================

  // 5. 逻辑存证 (Database Logging)
  // 将 AI 的判断一并写入数据库
  const headersList = await headers();
  const clientIp = headersList.get('x-forwarded-for') || 'unknown';

  const { error: dbError } = await supabase
    .from('evidence_logs')
    .insert({
      user_id: user?.id || null,
      file_hash: clientHash,
      hash_algorithm: 'sha256',
      storage_path: uploadData.path,
      file_name: file.name,
      file_size_bytes: file.size,
      mime_type: file.type,
      client_ip: clientIp,
      user_agent: headersList.get('user-agent'),
      
      // --- Lesson 8 新增字段 ---
      verification_status: finalStatus, // 数据库主状态被 AI 更新了
      ai_audit_status: aiResult?.status || 'service_unavailable',
      ai_confidence_score: aiResult?.confidence_score || 0,
      ai_audit_summary: aiResult?.meta_data?.content_summary || 'No summary',
      ai_risk_flags: aiResult?.risk_flags || [],
      ai_full_response: aiResult || {} // 存完整的 JSON 留作证据
    })
    .select();

  if (dbError) {
    console.error('Evidence Log Error:', dbError);
    return { error: 'Evidence Logging Failed', success: false };
  }

  return { success: true, path: uploadData.path, aiStatus: finalStatus };
}