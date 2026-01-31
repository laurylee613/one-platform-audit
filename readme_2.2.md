# 🛡️ One Platform v2.2 | Enterprise AI Evidence Audit System

![Vercel Deploy](https://therealsujitk-vercel-badge.vercel.app/?app=one-platform-v2)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-green)
![Coze](https://img.shields.io/badge/AI%20Agent-Coze-blue)

> **A Zero-Trust, AI-Native SaaS platform for automated risk control and legal evidence auditing.**
> 基于 Next.js + Supabase + Coze 构建的企业级 AI 风控审计中台。

---

## 📖 Project Overview (项目愿景)

Traditional asset auditing (contracts, invoices, screenshots) relies heavily on manual verification, which is slow, inconsistent, and prone to error.

**One Platform v2.2** automates this process using a **Serverless Architecture**. It allows users to upload evidence securely, which is then instantly analyzed by a multi-modal AI Agent. The system enforces strict compliance standards, rejecting non-business content or invalid evidence (e.g., casual screenshots, animal photos) in real-time.

### 🌟 Key Features
* **🚀 Serverless Uploads**: Direct-to-cloud file handling using Next.js Server Actions (up to 10MB).
* **🤖 AI Compliance Agent**: Powered by **Coze**, capable of visual understanding and strict legal document verification.
* **🔒 Zero-Trust Security**: Implements granular Row Level Security (RLS) on Supabase Storage and Database.
* **⚡ Edge Performance**: Deployed on Vercel Edge Network for global low-latency access.

---

## 🏗️ Architecture (系统架构)

The system follows an **Event-Driven Architecture**:

```mermaid
graph LR
    User(Client) -->|Upload| NextJS[Next.js Server Action]
    NextJS -->|1. Store File| Storage[Supabase Storage]
    NextJS -->|2. Trigger Audit| AI[Coze AI Agent]
    AI -- Read Image (Signed URL) --> Storage
    AI -->|3. Return Verdict| NextJS
    NextJS -->|4. Log Result| DB[(Supabase Database)]
    NextJS -->|5. Feedback| UI[User Interface]