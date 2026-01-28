'use server'

import { createClient } from '@/utils/supabase/server_backup'
import { revalidatePath } from 'next/cache'

// 修复：移除返回值
export async function createPatent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const status = 'draft'

  if (!name || !type) return

  const { error } = await supabase
    .from('patents')
    .insert({
      name,
      type,
      status,
      user_id: user.id
    })

  if (error) {
    console.error('Create Patent Error:', error)
    return
  }

  revalidatePath('/dashboard/patents')
}

// 2. 更新文件
export async function updatePatentFile(patentId: string, fileUrl: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('patents')
    .update({ file_url: fileUrl })
    .eq('id', patentId)

  if (error) {
    console.error('File Link Error:', error)
    return { error: 'Failed' } // Client Component 调用，保留返回无妨，或者也删掉
  }

  revalidatePath('/dashboard/patents')
  return { success: true }
}

// 3. 删除专利
export async function deletePatent(patentId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('patents')
    .delete()
    .eq('id', patentId)

  if (error) {
    console.error('Delete Error:', error)
    return
  }

  revalidatePath('/dashboard/patents')
}