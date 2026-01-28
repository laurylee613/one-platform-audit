import { createClient } from '@/utils/supabase/server_backup'
import { redirect } from 'next/navigation'
import { createCustomer, deleteCustomer } from './actions'

export default async function CustomersPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // 获取客户列表 (按创建时间倒序)
  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* 顶部：标题与新增表单 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">客户管理 (CRM)</h1>
          <p className="text-gray-500 mt-2">管理您的甲方公司、合作伙伴及联系人信息。</p>
        </div>
        
        {/* 紧凑型新增表单 */}
        <form action={createCustomer} className="flex flex-wrap gap-2 items-end bg-gray-50 p-4 rounded-lg border w-full md:w-auto">
          <div className="flex flex-col gap-1 w-full md:w-auto">
            <label className="text-xs font-medium text-gray-500">公司名称 *</label>
            <input name="name" placeholder="如: 腾讯科技" className="text-sm px-2 py-1 rounded border" required />
          </div>
          <div className="flex flex-col gap-1 w-1/2 md:w-auto">
            <label className="text-xs font-medium text-gray-500">联系人</label>
            <input name="contact_name" placeholder="姓名" className="text-sm px-2 py-1 rounded border w-24" />
          </div>
          <div className="flex flex-col gap-1 w-1/3 md:w-auto">
            <label className="text-xs font-medium text-gray-500">电话</label>
            <input name="phone" placeholder="手机号" className="text-sm px-2 py-1 rounded border w-28" />
          </div>
          <button type="submit" className="bg-black text-white px-4 py-1.5 rounded text-sm hover:bg-gray-800 h-fit mb-[1px]">
            + 添加
          </button>
        </form>
      </div>

      {/* 名片夹列表布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers?.map((customer) => (
          <div key={customer.id} className="group relative flex flex-col justify-between rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-all hover:border-blue-200">
            
            {/* 名片头部：公司名 */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
                  {customer.name.substring(0, 1)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{customer.name}</h3>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    合作中
                  </span>
                </div>
              </div>
              
              {/* 删除按钮 */}
              <form action={deleteCustomer.bind(null, customer.id)}>
                <button className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </form>
            </div>

            {/* 名片信息区 */}
            <div className="space-y-2 text-sm text-gray-600 pl-1">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>{customer.contact_name || '未填写联系人'}</span>
              </div>
              <div className="flex items-center gap-2">
                 <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>{customer.phone || '无电话'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <span className="truncate">{customer.email || '无邮箱'}</span>
              </div>
            </div>

          </div>
        ))}

        {/* 空状态 */}
        {(!customers || customers.length === 0) && (
           <div className="col-span-full text-center py-12 text-gray-500 border-2 border-dashed rounded-xl bg-gray-50">
             暂无客户数据，请建立您的第一个商业连接。
           </div>
        )}
      </div>
    </div>
  )
}