# OnePlatform - 知识产权管理与 AI 审计系统

> 基于 Next.js + Supabase + Coze AI 的企业级资产管理平台。
>
> **当前状态**：✅ Lesson 3 完成 (AI 审计闭环与云端部署)

## 🚀 在线演示 (Live Demo)

👉 **Lesson 3 成果展示**: [https://lesson3.oneplatform.com.cn/boss/report](https://lesson3.oneplatform.com.cn/boss/report)

*(注：演示环境已连接 Coze 智能体与 Supabase 生产数据库，支持免登录体验 AI 审计流程)*

---

## 📅 项目迭代日志 (Changelog)

### 🟢 Lesson 3: AI Agent 深度集成 (2026-01-21)
**核心目标**：赋予系统“思考”能力，实现资产含金量的自动化评估。

**新增特性**：
* **✨ AI 审计官在线**：接入 Coze 智能体，对“将鸡毛组成羊毛结构”等离谱资产进行含金量打分与风险识别。
* **🔄 异步轮询机制**：在 Server Actions 中实现秒级轮询 (Polling)，解决 AI 响应非实时的问题。
* **💾 结果持久化**：AI 分析结果（分数/评语）自动回写至 Supabase 数据库，实现“一次分析，永久可见”。
* **⚡ 智能缓存刷新**：利用 `revalidatePath` 技术，在数据落库后强制刷新页面，解决 Vercel 缓存导致的显示延迟。
* **🌍 分支独立部署**：基于 Vercel 配置 `lesson-3` 分支的专属预览环境与域名。

**数据库变更**：
* 见 `db/schema_update_lesson3.sql` (新增 `ai_score`, `ai_risk_level`, `ai_comment` 字段)。

### 🔵 Lesson 2: 核心架构搭建 (2026-01-18)
**核心目标**：完成 Next.js 框架初始化与 Supabase 数据库连接。

**完成工作**：
* **项目初始化**：搭建 Next.js 14+ (App Router) 脚手架，配置 Tailwind CSS。
* **数据库集成**：封装 Supabase Client (`utils/supabase`)，打通前后端数据流。
* **数据建模**：设计并创建核心 `assets` 表，确立资产数据结构。
* **基础 UI**：实现资产列表页面的服务端渲染 (SSR) 与交互组件。
* **种子数据**：注入初始演示数据（专利、软著案例）。

**数据库变更**：
* 见 `db/schema_lesson2.sql` (初始化 `assets` 表结构)。

---

## 🛑 Lesson 3 开发实战与踩坑指南 (Troubleshooting)

在对接 AI Agent 与云端部署过程中，我们攻克了以下关键技术卡点：

### 1. 异步响应处理 (The "In Progress" Trap)
* **问题**：Coze API 响应异步，创建对话后直接读取结果导致为空。
* **解决**：实现 `while` 循环轮询机制，每秒检查 `status`，直到任务变更为 `completed` 再拉取消息。

### 2. Vercel 缓存机制 (Cache Invalidation)
* **问题**：数据库已更新，但 Vercel 托管页面刷新仍显示旧数据。
* **解决**：在 Server Action 写入成功后，显式调用 `revalidatePath('/boss/report')` 清除静态缓存。

### 3. Token 权限陷阱
* **问题**：部署后报错 `authentication is invalid` (Code 4100)。
* **解决**：
    1. 代码中增加 `.trim()` 防止环境变量复制时引入隐形空格。
    2. 重新生成 Coze PAT，务必勾选 **"Chat" (对话)** 权限。

### 4. 生产环境 RLS 拦截
* **问题**：本地可写入数据库，线上环境无法更新 AI 评分。
* **解决**：Supabase 默认开启 RLS (行级安全)，需为 `assets` 表添加允许 `UPDATE` 的策略，或在 MVP 阶段临时关闭 RLS。

---

## 🛠️ 本地运行指南 (How to Run)

1.  **克隆项目**
    ```bash
    git clone [https://github.com/your-username/one-platform.git](https://github.com/your-username/one-platform.git)
    cd one-platform
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **配置环境变量**
    新建 `.env.local` 文件，填入以下密钥：
    ```env
    NEXT_PUBLIC_SUPABASE_URL=你的Supabase地址
    NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase公钥
    COZE_BOT_ID=你的Coze智能体ID
    COZE_API_TOKEN=你的Coze个人访问令牌
    ```

4.  **启动服务器**
    ```bash
    npm run dev
    ```

---

## 📂 数据库归档
所有数据库变更脚本均已归档至 `/db` 目录：
* `schema_lesson2.sql`: 初始化建表
* `schema_update_lesson3.sql`: AI 字段扩容