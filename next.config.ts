// next.config.ts
const nextConfig = {
  eslint: {
    // 忽略 eslint 检查
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 忽略 TS 类型错误
    ignoreBuildErrors: true,
  },
};

export default nextConfig;