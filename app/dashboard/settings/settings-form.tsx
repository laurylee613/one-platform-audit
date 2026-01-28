'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // 1. 引入路由工具
import { updateProfile, signOut } from './actions'
import AvatarUploader from './avatar-uploader'

interface ProfileData {
  avatar_url?: string | null;
  full_name?: string | null;
  company_name?: string | null;
  department?: string | null;
  job_title?: string | null;
}

export default function SettingsForm({ 
  user, 
  profile 
}: { 
  user: { email?: string }; 
  profile: ProfileData | null 
}) {
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [isLoading, setIsLoading] = useState(false) // 2. 增加加载状态
  const router = useRouter()

  // 3. 自定义提交处理函数
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault() // 阻止默认的表单跳转
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    
    // 调用服务器动作
    await updateProfile(formData)

    // 4. 成功后的连招
    setIsLoading(false)
    alert('✅ 资料保存成功！') // 弹窗提示
    router.refresh() // 强制刷新整个页面数据（包括侧边栏！）
  }

  return (
    <div className="space-y-8">
      {/* 头像部分 */}
      <AvatarUploader 
        url={avatarUrl} 
        onUploadComplete={(url) => setAvatarUrl(url)} 
      />

      {/* 资料表单 - 改为 onSubmit */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="hidden" name="avatar_url" value={avatarUrl} />

        {/* 基础信息区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700">账号邮箱</label>
             <input type="text" value={user.email} disabled className="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-500 cursor-not-allowed"/>
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700">显示名称</label>
             <input name="full_name" defaultValue={profile?.full_name || ''} placeholder="您的姓名" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black outline-none"/>
          </div>
        </div>

        {/* 职业信息区域 */}
        <div className="pt-4 border-t border-dashed">
          <h3 className="text-sm font-medium text-gray-900 mb-4">职业信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500">所属公司</label>
              <input name="company_name" defaultValue={profile?.company_name || ''} placeholder="例如: 腾讯科技" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black outline-none text-sm"/>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500">所在部门</label>
              <input name="department" defaultValue={profile?.department || ''} placeholder="例如: 研发部" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black outline-none text-sm"/>
            </div>
            <div className="space-y-2 col-span-full md:col-span-1">
              <label className="text-xs font-medium text-gray-500">当前职位</label>
              <input name="job_title" defaultValue={profile?.job_title || ''} placeholder="例如: 产品经理" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black outline-none text-sm"/>
            </div>
          </div>
        </div>

        {/* 保存按钮 - 增加加载状态反馈 */}
        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
            isLoading ? 'bg-gray-400 cursor-wait' : 'bg-black hover:bg-gray-800'
          } text-white`}
        >
          {isLoading ? '正在保存...' : '保存修改'}
        </button>
      </form>

      {/* 退出登录保持不变 */}
      <div className="pt-4 border-t border-gray-100">
        <form action={signOut}>
          <button className="w-full text-red-600 bg-red-50 py-2.5 rounded-lg hover:bg-red-100 font-medium transition-colors">
            退出登录
          </button>
        </form>
      </div>
    </div>
  )
}