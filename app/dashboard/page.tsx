import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/DashboardClient' // 引入刚才建的组件

export default async function Dashboard() {
  const supabase = await createClient()

  // 1. 检查登录
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. 拉取数据 (Server Side Fetching)
  // 这里我们把数据拉下来，传给 Client 组件
  const { data: assets } = await supabase
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false })

  // 3. 渲染 Client 组件，把数据传过去
  return <DashboardClient user={user} initialAssets={assets || []} />
}