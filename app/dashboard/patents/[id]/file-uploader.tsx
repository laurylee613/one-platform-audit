'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { updatePatentFile } from '../actions'

export default function FileUploader({ patentId }: { patentId: string }) {
  const [isUploading, setIsUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const supabase = createClient()

      // 【核心修复】: 剔除中文文件名，改用纯数字命名
      const fileExt = file.name.split('.').pop() // 拿到后缀 pdf/png
      const fileName = `${Date.now()}.${fileExt}` // 变成 123456789.pdf
      const filePath = `patents/${patentId}/${fileName}`

      // 2. 上传文件
      const { error: uploadError } = await supabase.storage
        .from('one-platform-files')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 3. 获取公开链接
      const { data: { publicUrl } } = supabase.storage
        .from('one-platform-files')
        .getPublicUrl(filePath)

      // 4. 存入数据库
      const result = await updatePatentFile(patentId, publicUrl)
      if (result?.error) throw new Error(result.error)

      alert('✅ 上传成功！')
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '上传失败'
      alert('上传失败: ' + message)
    }finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="mt-4">
      <label 
        htmlFor="upload-btn" 
        className={`inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors cursor-pointer
          ${isUploading 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
      >
        {isUploading ? '⏳ 上传中...' : '📤 上传官方通知书/证书'}
      </label>
      
      <input
        id="upload-btn"
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleUpload}
        disabled={isUploading}
        className="hidden" 
      />
    </div>
  )
}