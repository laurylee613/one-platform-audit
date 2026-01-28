import Link from 'next/link'  // <--- 加这一行
import { createClient } from '@/utils/supabase/server_backup'
import { redirect } from 'next/navigation'
import NewProjectButton from './new-project-button' // <--- 1. 引入新组件

export default async function ProjectsPage() {
  const supabase = await createClient()

  // 1. 验证登录
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // 2. 获取该用户的所有项目
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">研发项目库</h1>
        {/* 2. 使用新组件替换旧按钮 */}
        <NewProjectButton />
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">项目名称</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">预算 (万元)</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">状态</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">创建时间</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {projects?.map((project) => (
                <tr key={project.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium">{project.name}</td>
                  {/* 我顺便帮你加了一列显示预算，如果之前表里没填就是 0 */}
                  <td className="p-4 align-middle text-muted-foreground">
                    ¥ {project.budget?.toLocaleString() || '0'}
                  </td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      project.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status === 'completed' ? '已完成' : '进行中'}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {new Date(project.created_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="p-4 align-middle text-right">
                  <Link 
                      href={`/dashboard/projects/${project.id}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      查看详情
                    </Link>
                  </td>
                </tr>
              ))}
              
              {(!projects || projects.length === 0) && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    暂无项目，请点击右上角新建
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}