# 🎤 EduDoc — สรุปสำหรับสัมภาษณ์ (ฉบับสั้น)

> เวอร์ชันย่อ พูดได้ใน 1-2 นาที สำหรับตอนเปิดสัมภาษณ์ หรือเล่า Portfolio

---

## 📝 อธิบายโปรเจกต์ใน 5 ประโยค

> **EduDoc** เป็นระบบจัดการเอกสารโรงเรียนแบบครบวงจร ที่ช่วยลดงานเอกสารซ้ำซากของเจ้าหน้าที่โรงเรียน เช่น ออกใบเสร็จ ใบรับรอง และใบ ปพ. ระบบสร้าง PDF อัตโนมัติจากข้อมูลในฐานข้อมูล สามารถส่งให้ผู้ปกครองผ่านอีเมลได้ทันที พร้อมรองรับ 5 บทบาทผู้ใช้ (Admin, Registration, Finance, Teacher, Parent) ที่เห็นเมนูและทำงานได้ต่างกัน และมีหน้า Parent Portal ให้พ่อแม่เข้ามาดูข้อมูลลูก สถานะการชำระเงิน และดาวน์โหลดเอกสารได้ด้วยตัวเอง พัฒนาด้วย Next.js 15, TypeScript, Tailwind CSS, Supabase (PostgreSQL + Auth) และ React-PDF รองรับ 2 ภาษา (ไทย/อังกฤษ) และ Responsive ทั้ง Desktop / Tablet / Mobile

---

## ❓ คำถามที่คาดว่าจะถูกถาม + คำตอบสั้น

### Q1: โปรเจกต์นี้ทำอะไร?
> "ระบบ SaaS สำหรับโรงเรียน ช่วยให้เจ้าหน้าที่ออกเอกสารเป็น PDF อัตโนมัติ จากเดิมที่ต้องเปิด Word/Excel แก้ไขทีละคนสำหรับนักเรียนหลายร้อยคน ระบบนี้กดปุ่มเดียวได้ทั้งห้องครับ"

---

### Q2: ทำไมเลือก Tech Stack นี้?
> "**Next.js** เพราะรองรับ SEO + Server/Client Components, **TypeScript** เพิ่ม type safety, **Supabase** ใช้ PostgreSQL จริงและมี Auth ครบในที่เดียว, **React-PDF** ทำให้ผมสร้าง PDF ด้วย React component คุ้น syntax อยู่แล้วครับ"

---

### Q3: ส่วนที่ภูมิใจที่สุดคืออะไร?
> "ระบบ Document Generator ครับ เลือกนักเรียน 10 คน + ประเภทเอกสาร 1 ครั้ง ได้ PDF 10 ไฟล์พร้อมส่งอีเมล + บันทึก log ใน Supabase ภายในไม่กี่วินาที และรองรับ font ไทย/อังกฤษด้วย"

---

### Q4: ออกแบบฐานข้อมูลยังไง?
> "มี 4 ตารางหลัก: students, teachers, payments, documents — ใช้ UUID เป็น primary key, payments และ documents อ้างถึง students ผ่าน foreign key พร้อม cascade delete และเปิด Row Level Security ให้ผู้ปกครองเห็นได้แค่ข้อมูลลูกตัวเองครับ"

---

### Q5: จัดการ State และ Permission ยังไง?
> "ใช้ React Context API 2 ตัว — **AuthContext** เก็บข้อมูลผู้ใช้และ role, **I18nContext** จัดการภาษา ส่วน Permission ทำ 2 ระดับ: Frontend ซ่อนเมนูตาม role, Backend ใช้ RLS ของ Supabase ป้องกันการเข้าถึงข้อมูลครับ"

---

### Q6: เจอปัญหาอะไรบ้าง แก้ยังไง?
> "ปัญหาใหญ่สุดคือ PDF ไม่รองรับภาษาไทย แก้ด้วยการ register Sarabun font จาก CDN อีกอันคือ Supabase ใช้ snake_case แต่ TypeScript ใช้ camelCase ผมเลยเขียน mapper function แปลงข้อมูลตอน fetch ทุกครั้งครับ"

---

### Q7: ถ้าทำต่อจะเพิ่มอะไร?
> "อยากเพิ่ม **ส่งอีเมลจริง** ด้วย Resend, **LINE Notify** สำหรับผู้ปกครองไทย, **ระบบเช็คชื่อรายวัน**, และย้าย PDF Generation ไปทำที่ Server-side ผ่าน Supabase Edge Function เพื่อ scale ได้ดีขึ้นครับ"

---

### Q8: Test ยังไง?
> "ตอนนี้ Manual Test ครับ แผนต่อไปคือใช้ **Vitest** สำหรับ unit test ของ query functions และ **Playwright** สำหรับ E2E ทดสอบ flow login → generate document → download"

---

### Q9: Deploy ที่ไหน?
> "Deploy บน **Vercel** ครับ ฟรี, รองรับ Next.js เต็มที่, และ auto-deploy ทุกครั้งที่ push ขึ้น GitHub Supabase ก็ใช้ free tier มี 500MB และ Auth ใช้ได้ไม่จำกัด"

---

### Q10: ทำคนเดียวหรือทีม? ใช้เวลานานไหม?
> "ทำคนเดียวครับ ใช้ AI ช่วยใน boilerplate และ code review ตลอดทาง ใช้เวลาประมาณ X ชั่วโมง จากศูนย์ถึงระบบใช้งานได้จริง"

---

## 🎯 จุดที่ควรชู (Highlight 3 ข้อ)

1. **PDF Generation จริง 5 แบบ** — Receipt, Certificate, Transcript, Enrollment, Graduation
2. **Bilingual (ไทย/อังกฤษ)** — ทุกหน้า ทุกปุ่ม กดเปลี่ยนได้ทันที
3. **Role-based UI** — Admin / Registration / Finance / Teacher / Parent เห็นไม่เหมือนกัน

---

## ⚡ Demo Script (สำหรับโชว์สด 3 นาที)

1. **เปิด `/login`** — โชว์ปุ่ม Demo Credentials, Copy email
2. **Login เป็น Admin** — โชว์ Dashboard, Stats Cards, Overdue Alerts
3. **กดปุ่ม EN ⇄ TH** — ระบบเปลี่ยนภาษาทั้งหมดทันที
4. **ไปหน้า Documents** — เลือก Receipt + นักเรียน 2 คน → Generate → PDF ดาวน์โหลด!
5. **เปิด PDF** — โชว์ตรา PAID + ข้อมูลครบ + ภาษาไทยขึ้นได้
6. **Logout → Login เป็น Parent** — ระบบพาเข้า Parent Portal โดยตรง (ไม่เห็น Dashboard)
7. **ปิด** "ระบบนี้ใช้ Database จริง, Auth จริง, PDF จริง — พร้อม deploy เลยครับ"

---

> 💡 **Tip:** ก่อนสัมภาษณ์ Login เป็นทุก role ทดลองให้ลื่นแล้วครั้งหนึ่ง เผื่อตอนสัมภาษณ์เน็ตช้า PDF generate ครั้งแรกอาจใช้เวลา ~5-10 วินาที โหลด font
