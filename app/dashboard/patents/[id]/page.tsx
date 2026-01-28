import { createClient } from '@/utils/supabase/server_backup'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import FileUploader from './file-uploader' // <--- 1. 引入组件

export default async function PatentDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id } = await params

  // 1. 验证登录
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // 2. 获取专利详情
  const { data: patent, error } = await supabase
    .from('patents')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !patent) {
    notFound()
  }

  return (
    <div className="p-6 max-w-4xl space-y-8">
      {/* 顶部导航 */}
      <div className="flex items-center text-sm text-gray-500">
        <Link href="/dashboard/patents" className="hover:text-black hover:underline">
          ← 返回知识产权库
        </Link>
      </div>

      {/* 头部信息 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{patent.name}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span className="font-mono">ID: {patent.id.slice(0, 8)}...</span>
            <span>•</span>
            <span>{patent.type}</span>
          </div>
        </div>
        
        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
          patent.status === 'granted' ? 'bg-green-100 text-green-700 border border-green-200' :
          patent.status === 'submitted' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
          'bg-gray-100 text-gray-700 border border-gray-200'
        }`}>
          {patent.status === 'granted' ? '已授权' : 
           patent.status === 'submitted' ? '受理中' : '撰写中'}
        </span>
      </div>

      {/* 核心数据 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">申请号 / 登记号</h3>
          <p className="mt-2 text-2xl font-mono font-semibold tracking-wide">
            {patent.application_no || '暂无'}
          </p>
        </div>
        
        <div className="p-6 rounded-xl border bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">创建时间</h3>
          <p className="mt-2 text-2xl font-semibold">
            {new Date(patent.created_at).toLocaleDateString('zh-CN')}
          </p>
        </div>
      </div>

      {/* ▼▼▼ 2. 这里的旧代码被删除了，换成了新逻辑 ▼▼▼ */}
      <div className="rounded-xl border bg-gray-50 p-12 text-center border-dashed">
        <h3 className="text-lg font-medium text-gray-900">官方通知书与文件</h3>
        <p className="mt-1 text-sm text-gray-500 mb-6">在此处归档受理通知书、补正通知书或证书扫描件。</p>
        
        {/* 如果已有文件，显示查看链接；否则显示上传按钮 */}
        {patent.file_url ? (
          <div className="flex flex-col items-center gap-2">
            <a 
              href={patent.file_url} 
              target="_blank" 
              className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 border border-blue-200"
            >
              📄 查看已归档文件
            </a>
            <p className="text-xs text-gray-400">如需修改请联系管理员</p>
          </div>
        ) : (
          <FileUploader patentId={patent.id} />
        )}
      </div>
      {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}
    </div>
  )
}