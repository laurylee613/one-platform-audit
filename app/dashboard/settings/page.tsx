import { createClient } from '@/utils/supabase/server_backup'
import { redirect } from 'next/navigation'
import SettingsForm from './settings-form' // 下一步创建这个

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')

  // 获取 Profile 数据
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">系统设置</h1>
      
      <div className="bg-white rounded-xl border shadow-sm p-8">
        {/* 把表单逻辑拆分到 Client Component 以处理交互 */}
        <SettingsForm user={user} profile={profile} />
      </div>
    </div>
  )
}