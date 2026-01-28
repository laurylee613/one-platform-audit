'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createAsset } from './actions'; // <--- 关键修改：从 actions.ts 导入逻辑
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

// 提交按钮组件（为了显示 Loading 状态）
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? '正在存档...' : '提交资产'}
    </Button>
  );
}

export default function AdminInputPage() {
  // 使用 Server Action
  const [state, formAction] = useFormState(createAsset, { message: '' });
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);

  return (
    <div className="container mx-auto p-8 max-w-xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">📝 资产入库</h1>
        <p className="text-muted-foreground text-sm">行政专用 · 专利/软著录入通道</p>
      </div>

      <form action={formAction} className="space-y-6 bg-card p-6 border rounded-xl shadow-sm">
        
        {/* 资产名称 */}
        <div className="space-y-2">
          <Label htmlFor="name">资产名称</Label>
          <Input id="name" name="name" placeholder="例如：一种高效率的..." required />
        </div>

        {/* 资产类型 */}
        <div className="space-y-2">
          <Label>资产类型</Label>
          <Select name="type" required>
            <SelectTrigger>
              <SelectValue placeholder="选择类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="专利">📄 专利 (Patent)</SelectItem>
              <SelectItem value="软著">💻 软著 (Copyright)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 到期日 (难点) */}
        <div className="space-y-2 flex flex-col">
          <Label>到期日期</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !expiryDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expiryDate ? format(expiryDate, "yyyy-MM-dd") : <span>选择日期</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={expiryDate}
                onSelect={(date) => {
                  setExpiryDate(date);
                  // 自动填充隐藏 Input
                  const hiddenInput = document.getElementById('hidden-date') as HTMLInputElement;
                  if (hiddenInput && date) hiddenInput.value = format(date, 'yyyy-MM-dd');
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {/* 隐藏的 Input，用于给 Server Action 传值 */}
          <input 
            type="hidden" 
            id="hidden-date" 
            name="expiry_date" 
            value={expiryDate ? format(expiryDate, 'yyyy-MM-dd') : ''} 
          />
        </div>

        {/* 关联项目 */}
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox id="has_project" name="has_project" />
          <Label htmlFor="has_project" className="cursor-pointer">
            已关联研发项目? (若未关联则视为<span className="text-red-500">风险</span>)
          </Label>
        </div>

        {/* 提交按钮 */}
        <div className="pt-4">
          <SubmitButton />
        </div>

        {/* 结果提示 */}
        {state?.message && (
          <div className={cn(
            "p-3 rounded-md text-sm text-center font-medium animate-in fade-in slide-in-from-top-2",
            state.message.includes('成功') ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          )}>
            {state.message}
          </div>
        )}
      </form>
    </div>
  );
}