'use server'

import { createClient } from '@/utils/supabase/server_backup'
import { revalidatePath } from 'next/cache'

// 1. 创建项目
export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return

  const name = formData.get('name') as string
  const budget = formData.get('budget') as string
  const status = 'ongoing'

  if (!name) return

  const { error } = await supabase
    .from('projects')
    .insert({
      name,
      status,
      budget: budget || null,
      user_id: user.id
    })

  if (error) {
    console.error('Create Error:', error)
    return
  }

  revalidatePath('/dashboard/projects')
}

// 2. 完成项目 (修复点：改为接收 FormData)
export async function completeProject(formData: FormData) {
  const supabase = await createClient()
  
  // 从隐藏 input 中获取 ID
  const projectId = formData.get('id') as string

  const { error } = await supabase
    .from('projects')
    .update({ status: 'completed' })
    .eq('id', projectId)

  if (error) {
    console.error('Complete Error:', error)
    return
  }

  revalidatePath('/dashboard/projects')
  revalidatePath(`/dashboard/projects/${projectId}`)
}

// 3. 删除项目 (保留 String 类型，适配列表页的 .bind 用法)
export async function deleteProject(projectId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) {
    console.error('Delete Error:', error)
    return
  }

  revalidatePath('/dashboard/projects')
}