import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. 保留您原有的忽略规则 (防止部署报错)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // 2. 新增：服务器动作扩容 (解决 1MB 限制问题)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // 扩大到 10MB
    },
  },
};

export default nextConfig;