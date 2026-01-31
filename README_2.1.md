# 🛡️ One Platform | AI Asset Audit System

> **v2.2 Enterprise Edition - The "Code Vault" Update** > _Built by Carbon-Silicon Task Force_

![Status](https://img.shields.io/badge/Status-Production-green) ![Stack](https://img.shields.io/badge/Tech-Next.js%20%7C%20Supabase%20%7C%20Coze-blue)

## 📖 项目简介 (Introduction)

**One Platform** 是一个面向 B 端的 **AI 资产审计 SaaS 系统**。它利用大模型 Agent (Coze) 对非结构化的商业文本（如专利、合同、会议纪要）进行自动化合规审查与风险评估。

在 **v2.2 版本**中，我们引入了核心特性 **"Code Vault" (数字金库)**，实现了从“纯文本审计”到“多模态证据链”的跨越，确保每一份审计报告都具备不可抵赖性。

---

## 🚀 核心特性 (Key Features)

### 1. 🤖 AI 智能审计 (AI Audit Engine)
- 集成 **Coze Agent API**，自动清洗杂乱文本。
- 自动生成风险预警函 (Warning Letter) 与合规评分。
- 能够识别逻辑漏洞与法律风险点。

### 2. 🔒 数字证据金库 (The Code Vault) ✨ *New in v2.2*
- **工业级上传组件**：基于 React `useRef` 构建的拖拽上传区域，支持图片/PDF。
- **不可篡改存储**：文件存储于 Supabase 私有桶 (`evidence-vault`)。
- **证据链闭环**：数据库记录与原始文件一一对应，形成完整审计链条。

### 3. 🛡️ 铁穹安全架构 (Iron Dome Security)
- **RLS (Row Level Security)**：基于 Postgres 的行级安全策略。
- **Owner Access Only**：严格限制只有数据拥有者才能上传和查看自己的凭证。
- **Secure Handling**：前端直传云端，后端签名访问，无中间人泄露风险。

---

## 🛠️ 技术栈 (Tech Stack)

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js Server Actions, Supabase (PostgreSQL)
- **Storage**: Supabase Storage Buckets
- **AI Core**: Coze (ByteDance) Agent API
- **Deployment**: Vercel Git Integration

---

## 📂 项目结构 (Project Structure)

```bash
├── app/
│   ├── dashboard/
│   │   ├── page.tsx          # 服务端：负责数据获取 (Server Component)
│   │   └── actions.ts        # 后端：处理表单提交与数据库写入
│   └── login/                # 用户认证模块
├── components/
│   ├── DashboardClient.tsx   # 客户端：负责 UI 交互与状态管理
│   └── EvidenceUploader.tsx  # 核心组件：工业级拖拽上传 (v2.2 新增)
├── utils/
│   └── supabase/             # Supabase 客户端配置
└── public/

---

## 🚦 快速开始 (Getting Started)

### 1. 克隆项目
```bash
git clone [https://github.com/Laurylee613/one-platform.git](https://github.com/Laurylee613/one-platform.git)