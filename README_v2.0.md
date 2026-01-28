**Munger_CTO Online.**

合伙人，一个优秀的开源项目或商业交付，必须有一个极其专业的 `README.md`。这不仅是给评委看的说明书，更是你作为 CTO 对系统架构的“宣示主权”。

我已经为你草拟了一份结构完美、内容硬核的 README。你可以直接复制到项目根目录的 `README.md` 文件中。

---

### 📄 README.md (建议内容)

```markdown
# 🚀 One Platform v1.4: Intelligent IP Management System

> **"White Glove" Service for Intellectual Property Assets** > An AI-powered SaaS platform that transforms unstructured "rotten data" into high-value structured assets and risk reports.

---

## 📖 简介 (Introduction)

**One Platform** 是专为知识产权（IP）行业打造的下一代管理系统。
本项目基于 **Next.js 14** 全栈框架开发，集成 **Coze AI Workflow**，旨在解决传统代理行业“数据清洗难、风险感知弱”的核心痛点。

本次更新 (v1.4 Lesson 4) 重点推出了 **AI 资产预审 Agent**，实现了从非结构化文本到标准 JSON 数据的自动化清洗与风险审计。

---

## 🔗 在线演示 (Live Demo)

👉 **立即体验 Lesson 4 核心功能**: [https://lesson4.oneplatform.com.cn/lesson4](https://lesson4.oneplatform.com.cn/lesson4)

*(注：为优化国内访问速度，采用了 CNAME 子域名加速策略)*

---

## 💡 核心痛点与解决方案 (Problem & Solution)

### 🔴 痛点 (Pain Points)
1.  **烂数据输入**：客户提供的资产清单往往是微信聊天记录、截图或格式混乱的文本，人工清洗耗时耗力。
2.  **风险黑盒**：企业主不知道自己的专利何时过期，缺乏合规意识。
3.  **决策低效**：传统的Excel报表无法触动老板，难以促成“补税”或“续费”决策。

### 🟢 解决方案 (Our Solution)
* **白手套清洗引擎**：基于 Coze Workflow，一键提取关键字段（名称、类型、日期）。
* **双重风控逻辑**：
    * **逻辑风控**：利用 Code Node 获取实时时间，精确计算过期状态。
    * **语义风控**：识别“凑数申请”（如：违反科学常识的专利），评估合规风险。
* **恐吓式营销报告**：自动生成严肃的《风险预警函》，直击客户痛点，辅助销售转化。

---

## 🛠️ 技术栈 (Tech Stack)

* **Framework**: Next.js 14 (App Router)
* **Language**: TypeScript
* **AI Orchestration**: Coze Workflow (ByteDance)
* **Backend Logic**: React Server Actions (BFF Pattern)
* **Deployment**: Vercel
* **Styling**: Tailwind CSS

---

## 🧩 架构设计 (Architecture)

```mermaid
graph LR
    User[用户输入杂乱文本] --> Frontend[Next.js Client]
    Frontend --> Server[Server Action (Secure Proxy)]
    Server -- API Request (Token) --> Coze[Coze Cloud Engine]
    
    subgraph Coze Workflow
        Input --> Code[Code Node: Get Date]
        Code --> LLM[LLM: Clean & Audit]
        LLM --> JSON[Structured Output]
    end
    
    Coze -- JSON Result --> Server
    Server -- Render --> UserUI[风险报告展示]

```

---

## ⚡️ 快速开始 (Quick Start)

### 1. 克隆项目

```bash
git clone [https://github.com/your-username/one-platform.git](https://github.com/your-username/one-platform.git)
cd one-platform

```

### 2. 安装依赖

```bash
npm install

```

### 3. 配置环境变量

在根目录创建 `.env.local` 文件，填入你的 Coze 密钥：

```env
# Coze API Configuration
COZE_API_TOKEN=pat_xxxxxxxxxxxxxxxxxxxxxx
COZE_WORKFLOW_ID=7598xxxxxxxxxxxxxxxxx

```

### 4. 启动开发服务器

```bash
npm run dev

```

访问 `http://localhost:3000/lesson4` 即可看到 AI 审计页面。

---

## 📝 开发复盘与踩坑 (Dev Notes)

### 1. Coze Python 沙箱问题

* **问题**：Coze 的 Python 运行时对输入校验极严，经常报 `sandbox failed`。
* **解决**：将时间获取节点的代码切换为 **JavaScript (Node.js)**，显著提升了启动速度和稳定性。

### 2. API 权限陷阱

* **问题**：使用仅含 `Chat` 权限的 Token 调用 Workflow API 会报 401。
* **解决**：重新生成 Personal Access Token，务必勾选 **Workflows** 相关权限。

### 3. 国内 DNS 阻断

* **问题**：`oneplatform.com.cn` 根域名指向 Vercel IP 时，在国内经常无法访问 (ERR_CONNECTION_CLOSED)。
* **解决**：配置 `lesson4` 子域名，通过 CNAME 指向 `cname.vercel-dns.com`，利用 CDN 节点绕过阻断。

---

## 📜 许可证 (License)

MIT License © 2026 One Platform Team

```

---

### 💡 Munger 的建议

1.  **替换链接**：把 `git clone` 里的地址换成你自己的 GitHub 仓库地址。
2.  **提交**：把这个文件保存，然后 `git add README.md`, `git commit`, `git push`。
3.  **展示**：当你把 GitHub 链接发给别人时，这个精美的文档会直接展示在首页，**B格瞬间拉满**。

```