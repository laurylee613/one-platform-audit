'use server';

import { createClient } from '@/utils/supabase/server_backup';
import { revalidatePath } from 'next/cache';

// 定义表单状态类型
export type FormState = {
  message: string;
}

export async function createAsset(prevState: FormState, formData: FormData): Promise<FormState> {
  // 1. 连接数据库
  const supabase = await createClient();

  // 2. 提取数据
  const name = formData.get('name') as string;
  const type = formData.get('type') as string;
  const expiry_date_str = formData.get('expiry_date') as string;
  const has_project = formData.get('has_project') === 'on';

  // 3. 验证数据
  if (!name || !type || !expiry_date_str) {
    return { message: '❌ 错误：请填写所有必填项（名称、类型、到期日）。' };
  }

  // 4. 写入 Supabase
  const { error } = await supabase.from('assets').insert({
    name,
    type,
    expiry_date: new Date(expiry_date_str),
    has_project,
  });

  if (error) {
    console.error('Supabase Error:', error);
    return { message: `❌ 录入失败: ${error.message}` };
  }

  // 5. 刷新缓存（可选）
  revalidatePath('/admin/input');
  
  return { message: '✅ 录入成功！资产已存档。' };
}