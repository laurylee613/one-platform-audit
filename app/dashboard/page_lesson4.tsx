import { createClient } from '@/utils/supabase/server_backup'
import { Briefcase, ScrollText, CreditCard, Users } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. 获取当前用户 (为了显示欢迎语)
  const { data: { user } } = await supabase.auth.getUser()

  // 2. 并行查询四张表的真实数量 (高效并发)
  const [
    { count: projectCount },
    { count: patentCount },
    { count: licenseCount },
    { count: customerCount }
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }), // 查项目数
    supabase.from('patents').select('*', { count: 'exact', head: true }),  // 查专利数
    supabase.from('licenses').select('*', { count: 'exact', head: true }), // 查证照数
    supabase.from('customers').select('*', { count: 'exact', head: true }) // 查客户数
  ])

  // 定义卡片配置
  const stats = [
    { 
      name: '研发项目数', 
      value: projectCount || 0, 
      subtext: '当前在库项目',
      icon: Briefcase 
    },
    { 
      name: '有效专利', 
      value: patentCount || 0, 
      subtext: '已录入知识产权',
      icon: ScrollText 
    },
    { 
      name: '持有证照', 
      value: licenseCount || 0, 
      subtext: '系统管理中',
      icon: CreditCard 
    },
    { 
      name: '合作客户', // 把原本虚构的“本月申报”改成真实的客户数
      value: customerCount || 0, 
      subtext: '活跃合作伙伴',
      icon: Users 
    },
  ]

  return (
    <div className="space-y-8">
      {/* 欢迎语区域 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.email?.split('@')[0]}
        </h1>
        <p className="text-gray-500 mt-2">
          这是您今日的资产概览
        </p>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.name} 
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</h3>
                <p className="text-xs text-gray-400 mt-1">{stat.subtext}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <stat.icon className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 系统通知区域 */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">系统通知</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-gray-600 pb-3 border-b border-gray-50 last:border-0">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <p>系统 v1.0 正式上线，全量数据已接入真实数据库。</p>
            <span className="ml-auto text-xs text-gray-400">刚刚</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
             <span className="w-2 h-2 rounded-full bg-blue-500"></span>
             <p>您的账户 {user?.email} 已完成实名认证。</p>
             <span className="ml-auto text-xs text-gray-400">1小时前</span>
          </div>
        </div>
      </div>
    </div>
  )
}