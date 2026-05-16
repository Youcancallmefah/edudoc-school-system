# EduDoc — School Digital Document Automation System

Modern school administration platform for kindergarten and elementary schools.
Built with **Next.js 15**, **TailwindCSS**, and mock data ready for Supabase integration.

---

## Quick Start

```bash
cd school-system
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → auto-redirects to `/login`.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin / IT | admin@brightfuture.ac.th | any |
| Registration | register@brightfuture.ac.th | any |
| Finance | finance@brightfuture.ac.th | any |
| Teacher | teacher@brightfuture.ac.th | any |
| Parent | parent@brightfuture.ac.th | any |

> Click the quick-login buttons on the login page for instant role switching.

---

## Pages

| Route | Description |
|---|---|
| `/login` | Role-based login with demo shortcuts |
| `/dashboard` | Stats, activity feed, overdue alerts |
| `/students` | Full student list with search & filters |
| `/students/[id]` | Student profile: info, payments, documents |
| `/finance` | Payment tracker, receipt generator |
| `/documents` | Bulk PDF generator with multi-step wizard |
| `/parent-portal` | Parent view: child info, payments, docs |
| `/teachers` | Staff directory + teacher workspace |
| `/settings` | School profile, email, notifications, security |

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: TailwindCSS 3
- **Icons**: Lucide React
- **Auth**: Context + localStorage (demo) → Supabase Auth (production)
- **Database**: Mock data → Supabase (PostgreSQL)
- **PDF**: Ready for react-pdf / pdfkit integration
- **Email**: Ready for Supabase Edge Functions + SMTP

---

## Project Structure

```
school-system/
├── app/
│   ├── login/              # Login page
│   ├── dashboard/          # Main dashboard
│   ├── students/           # Student list + profile
│   │   └── [id]/
│   ├── finance/            # Finance dashboard
│   ├── documents/          # Document generator
│   ├── parent-portal/      # Parent view
│   ├── teachers/           # Teacher workspace
│   └── settings/           # System settings
├── components/
│   └── layout/             # Sidebar, Header, DashboardLayout
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── mock-data.ts        # Demo students, payments, docs
│   └── auth-context.tsx    # Auth state (React Context)
└── tailwind.config.ts
```

---

## Roles & Access

| Feature | Admin | Registration | Finance | Teacher | Parent |
|---|:---:|:---:|:---:|:---:|:---:|
| Dashboard | ✓ | ✓ | ✓ | ✓ | |
| Students | ✓ | ✓ | | ✓ | |
| Finance | ✓ | | ✓ | | |
| Documents | ✓ | ✓ | ✓ | ✓ | |
| Teacher Workspace | ✓ | | | ✓ | |
| Parent Portal | ✓ | | | | ✓ |
| Settings | ✓ | | | | |

---

## Production Roadmap

1. Connect Supabase Auth (replace localStorage)
2. Set up Supabase tables matching `lib/types.ts`
3. Integrate react-pdf for actual PDF generation
4. Add Supabase Edge Functions for email (receipt/cert delivery)
5. Deploy to Vercel


## Username & Password 
[ admin@brightfuture.ac.th ] ← มี email อยู่แล้ว
[ demo1234              ]  ← มี password อยู่แล้ว
[Quick Demo: 5 ปุ่มกดได้ทันที]
[ ____________________ ] ← ว่างเปล่า รอกรอก
[ ____________________ ] ← ว่างเปล่า รอกรอก

📋 [Demo Credentials ▼] ← กดเปิด-ปิดได้
   • Admin: admin@brightfuture.ac.th [Copy]
   • Registration: register@... [Copy]
   • Finance: finance@... [Copy]
   • Teacher: teacher@... [Copy]
   • Parent: parent@... [Copy]