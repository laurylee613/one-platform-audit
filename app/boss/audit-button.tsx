'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { auditAsset } from './actions'; 
import { Loader2, Sparkles } from 'lucide-react';

// 定义接口，增加 initialData 可选参数
interface AuditButtonProps {
  assetName: string;
  initialData?: {
    score: string | null;
    risk_level: string | null;
    comment: string | null;
  };
}

export default function AuditButton({ assetName, initialData }: AuditButtonProps) {
  const [loading, setLoading] = useState(false);
  
  // 如果数据库里已经有数据，直接作为初始状态！
  const [result, setResult] = useState<any>(
    initialData && initialData.score 
      ? { score: initialData.score, risk_level: initialData.risk_level, comment: initialData.comment } 
      : null
  );

  const handleAudit = async () => {
    setLoading(true);
    const res = await auditAsset(assetName);
    setLoading(false);

    if (res.success) {
      setResult(res.data);
    } else {
      alert('审计失败: ' + res.message);
    }
  };

  // 如果有结果（无论是刚才算的，还是数据库读出来的），直接显示卡片
  if (result) {
    return (
      <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-700">🤖 AI 审计报告</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${result.risk_level?.includes('高') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {result.risk_level}
            </span>
        </div>
        <div className="mb-2">
            <span className="text-slate-500">含金量评分：</span>
            <span className="font-mono font-bold text-indigo-600">{result.score}</span>
        </div>
        <p className="text-slate-600 leading-relaxed">{result.comment}</p>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleAudit} 
      disabled={loading}
      variant="outline"
      size="sm"
      className="mt-4 w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          正在连接 Coze 大脑...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          AI 深度审计
        </>
      )}
    </Button>
  );
}