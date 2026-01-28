'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

export default function AvatarUploader({ 
  url, 
  onUploadComplete 
}: { 
  url: string | null, 
  onUploadComplete: (url: string) => void 
}) {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url)

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('请选择图片')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}` // 放在 avatars 文件夹下

      const supabase = createClient()
      
      // 1. 上传
      const { error: uploadError } = await supabase.storage
        .from('one-platform-files')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 2. 获取链接
      const { data: { publicUrl } } = supabase.storage
        .from('one-platform-files')
        .getPublicUrl(filePath)

      // 3. 更新本地状态并通知父组件
      setAvatarUrl(publicUrl)
      onUploadComplete(publicUrl) // 把 URL 传回给页面表单

        } catch (error: unknown) {
        const message = error instanceof Error ? error.message : '上传失败'
        alert('上传失败: ' + message)
      }finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        {/* 圆形头像展示 */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50 flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl text-gray-300">👤</span>
          )}
        </div>

        {/* 覆盖层：上传按钮 */}
        <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity text-xs font-medium">
          {uploading ? '...' : '更换'}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </label>
      </div>
      <p className="text-xs text-gray-500">点击头像进行更换</p>
    </div>
  )
}