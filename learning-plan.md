# แผนพัฒนาตัวเอง — Kawin Kengkate

> เริ่ม: พฤษภาคม 2026 | เป้าหมาย: ก้าวจาก Junior → Mid-level Developer ที่ใช้ AI เป็น
> ปรัชญา: **Foundation + AI Application** ทำคู่กัน ไม่ใช่อย่างใดอย่างหนึ่ง

---

## ภาพรวม Timeline

```
Phase 1 (มิ.ย. - ส.ค. 2026)   → FastAPI + Advanced React (Backend & Frontend Core)
Phase 2 (ก.ย. - พ.ย. 2026)    → Testing + AI Agent Workflow
Phase 3 (ธ.ค. 2026 - ก.พ. 2027) → System Design + Azure Advanced
Phase 4 (มี.ค. 2027+)          → Specialization & Leadership Track
```

จัดสรรเวลา: **~10 ชม./สัปดาห์** (นอกเวลางาน)
- 70% คอร์สหลัก
- 20% ใช้/ฝึกในงานจริง
- 10% Side project + ตามวงการ

---

## Phase 1: Backend & Frontend Core (มิ.ย. - ส.ค. 2026, ~3 เดือน)

### คอร์สหลัก #1: FastAPI Complete Course (เรียนต่อจาก 25%)

**ทำไม**: ทีมใช้ FastAPI อยู่ + Backend skill ถูก AI แทนยาก + ของที่ดองแล้วต้องจบ

**เป้าหมาย**:
- จบ section: Dependency Injection, Middleware, Async, Auth (JWT/OAuth2)
- จบ section: Database (SQLAlchemy), Migrations (Alembic)
- จบ section: Testing FastAPI, Deployment

**Output ที่ต้องมี**:
- API project เล็กๆ 1 ตัวที่ deploy บน Azure จริง (CRUD + Auth + DB)
- เอา pattern มาใช้ใน FastAPI ของทีมจริง 1-2 จุด

**เกณฑ์ว่าจบ**: deploy ได้ + เขียน FastAPI service ใหม่ในงานจริงโดยไม่ต้อง copy code เก่า

---

### คอร์สหลัก #2: Advanced React (Design System, Patterns, Performance)

**ทำไม**: ทำ frontend 60% + AI generate component ได้แต่ออกแบบ system ไม่ได้

**เป้าหมาย**:
- Design Patterns: Compound Component, Render Props, Custom Hooks, Provider Pattern
- Performance: memoization, code splitting, lazy loading, profiler
- Design System: design tokens, component composition, theming

**Output ที่ต้องมี**:
- Refactor `MainPage.jsx` ของโปรเจค Traceability (state เยอะเกินไป)
- แยก reusable component ที่ใช้ซ้ำได้ในโปรเจคอื่น

**เกณฑ์ว่าจบ**: review โค้ด React ของเพื่อนแล้วบอก performance issue ได้

---

### Future Skill ขนานช่วงนี้ (เลือก 2-3 ตัว)

| คอร์ส | ทำไมเรียน | Priority |
|-------|----------|----------|
| Git Advanced (rebase, cherry-pick, conflict) | ทีมเล็กยิ่งต้องเก่ง git | ⭐⭐⭐ |
| SQL Performance Tuning | ใช้ MSSQL/MySQL ทุกวัน | ⭐⭐⭐ |
| Docker Basics | ใช้คู่กับ Azure ได้ + deploy งานจริง | ⭐⭐⭐ |
| Linux/Bash Basics | ถ้ายังไม่แข็ง ต้องมี | ⭐⭐ |
| TypeScript Advanced (Generics, Utility Types) | ใช้ TS อยู่แล้ว ยกระดับให้ลึก | ⭐⭐ |

---

## Phase 2: Testing & AI Workflow (ก.ย. - พ.ย. 2026, ~3 เดือน)

### คอร์สหลัก #3: React Testing Library + Vitest

**ทำไม**: ทีมไม่มี unit test = นายเริ่มได้ก่อน + AI ยุค agent ต้องการคนเขียน test เก่ง

**เป้าหมาย**:
- เขียน unit test สำหรับ component (RTL philosophy)
- Integration test สำหรับ user flow
- Mock API + MSW (Mock Service Worker)
- Test custom hook

**Output ที่ต้องมี**:
- เขียน test สำหรับ component สำคัญในโปรเจค Traceability อย่างน้อย 3 ตัว
- Setup test infrastructure ในโปรเจคให้ทีม

**เกณฑ์ว่าจบ**: ก่อน merge PR ของตัวเองเขียน test ครอบคลุม happy path + edge case ได้เป็นปกติ

---

### หัวข้อศึกษาคู่กัน: AI Agent & Modern AI Workflow

ไม่ใช่คอร์ส แต่เป็นการศึกษา + ทดลองเอง

**สิ่งที่ต้องศึกษา**:
- Claude Code agent mode + sub-agents
- Cursor, Aider, Cline เทียบกัน
- Prompt engineering สำหรับ code generation
- MCP (Model Context Protocol) — เชื่อม AI กับ tools
- การ orchestrate AI agent หลายตัวสำหรับ task ใหญ่

**ทำคู่กับ**: ใช้ AI ทำ side project จริง อย่างน้อย 2 ตัว

---

### Future Skill ขนานช่วงนี้

| คอร์ส | ทำไมเรียน | Priority |
|-------|----------|----------|
| Prompt Engineering for Developers | ใช้ทุกวันอยู่แล้ว ยกระดับ | ⭐⭐⭐ |
| Cybersecurity Basics (OWASP Top 10) | dev ทุกคนต้องรู้ | ⭐⭐⭐ |
| API Design Best Practices (REST/GraphQL) | ทำ API อยู่ ควรรู้ลึก | ⭐⭐ |
| Clean Code / Refactoring | ยกระดับโค้ดที่เขียน | ⭐⭐ |

---

## Phase 3: System Design & Azure Deep Dive (ธ.ค. 2026 - ก.พ. 2027, ~3 เดือน)

### คอร์สหลัก #4: Mastering the System Design Interview

**ทำไม**: ทักษะ AI แทนยากที่สุด + บันไดสู่ senior/architect + โรงงานมีระบบ integrate เยอะ

**เป้าหมาย**:
- Scalability fundamentals: load balancer, caching, CDN
- Database design: SQL vs NoSQL, sharding, replication, indexing
- Async patterns: queue, pub/sub, event-driven
- Microservices vs Monolith trade-offs
- Real-world case study: design Twitter/Uber/Netflix

**Output ที่ต้องมี**:
- เขียน design doc สำหรับระบบใดระบบหนึ่งในโรงงาน (เลือกที่เกี่ยวข้องกับงานตัวเอง)
- Propose architecture improvement ให้ทีม 1 อย่าง

**เกณฑ์ว่าจบ**: design ระบบขนาดกลางได้บนกระดาษเปล่า + อธิบาย trade-off ของแต่ละ choice ได้

---

### หัวข้อศึกษาคู่กัน: Azure AZ-204 (Developer Associate)

ต่อจาก AZ-900 ที่ผ่านมาแล้ว — ลึกขึ้นสำหรับ developer

**สิ่งที่ครอบคลุม**:
- Azure App Service, Functions, Container Apps (ลึก)
- Azure Storage, Cosmos DB
- Azure Key Vault, Managed Identity
- Azure Monitor, Application Insights
- CI/CD with Azure DevOps + GitHub Actions

**เป้าหมาย**: สอบผ่าน AZ-204 + apply ความรู้กับงานจริง

---

### Future Skill ขนานช่วงนี้

| คอร์ส | ทำไมเรียน | Priority |
|-------|----------|----------|
| CI/CD Pipeline (GitHub Actions Advanced) | ใช้อยู่แล้ว ยกระดับ | ⭐⭐⭐ |
| Observability (Logging, Monitoring, Tracing) | งาน production จำเป็น | ⭐⭐⭐ |
| Database Design & Normalization | ต่อจาก SQL Tuning | ⭐⭐ |
| Message Queue (RabbitMQ/Azure Service Bus) | สำหรับ integration งานโรงงาน | ⭐⭐ |

---

## Phase 4: Specialization & Leadership (มี.ค. 2027+)

หลังจบ 3 phase ข้างต้น (ประมาณ 9 เดือน) นายจะมีพื้นฐานพอที่จะเลือกทาง

### ทางเลือก A: Full-stack Senior Track

- Microservices Architecture (deep)
- Event-Driven System
- Domain-Driven Design (DDD)
- Distributed System

### ทางเลือก B: Frontend Specialist Track

- Next.js / Remix (SSR/RSC)
- Web Performance (Core Web Vitals)
- Accessibility (a11y)
- Micro-frontend

### ทางเลือก C: DevOps/Platform Track

- Kubernetes
- Infrastructure as Code (Terraform/Bicep)
- Site Reliability Engineering (SRE)
- Security DevOps (DevSecOps)

### ทางเลือก D: AI Engineering Track

- RAG systems & vector database
- LLM Fine-tuning
- Agent orchestration framework
- Production ML/AI pipeline

**หัวข้อศึกษาขนานตลอดเวลา**:
- ศึกษา AI Agent ตัวใหม่ๆ ที่ออกมา (ทดลองทุก 2-3 เดือน)
- ตาม blog: Simon Willison, Addy Osmani, Hamel Husain
- เขียน blog ส่วนตัวเล่าสิ่งที่เรียนรู้ (สำคัญสำหรับ career)

---

## กฎเหล็กตลอดแผน

1. **ห้ามเรียนคอร์สหลักพร้อมกันเกิน 2 ตัว** — Backend + Frontend คู่ได้ แต่ห้ามมากกว่านี้
2. **ทุกคอร์สต้องมี Output ที่จับต้องได้** — ไม่ใช่ดูจบแล้วลืม
3. **เอาความรู้มาใช้ในงานจริงภายใน 2 สัปดาห์** หลังเรียน ไม่งั้นลืม
4. **ห้ามใช้ AI ทำสิ่งที่ตัวเองไม่เข้าใจ** — ทำ AI project ได้ แต่ต้อง explain โค้ดกลับได้ทุกบรรทัด
5. **Review แผนทุก 3 เดือน** — ปรับตามความเป็นจริง โลก AI เปลี่ยนเร็ว

---

## Tracking

| Phase | คอร์สหลัก | สถานะ | จบเมื่อ |
|-------|----------|------|--------|
| 1 | FastAPI (25% → 100%) | 🟡 In Progress | _____ |
| 1 | Advanced React | ⚪ Not Started | _____ |
| 2 | React Testing Library | ⚪ Not Started | _____ |
| 3 | System Design Interview | ⚪ Not Purchased | _____ |
| 3 | AZ-204 Certification | ⚪ Not Started | _____ |

**Legend**: ⚪ ยังไม่เริ่ม | 🟡 กำลังเรียน | 🟢 จบแล้ว | 🔴 ดรอป

---

## หมายเหตุ

- แผนนี้เป็น **guideline ไม่ใช่ contract** — ปรับได้ตามความเป็นจริง
- ถ้ามีงานเร่งช่วงไหน → ลด workload คอร์สลง 50% ดีกว่าดรอป
- ถ้า technology landscape เปลี่ยนใหญ่ (เช่น AI agent ทำได้ดีขึ้นกระโดด) → review แผนใหม่
- เป้าหมายไม่ใช่ "เรียนให้ครบ" แต่คือ **"กลายเป็น dev ที่ใช้ AI ได้และ AI แทนไม่ได้"**
