'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { updateLicenseFile } from './actions' // 引用同目录下的 actions

// 接收 licenseId 和已有的文件链接
export default function LicenseFileUploader({ 
  licenseId, 
  initialUrl 
}: { 
  licenseId: string, 
  initialUrl?: string | null 
}) {
  const [isUploading, setIsUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const supabase = createClient()

      // 1. 生成文件名: licenses/ID/时间戳.后缀
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `licenses/${licenseId}/${fileName}`

      // 2. 上传
      const { error: uploadError } = await supabase.storage
        .from('one-platform-files')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 3. 获取链接
      const { data: { publicUrl } } = supabase.storage
        .from('one-platform-files')
        .getPublicUrl(filePath)

      // 4. 存入数据库
      const result = await updateLicenseFile(licenseId, publicUrl)
      if (result?.error) throw new Error(result.error)

      alert('✅ 上传成功！')
      
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : '上传失败'
        alert('上传失败: ' + message)
      } finally {
      setIsUploading(false)
    }
  }

  // 📺 状态一：如果已经有文件，显示"查看"按钮
  if (initialUrl) {
    return (
      <div className="text-center">
        <a 
          href={initialUrl} 
          target="_blank" 
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          📄 查看扫描件
        </a>
      </div>
    )
  }

  // 📤 状态二：如果没有文件，显示"上传"按钮
  return (
    <div className="text-center">
      <label 
        htmlFor={`upload-${licenseId}`} 
        className={`inline-block cursor-pointer text-xs font-medium px-3 py-1.5 rounded border transition-colors
          ${isUploading 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-600 hover:bg-gray-50 border-dashed border-gray-300'
          }`}
      >
        {isUploading ? '⏳ 上传中...' : '+ 上传扫描件'}
      </label>
      
      <input
        id={`upload-${licenseId}`}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleUpload}
        disabled={isUploading}
        className="hidden" 
      />
    </div>
  )
}