'use client'

import { useState } from 'react'
import { createPatent } from './actions'

export default function NewPatentButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 触发按钮 */}
      <button 
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        + 新增专利
      </button>

      {/* 弹窗遮罩 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          
          {/* 弹窗主体 */}
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">录入新专利</h2>
            <p className="mb-6 text-sm text-gray-500">请填写专利的基本信息，带 * 为必填项。</p>

            <form action={async (formData) => {
              await createPatent(formData)
              setIsOpen(false) // 提交后关闭弹窗
            }}>
              <div className="space-y-4">
                {/* 字段1: 专利名称 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">专利名称 *</label>
                  <input 
                    name="name"
                    required
                    placeholder="例如：一种基于AI的图像生成方法"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                {/* 字段2: 专利类型 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">类型 *</label>
                  <select 
                    name="type"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="发明专利">发明专利</option>
                    <option value="实用新型">实用新型</option>
                    <option value="外观设计">外观设计</option>
                    <option value="软著">软件著作权</option>
                  </select>
                </div>

                {/* 字段3: 申请号 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">申请号 (选填)</label>
                  <input 
                    name="application_no"
                    placeholder="例如：CN20261010202X"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* 底部按钮 */}
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  立即录入
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}