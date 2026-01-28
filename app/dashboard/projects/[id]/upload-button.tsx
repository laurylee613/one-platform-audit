'use client' // 👈 这个文件专门负责交互，所以它是客户端组件

export default function UploadButton() {
  return (
    <button
      onClick={() => alert('🚧 该功能正在开发中 (Coming Soon)...\n将在 v1.1 版本支持 PDF/Word 文档上传。')}
      className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <span className="block text-sm font-semibold text-gray-900">
        + 上传文件 (开发中)
      </span>
    </button>
  )
}