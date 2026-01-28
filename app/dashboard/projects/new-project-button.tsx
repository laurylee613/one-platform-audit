'use client'

import { useState } from 'react'
import { createProject } from './actions'

export default function NewProjectButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    await createProject(formData)
    setIsLoading(false)
    setIsOpen(false) // 提交成功后关闭弹窗
  }

  return (
    <>
      {/* 1. 触发按钮 */}
      <button 
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
      >
        + 新建项目
      </button>

      {/* 2. 弹窗 (Modal) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">创建新研发项目</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* 表单区域 */}
            <form action={handleSubmit} className="space-y-4">
              
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none">
                  项目名称 <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  placeholder="例如：下一代 AI 芯片研发"
                  className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="budget" className="text-sm font-medium leading-none">
                  研发预算 (万元)
                </label>
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  placeholder="0.00"
                  className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                  disabled={isLoading}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {isLoading ? '创建中...' : '立即创建'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  )
}