import Link from 'next/link'
import NewPatentButton from './new-patent-button'
import { createClient } from '@/utils/supabase/server_backup'
import { redirect } from 'next/navigation'

export default async function PatentsPage() {
  const supabase = await createClient()

  // 1. 验证登录
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // 2. 获取专利数据
  const { data: patents } = await supabase
    .from('patents')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">知识产权库</h1>
        <NewPatentButton />
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">专利名称</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">类型</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">申请号</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">状态</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody>
              {patents?.map((patent) => (
                <tr key={patent.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium">{patent.name}</td>
                  <td className="p-4 align-middle">{patent.type}</td>
                  <td className="p-4 align-middle font-mono text-xs text-muted-foreground">
                    {patent.application_no || '-'}
                  </td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      patent.status === 'granted' ? 'bg-green-100 text-green-800' :
                      patent.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {patent.status === 'granted' ? '已授权' : 
                       patent.status === 'submitted' ? '受理中' : '撰写中'}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-right">
                  <Link 
                    href={`/dashboard/patents/${patent.id}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    详情
                    </Link>
                  </td>
                </tr>
              ))}
              
              {(!patents || patents.length === 0) && (
                <tr>
                   <td colSpan={5} className="p-8 text-center text-muted-foreground">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}