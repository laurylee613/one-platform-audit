import LicenseFileUploader from './license-file-uploader' // <--- 新增这行
import { createClient } from '@/utils/supabase/server_backup'
import { redirect } from 'next/navigation'
import { createLicense, deleteLicense } from './actions'

export default async function LicensesPage() {
  const supabase = await createClient()

  // 1. 验证用户
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // 2. 获取证照列表 (按过期时间排序，快过期的排前面)
  const { data: licenses } = await supabase
    .from('licenses')
    .select('*')
    .order('expire_date', { ascending: true }) // nulls last 自动处理

  // --- 💡 芒格算法: 计算剩余天数与状态颜色 ---
  function getStatusColor(dateString: string | null) {
    if (!dateString) return 'bg-gray-100 text-gray-600 border-gray-200' // 长期有效
    
    const today = new Date()
    const expireDate = new Date(dateString)
    const diffTime = expireDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'bg-red-50 text-red-700 border-red-200' // 🔴 已过期
    if (diffDays <= 30) return 'bg-yellow-50 text-yellow-700 border-yellow-200' // 🟡 30天内到期
    return 'bg-green-50 text-green-700 border-green-200' // 🟢 安全
  }

  function getStatusText(dateString: string | null) {
    if (!dateString) return '长期'
    
    const today = new Date()
    const expireDate = new Date(dateString)
    const diffTime = expireDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return `已过期 ${Math.abs(diffDays)} 天`
    if (diffDays === 0) return '今天到期'
    return `剩 ${diffDays} 天`
  }
  // ------------------------------------------

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* 顶部栏 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">证照管理</h1>
          <p className="text-gray-500 mt-2">监控营业执照、许可证的有效期，防止过期风险。</p>
        </div>
        
        {/* 简单的添加按钮 (这里用最简模式，后续可以做成弹窗) */}
        <form action={createLicense} className="flex gap-2 items-end bg-gray-50 p-4 rounded-lg border">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">名称</label>
            <input name="name" placeholder="如: 营业执照" className="text-sm px-2 py-1 rounded border" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">类型</label>
            <select name="type" className="text-sm px-2 py-1.5 rounded border" required>
              <option value="营业执照">营业执照</option>
              <option value="经营许可">经营许可</option>
              <option value="资质证书">资质证书</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">到期日</label>
            <input type="date" name="expire_date" className="text-sm px-2 py-1 rounded border" />
          </div>
          <button type="submit" className="bg-black text-white px-4 py-1.5 rounded text-sm hover:bg-gray-800 h-fit mb-[1px]">
            + 新增
          </button>
        </form>
      </div>

      {/* 列表区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {licenses?.map((license) => (
          <div key={license.id} className="group relative flex flex-col justify-between rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-all">
            
            {/* 头部：名称与删除 */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{license.name}</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                  {license.type}
                </span>
              </div>
              <form action={deleteLicense.bind(null, license.id)}>
                <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </form>
            </div>

            {/* 中部：红绿灯状态 */}
            <div className="mt-6 flex items-center justify-between">
               <div className={`px-3 py-1 rounded-md text-sm font-medium border ${getStatusColor(license.expire_date)}`}>
                 {getStatusText(license.expire_date)}
               </div>
               <div className="text-xs text-gray-400 font-mono">
                 {license.expire_date || '长期有效'}
               </div>
            </div>

      {/* 底部：文件上传组件 */}
                <div className="mt-4 pt-4 border-t border-dashed flex justify-center">
                <LicenseFileUploader 
                  licenseId={license.id} 
                  initialUrl={license.file_url} 
                />
              </div>
            </div>
       ))
      }

        {/* 空状态 */}
        {(!licenses || licenses.length === 0) && (
           <div className="col-span-full text-center py-12 text-gray-500 border-2 border-dashed rounded-xl">
             暂无证照数据，请在上方添加。
           </div>
        )}
      </div>
    </div>
  )
}