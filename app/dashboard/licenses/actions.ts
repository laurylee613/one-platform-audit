'use server'

import { createClient } from '@/utils/supabase/server_backup'
import { revalidatePath } from 'next/cache'

// 1. 创建证照
export async function createLicense(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const expire_date = formData.get('expire_date') as string

  if (!name || !type) return

  const { error } = await supabase
    .from('licenses')
    .insert({
      name,
      type,
      expire_date: expire_date || null,
      user_id: user.id
    })

  if (error) {
    console.error('创建失败:', error)
    return
  }

  revalidatePath('/dashboard/licenses')
}

// 2. 更新文件链接
export async function updateLicenseFile(licenseId: string, fileUrl: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('licenses')
    .update({ file_url: fileUrl })
    .eq('id', licenseId)

  if (error) {
    console.error('文件关联失败:', error)
    return { error: '文件关联失败' } // 这里保留返回，因为是 Client Component 调用的，不会报错
  }

  revalidatePath(`/dashboard/licenses`)
  return { success: true }
}

// 3. 删除证照
export async function deleteLicense(licenseId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('licenses')
    .delete()
    .eq('id', licenseId)

  if (error) {
     console.error('删除失败')
     return
  }

  revalidatePath('/dashboard/licenses')
}