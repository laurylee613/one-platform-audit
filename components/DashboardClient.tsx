'use client'; // 👈 声明这是客户端组件

import { useState } from 'react';
import EvidenceUploader from '@/components/EvidenceUploader';
import { runAuditAndSave } from '@/app/dashboard/actions'; // 确保路径对

export default function DashboardClient({ user, initialAssets }: { user: any, initialAssets: any[] }) {
  const [evidencePath, setEvidencePath] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">🛡️ 资产审计工作台</h1>
            <p className="mt-1 text-sm text-gray-500">One Platform v2.1 Enterprise Edition</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">{user.email?.split('@')[0]} (在线)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左侧：输入区 (占 4 列) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                📝 提交原始数据
              </h2>

              {/* 1. 上传组件区域 */}
              <div className="mb-6">
                 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    原始凭证 (Evidence)
                  </label>
                  <EvidenceUploader 
                    onUploadSuccess={(path, name) => {
                      console.log('凭证已锁定:', path);
                      setEvidencePath(path);
                    }} 
                  />
                  {evidencePath && (
                    <p className="text-xs text-green-600 mt-2 font-mono">🔒 Hash: {evidencePath.split('/')[1]?.slice(0,12)}...</p>
                  )}
              </div>

              {/* 2. 表单区域 */}
              <form action={runAuditAndSave} className="space-y-4">
                {/* 关键：把上传的文件路径通过隐藏字段传给 Server Action */}
                <input type="hidden" name="evidencePath" value={evidencePath || ''} />

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    非结构化输入 (Unstructured Input)
                  </label>
                  <textarea
                    name="rawText"
                    rows={8}
                    className="block w-full rounded-lg border-gray-200 bg-gray-50 p-4 text-sm focus:border-indigo-500 focus:ring-indigo-500 transition resize-none"
                    placeholder="请直接粘贴杂乱的文本、OCR 识别结果或语音转录内容..."
                    defaultValue="王总，这是刚刚整理的专利，关于采用AI将鸡毛组成羊毛分子结构的，有效期到2026年..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:scale-[1.02]"
                >
                  <span>⚡ 启动 AI 审计引擎</span>
                </button>
              </form>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="text-blue-800 font-semibold text-sm mb-1">💡 提示</h3>
              <p className="text-blue-600 text-xs leading-relaxed">
                系统支持处理混乱的口语、包含错别字的文本以及不完整的专利描述。AI 将自动完成清洗与合规性校验。
              </p>
            </div>
          </div>

          {/* 右侧：资产流 (占 8 列) */}
          <div className="lg:col-span-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">🗄️ 审计报告历史 ({initialAssets?.length || 0})</h2>
            </div>
            
            <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {initialAssets?.map((asset) => {
                // 解析逻辑
                let parsedContent: any = {}
                let warningLetter = "解析中..."
                let riskLevel = "unknown"

                try {
                    const rawContent = asset.content
                    if (rawContent && rawContent.data) {
                        const innerData = JSON.parse(rawContent.data)
                        parsedContent = innerData
                        warningLetter = innerData.warning_letter || innerData.output || "未生成预警函"
                        riskLevel = innerData.risk_level || "high" 
                    } else {
                        warningLetter = JSON.stringify(rawContent)
                    }
                } catch (e) {
                    warningLetter = "数据解析错误 (Raw format)"
                }

                return (
                  <div key={asset.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                            riskLevel === 'high' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {riskLevel === 'high' ? 'High Risk' : 'Pass'}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">ID: {asset.id.slice(0, 8)}</span>
                        {/* 如果有附件，显示个小图标 */}
                        {asset.evidence_path && (
                            <span className="flex items-center text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                📎 包含附件
                            </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(asset.created_at).toLocaleString('zh-CN')}
                      </span>
                    </div>

                    <div className="p-6">
                      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        📄 风险预警函 / 审计意见
                      </h3>
                      <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-serif">
                          {warningLetter}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {initialAssets?.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-dashed border-gray-300">
                  <div className="text-4xl mb-2">🍃</div>
                  <p className="text-gray-500 font-medium">暂无审计记录</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}