export default function ErrorPage() {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
        <h1 className="text-6xl font-bold text-red-500">Oops!</h1>
        <p className="mt-4 text-xl text-gray-700">登录或注册过程中发生了错误。</p>
        <div className="mt-8">
          <a
            href="/login"
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            返回重试
          </a>
        </div>
      </div>
    )
  }