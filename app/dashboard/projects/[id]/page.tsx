import { createClient } from '@/utils/supabase/server_backup'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { completeProject } from '../actions' // 引入刚才写的动作
import UploadButton from './upload-button' // 👈 1. 引入新组件

export default async function ProjectDetailsPage({
  params
}: {
  params: Promise<{ id: string }> // <--- 改动1: 类型变成 Promise
}) {
  const supabase = await createClient()
  const { id } = await params // <--- 改动2: 先等待参数解析拿到 id

  // 1. 验证登录
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // 2. 根据 id 获取项目详情
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id) // <--- 改动3: 使用解析后的 id
    .single()

  if (error || !project) {
    notFound()
  }

  return (
    <div className="p-6 max-w-4xl space-y-8">
      {/* 顶部导航 */}
      <div className="flex items-center text-sm text-gray-500">
        <Link href="/dashboard/projects" className="hover:text-black hover:underline">
          ← 返回项目列表
        </Link>
      </div>

      {/* 头部：标题与状态 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{project.name}</h1>
          <p className="mt-2 text-gray-500">项目 ID: {project.id}</p>
        </div>
        
        {/* 状态按钮区域 */}
        <div className="flex items-center gap-3">
          {project.status === 'ongoing' ? (
            <form action={completeProject}>
              <input type="hidden" name="id" value={project.id} />
              <button 
                type="submit"
                className="rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                🏁 标记为已结项
              </button>
            </form>
          ) : (
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-700 border border-green-200">
              ✓ 已结项
            </span>
          )}
          
          {/* 进行中标签 */}
          {project.status === 'ongoing' && (
             <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200">
               进行中
             </span>
          )}
        </div>
      </div>

      {/* 核心数据卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">研发预算</h3>
          <p className="mt-2 text-2xl font-semibold">
            ¥ {project.budget?.toLocaleString() || '0'}
          </p>
        </div>
        
        <div className="p-6 rounded-xl border bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">立项时间</h3>
          <p className="mt-2 text-2xl font-semibold">
            {new Date(project.created_at).toLocaleDateString('zh-CN')}
          </p>
        </div>

        <div className="p-6 rounded-xl border bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">关联产出</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-400">
            0 <span className="text-sm font-normal">项专利</span>
          </p>
        </div>
      </div>

      {/* 占位区域 */}
      <div className="rounded-xl border bg-gray-50 p-12 text-center border-dashed">
        <h3 className="text-lg font-medium text-gray-900">项目文档与附件</h3>
        <p className="mt-1 text-sm text-gray-500">在此处上传需求文档、立项书或会议纪要。</p>

        <div className="mt-4">
             <UploadButton />
          </div>
      </div>
    </div>
  )
}