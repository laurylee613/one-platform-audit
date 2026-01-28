'use client'

import { useState } from 'react'
import { runAuditAgent } from './actions'

export default function Lesson4Page() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleAudit = async () => {
    if (!input) return;
    setLoading(true);
    setResult(null);

    const res = await runAuditAgent(input);
    
    setLoading(false);
    if (res.success) {
      setResult(res.data);
    } else {
      setResult({ error: res.error });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🕵️‍♂️ 高企资质预审专家 (Lesson 4 Demo)
          </h1>
          <p className="text-gray-500 mt-2">
            One Platform 核心能力展示：非结构化数据清洗与风险审计 Agent
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左侧输入区 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">📋 原始资产数据 (烂数据)</h2>
            <textarea
              className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-gray-700 bg-gray-50"
              placeholder="请粘贴杂乱的资产文本，例如：&#10;王总，这是刚整理的：&#10;1. 关于采用AI将鸡毛组成羊毛分子结构的专利，26年1月21号到期..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={handleAudit}
              disabled={loading || !input}
              className={`mt-4 w-full py-3 rounded-lg font-medium transition-all ${
                loading 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? 'AI 正在审计中...' : '启动审计 (Run Workflow)'}
            </button>
          </div>

          {/* 右侧结果区 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">🛡️ 审计报告 (结构化输出)</h2>
            <div className="w-full h-80 overflow-auto bg-gray-900 rounded-lg p-4 text-sm font-mono">
              {result ? (
                <pre className="text-green-400 whitespace-pre-wrap">
                  {JSON.stringify(result, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  等待审计结果...
                </div>
              )}
            </div>
            
            {/* 简单的可视化展示：如果生成了警告信 */}
            {result?.warning_letter && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                <h3 className="text-red-800 font-bold text-sm mb-2">⚠️ 风险预警函预览</h3>
                <p className="text-red-700 text-sm whitespace-pre-line leading-relaxed">
                    {result.warning_letter}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}