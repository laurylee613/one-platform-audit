
import { createClient } from '@/utils/supabase/server';
import UploadForm from '@/components/EvidenceUploader'; // 确保你有这个组件，如果没有报错就不动

export default async function Home() {
  const supabase = await createClient();

  // 1. 获取证据日志 (按时间倒序)
  const { data: evidenceLogs } = await supabase
    .from('evidence_logs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* 头部区域 */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            One Platform <span className="text-indigo-600">v2.2</span>
          </h1>
          <p className="text-gray-500">
            企业资产合规审计与存证系统 (Project All-Seeing Eye)
          </p>
        </div>

        {/* 上传区域 */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <UploadForm />
        </div>

        {/* 证据列表区域 */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            🗄️ 审计日志
            <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {evidenceLogs?.length || 0} Records
            </span>
          </h2>

          <div className="grid gap-6">
            {evidenceLogs?.map((log) => (
              <div 
                key={log.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* 卡片头部：文件名与核心状态 */}
                <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      📄
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-md">
                        {log.file_name}
                      </h3>
                      <p className="text-xs text-gray-400 font-mono">
                        HASH: {log.file_hash?.substring(0, 12)}...
                      </p>
                    </div>
                  </div>
                  
                  {/* 状态徽章 (Status Badge) */}
                  <StatusBadge status={log.verification_status} />
                </div>

                {/* 卡片主体：AI 审计报告 */}
                <div className="px-6 py-5">
                  <div className="flex flex-col sm:flex-row gap-6">
                    
                    {/* 左侧：AI 评分 */}
                    <div className="flex-shrink-0 flex flex-col items-center justify-center min-w-[100px] border-r border-gray-100 pr-6">
                      <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                        AI Confidence
                      </div>
                      <div className={`text-3xl font-black ${getScoreColor(log.ai_confidence_score)}`}>
                        {log.ai_confidence_score || 0}
                        <span className="text-sm text-gray-300 ml-1">/100</span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        法证级置信度
                      </div>
                    </div>

                    {/* 右侧：语义解析与风险 */}
                    <div className="flex-grow space-y-3">
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          🤖 语义资产解析 (Semantic Analysis)
                        </span>
                        <p className="mt-1 text-gray-700 text-sm leading-relaxed">
                          {log.ai_audit_summary || "等待 AI 审计接入..."}
                        </p>
                      </div>

                      {/* 风险标签展示 */}
                      {log.ai_risk_flags && log.ai_risk_flags.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {log.ai_risk_flags.map((flag: string, index: number) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800">
                              ⚠️ {flag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        log.verification_status === 'verified_compliant' && (
                          <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            反欺诈校验通过 (Anti-Spoofing Passed)
                          </div>
                        )
                      )}
                    </div>

                  </div>
                </div>

                {/* 卡片底部：时间戳 */}
                <div className="px-6 py-2 bg-gray-50 border-t border-gray-100 text-right">
                  <span className="text-xs text-gray-400">
                    Timestamp: {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

// --- 辅助组件与函数 ---

function StatusBadge({ status }: { status: string }) {
  if (status === 'verified_compliant') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200">
        ✅ 法律状态锁定
      </span>
    );
  }
  if (status === 'rejected_fraud') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 ring-1 ring-red-200">
        ⛔️ 证据链驳回
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 ring-1 ring-amber-200">
      ⏳ 审计中 (Pending)
    </span>
  );
}

function getScoreColor(score: number) {
  if (!score) return 'text-gray-400';
  if (score >= 80) return 'text-emerald-600'; // 高分绿
  if (score >= 60) return 'text-amber-500';   // 及格黄
  return 'text-red-600';                      // 低分红
}