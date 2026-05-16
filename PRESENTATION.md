# 📘 EduDoc — School Document Automation System
### เอกสารพรีเซนต์สำหรับสัมภาษณ์งาน

> ระบบจัดการเอกสารโรงเรียนแบบครบวงจร พร้อม Database จริง · Auth จริง · PDF Generation จริง

---

## 🎯 1. แนวคิดและที่มา (Problem & Motivation)

### ปัญหาที่เจอจริงในโรงเรียน
- เจ้าหน้าที่โรงเรียนต้องเปิด Word/Excel **แก้ทีละไฟล์** สำหรับนักเรียนหลายร้อยคน
- ใบเสร็จค่าเทอม / ใบรับรอง / ใบ ปพ. — ทำมือ ใช้เวลาวันเป็นสัปดาห์ในช่วงเปิดเทอม
- ผู้ปกครองโทรเข้ามาถามเรื่องเดิม ๆ (ค้างเทอมเท่าไหร่, ส่งใบรับรองได้ไหม)
- ครูเสียเวลากับงาน Admin มากกว่างานสอน

### Solution — EduDoc
ระบบ SaaS แบบ Web Application ที่:
1. เก็บข้อมูลนักเรียน/การชำระเงิน/เอกสาร ในที่เดียว
2. **สร้าง PDF อัตโนมัติ** จาก Template (ใบเสร็จ, ใบรับรอง, ใบ ปพ., ใบประกาศจบ)
3. ส่ง Email ให้ผู้ปกครองอัตโนมัติ
4. ให้ผู้ปกครองเข้ามาดูสถานะลูกเองได้ผ่าน **Parent Portal**

---

## 🛠 2. Tech Stack ที่เลือกใช้

| Layer | Technology | เหตุผลที่เลือก |
|-------|------------|----------------|
| **Frontend** | Next.js 15 (App Router) + React 18 | SEO ดี, File-based routing, Server Components, Industry standard |
| **Language** | TypeScript | Type-safe ลด bug, IDE autocomplete, มาตรฐาน production |
| **Styling** | Tailwind CSS | Utility-first, ไว, consistent design, ขนาด CSS เล็ก |
| **Icons** | Lucide React | Clean, light-weight, มี icons ครบ |
| **Database** | Supabase (PostgreSQL) | Open-source, มี free tier, Real-time, Backup auto |
| **Auth** | Supabase Auth | JWT-based, รองรับ Email/Password + OAuth, ใช้งานง่าย |
| **PDF Engine** | @react-pdf/renderer | เขียน PDF ด้วย React, รัน client-side, ฟรี |
| **i18n** | Custom Context API | เล็ก เร็ว ไม่ต้องพึ่ง library ใหญ่ |
| **Deploy** | Vercel | Auto-deploy จาก Git, Free tier, Edge network |

### ทำไมไม่เลือก…
- **Firebase แทน Supabase?** → Supabase ใช้ PostgreSQL จริง (SQL query ได้), ราคาถูกกว่า
- **MUI แทน Tailwind?** → Tailwind ปรับ design ได้ละเอียดกว่า bundle เล็กกว่า
- **Redux แทน Context?** → ระบบนี้ state ไม่ซับซ้อน Context พอเพียง

---

## 🏗 3. Architecture (สถาปัตยกรรม)

```
┌─────────────────────────────────────────────────┐
│       BROWSER (Client)                          │
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │  Next.js App Router (React Components) │    │
│  │  • /dashboard  /students  /finance     │    │
│  │  • /documents  /parent-portal …        │    │
│  └─────────────┬──────────────────────────┘    │
│                │                                │
│  ┌─────────────▼──────────────────────────┐    │
│  │  Context Providers                     │    │
│  │  • AuthProvider (Supabase Auth)        │    │
│  │  • I18nProvider (Thai/English)         │    │
│  └─────────────┬──────────────────────────┘    │
│                │                                │
│  ┌─────────────▼──────────────────────────┐    │
│  │  lib/supabase-queries.ts               │    │
│  │  • fetchStudents() / createStudent()   │    │
│  │  • fetchPayments() / fetchDocuments()  │    │
│  └─────────────┬──────────────────────────┘    │
│                │                                │
│  ┌─────────────▼──────────────────────────┐    │
│  │  lib/supabase.ts  (Supabase JS client)│    │
│  └─────────────┬──────────────────────────┘    │
│                │                                │
│  ┌─────────────▼──────────────────────────┐    │
│  │  lib/pdf/  (React-PDF templates)       │    │
│  │  • Receipt / Certificate / Transcript… │    │
│  └────────────────────────────────────────┘    │
└──────────────────┬──────────────────────────────┘
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────────────┐
│       SUPABASE CLOUD (Backend)                  │
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │  PostgreSQL Database                   │    │
│  │  • students  • teachers                │    │
│  │  • payments  • documents               │    │
│  └────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────┐    │
│  │  Authentication (JWT + Row Level Sec)  │    │
│  └────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

### หลักการออกแบบที่ใช้
1. **Separation of Concerns** — Pages, Queries, PDF Templates แยกชั้นกันชัดเจน
2. **Single Source of Truth** — `lib/supabase-queries.ts` เป็นจุดเดียวที่คุยกับ DB
3. **Type Safety** — TypeScript interfaces ใน `lib/types.ts` ใช้ทั้ง Frontend และ Mapping
4. **Mobile-First Responsive** — Sidebar collapsible, Table horizontal-scroll, Touch-friendly

---

## 👥 4. Roles & Permissions (ระบบสิทธิ์)

ระบบรองรับ 5 บทบาท แต่ละบทบาทเห็นเมนูและทำงานได้ต่างกัน:

| Role | สิทธิ์ | เมนูที่เห็น |
|------|-------|-----------|
| **Admin / IT** | ทั้งหมด | ทุกเมนู (Dashboard, Students, Finance, Documents, Teachers, Settings) |
| **Registration** | จัดการนักเรียน + ออกเอกสาร | Students, Documents |
| **Finance** | การเงิน + ใบเสร็จ | Finance, Documents |
| **Teacher** | ข้อมูลห้อง + งานสอน | Dashboard, Students, Teacher Workspace, Documents |
| **Parent** | ดูข้อมูลลูกตัวเอง | Parent Portal เท่านั้น |

**การควบคุมสิทธิ์ทำ 2 ระดับ:**
- Frontend: ซ่อนเมนูใน Sidebar
- Backend: Row Level Security ใน Supabase (Parent เห็นได้แค่ลูกตัวเอง)

---

## ✨ 5. Features (ฟีเจอร์เด่น)

### 5.1 Dashboard 📊
- Stats Cards: นักเรียนทั้งหมด, รายได้ที่เก็บได้, เอกสารเดือนนี้, ครู
- Payment Overview แบบ Stacked Progress Bar
- Recent Documents & Overdue Alerts (real-time จาก DB)

### 5.2 Student Management 👨‍🎓
- ตารางนักเรียน + Search + Filter (Grade, Status, Payment Status)
- **Add Student Modal** → บันทึกลง Supabase จริง
- Student Profile หน้าเดี่ยว แสดง: ข้อมูลส่วนตัว, ผู้ปกครอง, ครูประจำชั้น, ประวัติการชำระเงิน, เอกสารที่เคยออก

### 5.3 Finance Dashboard 💰
- การ์ดสรุป: Collected / Pending / Overdue / Fully Paid
- Collection Progress Bar
- ตารางสถานะการชำระเงินทุกคน + 1-click Receipt PDF

### 5.4 Document Generator 📄 — **ฟีเจอร์เด่นที่สุด**
- เลือก Document Type (Receipt / Certificate / Transcript / Enrollment / Graduation)
- เลือกนักเรียนหลายคนพร้อมกัน (Bulk Generation)
- กดปุ่มเดียว → ระบบ:
  1. สร้าง PDF จริงจาก Template (React-PDF)
  2. Auto-download ทุกไฟล์
  3. บันทึก Log ใน Supabase
  4. (Optional) ส่ง Email ให้ผู้ปกครอง

**Template PDF ที่ทำเอง 5 แบบ:**
- 🧾 Tuition Receipt — A4 + ตาราง + ตรา "PAID" สีเขียวเอียง
- 🏅 Student Certificate — A4 landscape + ชื่อตัวใหญ่
- 📜 Enrollment Letter — A4 + จดหมายราชการ
- 🎓 Graduation Diploma — A4 landscape + กรอบทอง
- 📊 Grade Transcript — A4 + 8 วิชา + GPA

### 5.5 Teacher Workspace 👩‍🏫
- ดูทีมครูทั้งโรงเรียน + กรอง Grade
- My Workspace: Templates ใบงาน, ตารางสอนวันนี้

### 5.6 Parent Portal 👨‍👩‍👧
- หน้าเรียบง่าย ให้พ่อแม่
- เห็นข้อมูลลูก, สถานะการชำระเงิน, เอกสารที่ดาวน์โหลดได้

### 5.7 Settings ⚙️
- School Profile, Email config, Notifications, Security, Appearance
- รองรับ Toggle เปิด/ปิดฟีเจอร์

### 5.8 Bilingual (ไทย / English) 🌐
- ปุ่ม Toggle ภาษาที่ Header
- ระบบจดจำภาษาที่เลือก (localStorage)
- Custom Context API ไม่พึ่ง library

---

## 🎨 6. UI/UX Design Decisions

### Design System
- **Primary color:** Blue (`#2563EB`) — สื่อความเป็นทางการ น่าเชื่อถือ
- **Accents:** Emerald (success), Amber (warning), Red (danger), Purple/Cyan (info)
- **Typography:** Inter — Modern, อ่านง่ายทุกขนาด
- **Spacing:** ใช้ Tailwind scale (4px base) สม่ำเสมอ
- **Shadows:** subtle 2 ชั้น — `shadow-card` กับ `shadow-card-hover`

### Responsive Strategy
| Device | Behavior |
|--------|----------|
| Mobile (< 768px) | Sidebar เป็น Overlay Drawer, ตาราง scroll แนวนอน |
| Tablet (768-1024px) | Sidebar collapsible |
| Desktop (> 1024px) | Sidebar fixed 256px, max-width container 7xl |

### Component Patterns ที่ใช้ซ้ำ
- **Status Badge** — `paid` (เขียว), `unpaid` (เหลือง), `overdue` (แดง), `partial` (ฟ้า)
- **Stats Card** — Icon ซ้าย, Number ขวา, hover effect
- **Modal** — Backdrop blur, center, escape on click outside
- **Loading State** — Spinner + ข้อความบอกว่ากำลังทำอะไร

---

## 🗄 7. Database Schema (ฐานข้อมูล)

```sql
students (
  id uuid PK, student_id text UNIQUE,
  first_name, last_name, grade, classroom,
  date_of_birth, enrollment_date,
  parent_name, parent_email, parent_phone, address,
  status, payment_status, blood_type, allergies,
  total_debt, created_at
)

teachers (
  id uuid PK, name, email UNIQUE,
  phone, subject, classroom, grade,
  status, created_at
)

payments (
  id uuid PK,
  student_id FK → students.id (ON DELETE CASCADE),
  amount, due_date, paid_date,
  status, term, type, receipt_number, description
)

documents (
  id uuid PK,
  student_id FK → students.id (ON DELETE CASCADE),
  type, title, generated_by, status, sent_to,
  created_at
)
```

### Row Level Security (RLS)
```sql
-- Parent เห็นได้แค่ข้อมูลลูกตัวเอง
CREATE POLICY "parent_own_child" ON students
  FOR SELECT USING (parent_email = auth.jwt() ->> 'email');
```

---

## 🚧 8. Challenges & Solutions (ปัญหาที่เจอและวิธีแก้)

### Challenge 1: PDF ภาษาไทยไม่ขึ้น
- **ปัญหา:** Default font ของ @react-pdf ไม่รองรับไทย
- **วิธีแก้:** Register Sarabun font จาก jsdelivr CDN
```ts
Font.register({
  family: 'Sarabun',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/.../Sarabun-Regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/.../Sarabun-Bold.ttf', fontWeight: 'bold' },
  ],
});
```

### Challenge 2: ตาราง Supabase เป็น snake_case แต่ TypeScript อยาก camelCase
- **วิธีแก้:** สร้าง Mapper function ใน `supabase-queries.ts`
```ts
function mapStudent(row: any): Student {
  return {
    studentId: row.student_id,   // ← map snake → camel
    firstName: row.first_name,
    // …
  };
}
```

### Challenge 3: Bulk PDF Generation ทำให้ Browser ค้าง
- **วิธีแก้:** ใช้ `await pdf(element).toBlob()` ทำที-ละ-คน ใน loop ไม่ใช่ Promise.all เพื่อไม่ให้กิน RAM พุ่ง

### Challenge 4: รองรับ Demo + Production ในระบบเดียว
- **วิธีแก้:** `auth-context.tsx` รองรับทั้ง Supabase Auth จริง และ Demo Login ผ่าน localStorage
- ถ้า Email ตรงกับ Demo User → ผ่าน
- ถ้าไม่ตรง → ตรวจกับ Supabase Auth

### Challenge 5: ภาษาไทย/อังกฤษโดยไม่ต้องลง next-i18next
- **วิธีแก้:** เขียน Context API เอง ใช้ Dict key-value แบบ `t('nav.dashboard')`

---

## 📈 9. ตัวเลขที่ทำได้

| Metric | ค่า |
|--------|-----|
| จำนวนหน้า (Pages) | 8 หน้า |
| Component ที่สร้าง | 25+ |
| TypeScript Interfaces | 15+ |
| Database Tables | 4 |
| PDF Templates | 5 แบบ |
| Total Lines of Code | ~5,500 บรรทัด |
| Translation Strings | 90+ key (Thai + English) |
| Build Time | ~30 วินาที |
| Lighthouse Score (target) | 90+ ทุกหมวด |

---

## 🚀 10. ขั้นต่อไปและ Roadmap

### Phase 2 (Short-term)
- [ ] Email Sending จริงผ่าน Resend.com
- [ ] LINE Notify Integration สำหรับโรงเรียนไทย
- [ ] ระบบเช็คชื่อรายวัน (Attendance)
- [ ] ระบบชำระเงินออนไลน์ (PromptPay QR)

### Phase 3 (Long-term)
- [ ] Multi-tenant — โรงเรียนสมัครใช้งานเอง
- [ ] Mobile App (React Native)
- [ ] AI-powered Document Suggestion (ใช้ Claude API)
- [ ] Analytics Dashboard สำหรับผู้บริหาร

---

## 🎓 11. สิ่งที่ได้เรียนรู้

### Technical Skills
- ✅ Next.js 15 App Router + Server/Client Components
- ✅ TypeScript Type Mapping (snake_case ↔ camelCase)
- ✅ Supabase ทั้ง Database, Auth, RLS
- ✅ React Context API สำหรับ Global State
- ✅ PDF Generation client-side ด้วย React-PDF
- ✅ Tailwind responsive design patterns

### Soft Skills
- ✅ การวางแผนระบบใหญ่จากศูนย์ — เริ่มจาก UI mock → DB → PDF
- ✅ การแยกชั้น code (architecture layer)
- ✅ คิดในมุม End User: เจ้าหน้าที่กับผู้ปกครองต้องการคนละแบบ
- ✅ คิดในมุม Real-world: ภาษาไทย, font, ระเบียบเอกสารราชการ

---

## 🎤 12. คำถามที่อาจถูกถามในสัมภาษณ์

### Q: ทำไมเลือกทำระบบนี้?
> "อยากแก้ปัญหาจริงในประเทศไทย โรงเรียนหลายที่ยังใช้ Excel + Word เปลี่ยนชื่อทีละไฟล์ ผมเลยอยากสร้าง SaaS ที่ช่วยลดงานซ้ำซากให้เจ้าหน้าที่ได้กลับไปทำงานสำคัญกว่า"

### Q: ส่วนที่ภูมิใจที่สุดคือ?
> "ระบบ Document Generator ครับ เลือกนักเรียน 10 คน + ประเภทเอกสาร 1 ครั้ง → ได้ PDF 10 ไฟล์พร้อม PDF จริง พร้อม Email พร้อม Log ใน DB เพราะรวม **PostgreSQL + React-PDF + TypeScript type-safety** เข้าด้วยกันได้ลงตัว"

### Q: ถ้าทำต่อจะแก้อะไร?
> "อยากเพิ่ม Edge Function ใน Supabase สำหรับ Generate PDF ฝั่ง Server เพราะปัจจุบันทำที่ Browser ถ้าเอกสารเยอะมากเครื่องช้าอาจค้าง การย้ายไปทำ Server-side จะ scale ดีกว่า"

### Q: Test ยังไง?
> "ปัจจุบันยัง Manual Test ครับ แผนต่อไปคือเพิ่ม Vitest สำหรับ Unit Test ของ Queries / PDF Generation, และ Playwright สำหรับ E2E Test ฟลอว์หลัก ๆ"

### Q: Security ทำอะไรไว้บ้าง?
> "(1) ใช้ Supabase Auth + JWT, (2) เปิด Row Level Security ใน DB ให้ Parent เห็นได้แค่ลูกตัวเอง, (3) ไม่มี API Key ใน Frontend (ใช้ anon key ที่ public ได้), (4) ใส่ `.env.local` ใน `.gitignore` แน่นอน"

---

## 📎 Appendix: คำสั่งที่ใช้บ่อย

```bash
# Development
npm run dev          # รัน dev server ที่ localhost:3000

# Production Build
npm run build        # Build production
npm run start        # รัน production server

# Type Check
npx tsc --noEmit     # ตรวจ TypeScript errors

# Database (รันใน Supabase SQL Editor)
SELECT * FROM students;
INSERT INTO students (...) VALUES (...);
```

---

## 🔗 Links

- **Live Demo:** https://your-vercel-domain.vercel.app *(หลัง deploy)*
- **GitHub:** https://github.com/yourusername/edudoc *(หลัง push)*
- **Tech:** Next.js 15 · TypeScript · Supabase · Tailwind · React-PDF

---

> สร้างด้วย ❤️ — Bright Future Academy Demo Project · 2026
