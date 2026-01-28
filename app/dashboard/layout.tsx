import { createClient } from '@/utils/supabase/server_backup'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Briefcase, 
  ScrollText, 
  CreditCard, 
  Users, 
  Settings,
  LogOut 
} from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // 1. 获取当前登录用户
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 2. 关键修复：去 profiles 表里查这个人的详细档案（头像、名字）
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 3. 准备侧边栏菜单
  const navItems = [
    { name: '数据驾驶舱', href: '/dashboard', icon: LayoutDashboard },
    { name: '研发项目', href: '/dashboard/projects', icon: Briefcase },
    { name: '知识产权', href: '/dashboard/patents', icon: ScrollText },
    { name: '证照管理', href: '/dashboard/licenses', icon: CreditCard },
    { name: '客户管理', href: '/dashboard/customers', icon: Users },
    { name: '系统设置', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 侧边栏 Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col">
        {/* Logo 区域 */}
        <div className="h-16 flex items-center px-6 border-b border-gray-50">
          <span className="text-xl font-bold text-gray-900">ONE Platform</span>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-black transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* 用户底部栏 - 修复点：显示真实头像和名字 */}
        <div className="p-4 border-t border-gray-50">
          <div className="flex items-center gap-3">
            {/* 头像：如果有 url 就显示图片，否则显示默认图标 */}
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 bg-gray-400 rounded-full" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              {/* 名字：优先显示 Full Name，没有就显示 Email */}
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile?.full_name || '新用户'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}