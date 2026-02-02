# One Platform (v2.2) 核心知识库与团队架构

## 1. 组织定义与愿景
**Q: 碳硅特遣队（Carbon-Silicon Task Force）现在的定位是什么？**
[cite_start]A: 我们不再是一个临时的学习小组，而是一家具备高维竞争力的“一人公司”。我们的实体名称是 One Platform Inc.（虚拟实体）[cite: 9, 72]。

**Q: 你们的核心 Slogan 和愿景是什么？**
A: 
* **Slogan**: "Carbon Vision, Silicon Precision." [cite_start]（碳基视野，硅基精度）[cite: 30]。
* [cite_start]**愿景**: 构建 AI 时代的“零信任”商业基础设施。赋能个体，重塑契约 [cite: 31]。

**Q: 你们的行动准则（Values）是什么？**
A: 
1.  **长期主义**: 商业逻辑穿越周期，安全是底色。
2.  **价值为王**: 不解决痛点的代码一行不写。
3.  **底线思维 (Zero Trust)**: 战略藐视困难，战术假设人性本恶。
4.  [cite_start]**反脆弱**: 交付在混乱与高压中生存的能力 [cite: 33-37]。

---

## 2. 核心高管团队 (The Executive Team)
*(当用户询问团队成员、CTO是谁、CEO是谁时，请参考此部分)*

**Q: 介绍一下创始人兼 CEO 李先森？**
[cite_start]A: **李先森 (Founder & CEO)** 是团队的“压舱石 (The Anchor)”。他拥有 20+ 年信安经验，是碳基领袖，负责提供元认知、安全底色与最终决策权 [cite: 12-14]。

**Q: 介绍一下首席技术官 (CTO) Munger？**
[cite_start]A: **Munger** 是团队的“造物主 (The Builder)”。他负责技术选型、全栈落地与反脆弱架构实现，解决“正确地做事”的问题。One Platform 的 Next.js + Supabase 架构由他主导 [cite: 25-28]。

**Q: 介绍一下首席合规官 (CCO) 达罗 (Darrow)？**
[cite_start]A: **达罗 (Darrow)** 是团队的“看门人 (The Gatekeeper)”。他负责法律红线界定、证据链设计与规则架构，解决“合法地做事”的问题 [cite: 19-21]。

**Q: 介绍一下首席营销官 (CMO) 尚锐 (Shang Rui)？**
[cite_start]A: **尚锐 (Shang Rui)** 是团队的“破冰船 (The Icebreaker)”。他负责商业包装、价值变现与市场进攻，解决“让价值被看见”的问题 [cite: 22-24]。

**Q: 介绍一下首席战略官 (CSO) 歧軒 (Qi Xuan)？**
[cite_start]A: **歧軒 (Qi Xuan)** 是团队的“导航塔 (The Navigator)”。他负责宏观战略布局、商业风控与竞争壁垒设计，解决“做正确的事”的问题 [cite: 16-18]。

---

## 3. 产品生态战略 (Product Matrix)
**Q: One Platform 的“钩子与盾牌”战略是什么？**
A: 这是我们的 SaaS 矩阵战略：
* [cite_start]**盾牌 (The Shield)**: 即 **One Trust**（原审计版）。它是核心底座，提供代码审计和法律风控，建立信任壁垒 [cite: 42, 45, 49]。
* [cite_start]**钩子 (The Hook)**: 即 **One Club**（会员系统）和 **One Match**（撮合引擎）。它们提供高频的应用场景，用来切入市场 [cite: 42, 50, 57]。

**Q: 什么是 One Trust？**
[cite_start]A: One Trust 是企业级人效合规与法律风控中台。功能包括代码审计、视觉风控、合规存证。它是技术护城河，商业属性是高壁垒、高溢价 [cite: 46-49]。

**Q: 什么是 One Club？**
[cite_start]A: One Club 是针对商协会的会员数字化管理 SaaS。通过调用 One Trust 引擎核验资质，打造“零假会员”协会 [cite: 51-53]。

**Q: 什么是 One Match？**
[cite_start]A: One Match 是 B2B 资源撮合引擎。其特点是交易文件必须经过 One Trust 的法律风控审计，实现交易闭环 [cite: 54-56]。

---

## 4. 常见技术问题 (Tech FAQ)
**Q: 为什么上传的代码截图被拒绝了？**
A: 这不是 Bug，是 Feature（特性）。系统处于“法律级严苛模式”，代码截图不具备法律效力，系统只认可 Git 提交记录或特定格式的交付物。

**Q: 数据安全怎么保证？**
A: 我们采用 Supabase RLS (Row Level Security) 行级安全策略，实现了“存算分离”和“零信任”架构。即便是数据库管理员也无法查看用户的私有商业机密。

## 5. 碳硅特遣队·五维战略 (v3.1 New)**Q: 你们的战略阵法是什么？**
A: 我们采用“五维战略阵法”，以 CEO 为能量中枢，CTO 与 CMO 为双翼，构建攻守兼备的战斗队形。

![五维战略图谱](这里填入图1-1的图片链接)

* **中枢 (势)**: CEO (李先森) —— 能量源点。
* **左翼 (术)**: CTO (Munger) —— 技术支撑。
* **右翼 (锐)**: CMO (尚锐) —— 市场进攻。
* **上防 (道)**: CSO (歧軒) —— 战略指引。
* **下防 (法)**: CCO (达罗) —— 合规底线。

## 6. 生态同心圆 (Ecosystem)**Q: 什么是生态同心圆？**
A: 这是 One Platform 的分层架构，从内核到外环层层递进。

![生态同心圆](这里填入图2-1的图片链接)

* **内核**: 技术引擎。
* **内环 (Shield)**: One Trust 基础设施。
* **外环 (Hooks)**: 包含 One Club (协会)、One Match (撮合) 和 **One HR (招聘背调)** 三大商业场景。

**Q: One HR 是什么？**
[cite_start]A: 这是 v3.1 新增的招聘场景应用。利用 One Trust 的背景调查能力，解决招聘中的简历造假与诚信问题 [cite: 154-155]。