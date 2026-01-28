'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // 1. 先把表单里的数据拿出来
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  // 2. 提取邮箱前缀作为默认昵称 (例如 admin@demo.com -> 昵称: admin)
  // 这一步必须在 const data 之前做
  const defaultName = email ? email.split('@')[0] : 'New User'

  // 3. 组装发给 Supabase 的数据包
  const data = {
    email: email,
    password: password,
    options: {
      data: {
        full_name: defaultName, // 把这个名字传给 Supabase
        avatar_url: '',
      },
    },
  }

  // 4. 发送注册请求
  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log("❌ 注册失败原因:", error.message)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}