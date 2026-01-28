'use client';

import { useState, useRef } from 'react';
import { computeSHA256 } from '@/utils/crypto';
import { uploadEvidence } from '@/app/actions/upload-evidence'; // 引入刚才写的 Action

export default function EvidenceUploader() {
  const [status, setStatus] = useState<'idle' | 'hashing' | 'uploading' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<string>(''); // 用于展示过程日志
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 阶段 1: 提取指纹
      setStatus('hashing');
      setLogs(`正在提取数字指纹 (SHA-256)...`);
      
      const hash = await computeSHA256(file);
      setLogs(prev => prev + `\n指纹锁定: ${hash.substring(0, 16)}...`);

      // 阶段 2: 加密传输
      setStatus('uploading');
      setLogs(prev => prev + `\n正在建立安全传输通道...`);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('file_hash', hash); // 把指纹一起传过去

      const result = await uploadEvidence(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      setStatus('success');
      setLogs(prev => prev + `\n✅ 存证成功！证据链 ID 已生成。`);

    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setLogs(prev => prev + `\n❌ 错误: ${err.message}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${status === 'error' ? 'border-red-300 bg-red-50' : 
            status === 'success' ? 'border-green-300 bg-green-50' : 
            'border-slate-300 hover:bg-slate-50'}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          disabled={status === 'hashing' || status === 'uploading'}
        />
        
        {status === 'idle' && (
          <div className="text-slate-500">
            <p className="font-semibold">点击上传资产证据</p>
            <p className="text-xs mt-1">支持 PDF, PNG, JPG (自动 SHA-256 校验)</p>
          </div>
        )}

        {(status === 'hashing' || status === 'uploading') && (
          <div className="text-blue-600 animate-pulse">
            <p className="font-bold">{status === 'hashing' ? '正在计算哈希...' : '正在入库...'}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-green-600">
            <p className="font-bold text-lg">🛡️ 已固化</p>
          </div>
        )}
      </div>

      {/* 过程日志 (The Black Box Output) - 增加专业感 */}
      {logs && (
        <div className="mt-4 p-3 bg-slate-900 rounded text-xs font-mono text-green-400 whitespace-pre-line">
          {logs}
        </div>
      )}
    </div>
  );
}