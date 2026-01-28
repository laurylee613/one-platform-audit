import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // 不要在里写任何逻辑！
  // 所有的逻辑判断（鉴权、重定向）都已委托给 updateSession 内部处理
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了静态资源
     * 必须保留这个 matcher，否则你的服务器每加载一张图片都会去请求一次 Supabase Auth
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}