'use server'

import { createClient } from '@/utils/supabase/server_backup'
import { revalidatePath } from 'next/cache'

export async function createCustomer(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.error('未登录')
    return
  }

  const name = formData.get('name') as string
  const contact_name = formData.get('contact_name') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string

  if (!name) {
    console.error('公司名称必填')
    return
  }

  const { error } = await supabase
    .from('customers')
    .insert({
      name,
      contact_name,
      phone,
      email,
      user_id: user.id
    })

  if (error) {
    console.error('创建失败:', error)
    return 
  }

  revalidatePath('/dashboard/customers')
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('删除失败:', error)
    return
  }

  revalidatePath('/dashboard/customers')
}