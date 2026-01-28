'use server'

import { createClient } from '@/utils/supabase/server_backup'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// 修复：移除返回值
export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const full_name = formData.get('full_name') as string
  const company_name = formData.get('company_name') as string
  const department = formData.get('department') as string
  const job_title = formData.get('job_title') as string
  const avatar_url = formData.get('avatar_url') as string

  const updates = {
    id: user.id,
    full_name,
    company_name,
    department,
    job_title,
    avatar_url,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from('profiles').upsert(updates)

  if (error) {
    console.error('更新失败:', error)
    return
  }

  revalidatePath('/dashboard') 
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}