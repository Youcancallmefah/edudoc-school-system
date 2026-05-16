'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'en' | 'th';

type Dict = Record<string, { en: string; th: string }>;

const DICT: Dict = {
  // ─── Brand / School ────────────────────────────────────────────────────
  'brand.tagline':   { en: 'School Document Automation',  th: 'ระบบจัดการเอกสารโรงเรียน' },
  'brand.school':    { en: 'Bright Future Academy',        th: 'โรงเรียนไบรท์ฟิวเจอร์' },

  // ─── Navigation ────────────────────────────────────────────────────────
  'nav.mainMenu':    { en: 'Main Menu',                     th: 'เมนูหลัก' },
  'nav.dashboard':   { en: 'Dashboard',                     th: 'แดชบอร์ด' },
  'nav.students':    { en: 'Students',                      th: 'นักเรียน' },
  'nav.finance':     { en: 'Finance',                       th: 'การเงิน' },
  'nav.documents':   { en: 'Documents',                     th: 'เอกสาร' },
  'nav.teachers':    { en: 'Teacher Workspace',             th: 'พื้นที่ครู' },
  'nav.parent':      { en: 'Parent Portal',                 th: 'หน้าผู้ปกครอง' },
  'nav.settings':    { en: 'Settings',                      th: 'ตั้งค่า' },
  'nav.collapse':    { en: 'Collapse',                      th: 'ย่อเมนู' },

  // ─── Page Titles ───────────────────────────────────────────────────────
  'page.dashboard':       { en: 'Dashboard',           th: 'แดชบอร์ด' },
  'page.students':        { en: 'Student Management', th: 'จัดการข้อมูลนักเรียน' },
  'page.studentProfile':  { en: 'Student Profile',    th: 'ข้อมูลนักเรียน' },
  'page.finance':         { en: 'Finance Dashboard',  th: 'การเงิน' },
  'page.documents':       { en: 'Document Generator', th: 'สร้างเอกสาร' },
  'page.teachers':        { en: 'Teacher Workspace',  th: 'พื้นที่ครู' },
  'page.parent':          { en: 'Parent Portal',      th: 'หน้าผู้ปกครอง' },
  'page.settings':        { en: 'Settings',           th: 'ตั้งค่า' },

  // ─── Roles ─────────────────────────────────────────────────────────────
  'role.admin':        { en: 'Administrator',  th: 'ผู้ดูแลระบบ' },
  'role.registration': { en: 'Registration',   th: 'งานทะเบียน' },
  'role.finance':      { en: 'Finance',        th: 'การเงิน' },
  'role.teacher':      { en: 'Teacher',        th: 'ครู' },
  'role.parent':       { en: 'Parent',         th: 'ผู้ปกครอง' },

  // ─── Login Page ────────────────────────────────────────────────────────
  'login.signIn':           { en: 'Sign In',                                          th: 'เข้าสู่ระบบ' },
  'login.signingIn':        { en: 'Signing In…',                                      th: 'กำลังเข้าสู่ระบบ…' },
  'login.email':            { en: 'Email Address',                                    th: 'อีเมล' },
  'login.password':         { en: 'Password',                                         th: 'รหัสผ่าน' },
  'login.year':             { en: 'Academic Year 2026',                               th: 'ปีการศึกษา 2569' },
  'login.tagline1':         { en: 'Manage your school',                               th: 'จัดการโรงเรียน' },
  'login.tagline2':         { en: 'smarter, not harder.',                             th: 'อย่างชาญฉลาด ไม่เหนื่อยเพิ่ม' },
  'login.intro':            { en: 'Automate documents, track payments, and communicate with parents — all from one modern platform.', th: 'สร้างเอกสารอัตโนมัติ ติดตามการชำระเงิน และสื่อสารกับผู้ปกครอง ในแพลตฟอร์มเดียว' },
  'login.quickDemo':        { en: 'Quick Demo Login',                                 th: 'เข้าสู่ระบบทดลองด่วน' },
  'login.orManual':         { en: 'or sign in manually',                              th: 'หรือเข้าสู่ระบบด้วยตนเอง' },
  'login.placeholderEmail': { en: 'you@brightfuture.ac.th',                           th: 'อีเมลของคุณ' },
  'login.placeholderPwd':   { en: 'Enter password',                                   th: 'ใส่รหัสผ่าน' },
  'login.invalid':          { en: 'Invalid credentials. Please use a demo account.',  th: 'เข้าสู่ระบบไม่สำเร็จ โปรดใช้บัญชีทดลอง' },
  'login.demoNote':         { en: 'Demo system — any password works with the demo emails above', th: 'ระบบทดลอง — ใช้รหัสผ่านใดก็ได้กับอีเมลทดลองด้านบน' },
  'login.credentialsTitle': { en: 'Demo Credentials',                                 th: 'บัญชีทดลอง' },
  'login.credentialsSub':   { en: 'Copy any of these emails to sign in',              th: 'คัดลอกอีเมลใดก็ได้เพื่อเข้าสู่ระบบ' },

  'login.stats.students':   { en: 'Students',     th: 'นักเรียน' },
  'login.stats.docs':       { en: 'Docs/Month',   th: 'เอกสาร/เดือน' },
  'login.stats.depts':      { en: 'Departments',  th: 'แผนก' },

  'login.role.admin.desc':        { en: 'Full system access',         th: 'เข้าถึงระบบทั้งหมด' },
  'login.role.registration.desc': { en: 'Student records & documents',th: 'ข้อมูลนักเรียนและเอกสาร' },
  'login.role.finance.desc':      { en: 'Payments & receipts',        th: 'การชำระเงินและใบเสร็จ' },
  'login.role.teacher.desc':      { en: 'Class & lesson tools',       th: 'เครื่องมือสำหรับห้องเรียน' },
  'login.role.parent.desc':       { en: 'Child info & payments',      th: 'ข้อมูลบุตรและการชำระเงิน' },

  // ─── Dashboard ─────────────────────────────────────────────────────────
  'dash.year':             { en: 'Academic Year 2026',         th: 'ปีการศึกษา 2569' },
  'dash.greeting':         { en: 'Good morning! 👋',            th: 'สวัสดียามเช้า! 👋' },
  'dash.greetingSub':      { en: 'pending payments',            th: 'การชำระเงินที่ค้าง' },
  'dash.newDocument':      { en: 'New Document',                th: 'สร้างเอกสารใหม่' },
  'dash.addStudent':       { en: 'Add Student',                 th: 'เพิ่มนักเรียน' },
  'dash.totalStudents':    { en: 'Total Students',              th: 'นักเรียนทั้งหมด' },
  'dash.activeStudents':   { en: 'active',                      th: 'ใช้งานอยู่' },
  'dash.collectedRevenue': { en: 'Collected Revenue',           th: 'รายได้ที่เก็บได้' },
  'dash.pending':          { en: 'pending',                     th: 'รอชำระ' },
  'dash.docsMonth':        { en: 'Docs This Month',             th: 'เอกสารเดือนนี้' },
  'dash.docsGenSent':      { en: 'Generated & sent',             th: 'สร้างและส่งแล้ว' },
  'dash.teachers':         { en: 'Teachers',                    th: 'ครู' },
  'dash.onLeave':          { en: 'on leave',                    th: 'ลา' },
  'dash.paymentOverview':  { en: 'Payment Overview',            th: 'ภาพรวมการชำระเงิน' },
  'dash.currentStatus':    { en: 'Current status across',       th: 'สถานะปัจจุบันของ' },
  'dash.viewFinance':      { en: 'View Finance',                th: 'ดูการเงิน' },
  'dash.recentDocs':       { en: 'Recent Documents',            th: 'เอกสารล่าสุด' },
  'dash.lastGenerated':    { en: 'Last generated',              th: 'สร้างล่าสุด' },
  'dash.allDocs':          { en: 'All Docs',                    th: 'เอกสารทั้งหมด' },
  'dash.overdueAlerts':    { en: 'Overdue Alerts',              th: 'แจ้งเตือนค้างชำระ' },
  'dash.studentsLabel':    { en: 'students',                    th: 'นักเรียน' },
  'dash.noOverdue':        { en: 'No overdue payments! 🎉',      th: 'ไม่มีรายการค้างชำระ! 🎉' },
  'dash.loading':          { en: 'Loading dashboard…',          th: 'กำลังโหลดแดชบอร์ด…' },

  'pay.paid':    { en: 'Fully Paid',  th: 'ชำระครบ' },
  'pay.partial': { en: 'Partial',     th: 'ชำระบางส่วน' },
  'pay.unpaid':  { en: 'Unpaid',      th: 'ยังไม่ชำระ' },
  'pay.overdue': { en: 'Overdue',     th: 'ค้างชำระ' },

  // ─── Students Page ─────────────────────────────────────────────────────
  'st.totalStudents':     { en: 'Total Students',         th: 'นักเรียนทั้งหมด' },
  'st.activeStudents':    { en: 'Active Students',         th: 'นักเรียนที่ใช้งานอยู่' },
  'st.overdueCount':      { en: 'With Overdue Payments',   th: 'มีรายการค้างชำระ' },
  'st.searchPlaceholder': { en: 'Search students, ID, parent…', th: 'ค้นหา ชื่อ รหัส ผู้ปกครอง…' },
  'st.addStudent':        { en: 'Add Student',             th: 'เพิ่มนักเรียน' },
  'st.filters':           { en: 'Filters:',                th: 'ตัวกรอง:' },
  'st.grade':             { en: 'Grade',                   th: 'ชั้น' },
  'st.allStatuses':       { en: 'All Statuses',             th: 'สถานะทั้งหมด' },
  'st.allPayments':       { en: 'All Payments',             th: 'การชำระทั้งหมด' },
  'st.showing':           { en: 'Showing',                  th: 'กำลังแสดง' },
  'st.of':                { en: 'of',                      th: 'จาก' },
  'st.studentsLower':     { en: 'students',                 th: 'รายการ' },
  'st.col.student':       { en: 'Student',                  th: 'นักเรียน' },
  'st.col.id':            { en: 'ID',                      th: 'รหัส' },
  'st.col.gradeClass':    { en: 'Grade / Class',            th: 'ชั้น / ห้อง' },
  'st.col.parent':        { en: 'Parent',                  th: 'ผู้ปกครอง' },
  'st.col.status':        { en: 'Status',                  th: 'สถานะ' },
  'st.col.payment':       { en: 'Payment',                  th: 'การชำระ' },
  'st.noResults':         { en: 'No students found.',       th: 'ไม่พบนักเรียน' },
  'st.loading':           { en: 'Loading students…',         th: 'กำลังโหลดข้อมูลนักเรียน…' },
  // Status badges
  'status.active':        { en: 'active',                  th: 'ใช้งาน' },
  'status.inactive':      { en: 'inactive',                th: 'ไม่ใช้งาน' },
  'status.graduated':     { en: 'graduated',               th: 'จบแล้ว' },
  'status.paid':          { en: 'paid',                    th: 'ชำระแล้ว' },
  'status.unpaid':        { en: 'unpaid',                  th: 'ยังไม่ชำระ' },
  'status.overdue':       { en: 'overdue',                 th: 'ค้างชำระ' },
  'status.partial':       { en: 'partial',                 th: 'ชำระบางส่วน' },
  // Add Student Modal
  'st.modal.title':       { en: 'Add New Student',         th: 'เพิ่มนักเรียนใหม่' },
  'st.modal.studentId':   { en: 'Student ID',              th: 'รหัสนักเรียน' },
  'st.modal.firstName':   { en: 'First Name',              th: 'ชื่อ' },
  'st.modal.lastName':    { en: 'Last Name',               th: 'นามสกุล' },
  'st.modal.classroom':   { en: 'Classroom',               th: 'ห้องเรียน' },
  'st.modal.dob':         { en: 'Date of Birth',           th: 'วันเกิด' },
  'st.modal.parentName':  { en: 'Parent Name',             th: 'ชื่อผู้ปกครอง' },
  'st.modal.parentEmail': { en: 'Parent Email',            th: 'อีเมลผู้ปกครอง' },
  'st.modal.parentPhone': { en: 'Parent Phone',            th: 'เบอร์โทรผู้ปกครอง' },
  'st.modal.address':     { en: 'Home Address',            th: 'ที่อยู่' },

  // ─── Finance Page ──────────────────────────────────────────────────────
  'fin.collected':        { en: 'Collected Revenue',       th: 'เก็บได้แล้ว' },
  'fin.pendingPayments':  { en: 'Pending Payments',        th: 'รอชำระ' },
  'fin.overdueAmount':    { en: 'Overdue Amount',          th: 'ยอดค้างชำระ' },
  'fin.fullyPaid':        { en: 'Fully Paid',              th: 'ชำระครบ' },
  'fin.term':             { en: 'Term 1/2026',             th: 'เทอม 1/2569' },
  'fin.students':         { en: 'students',                 th: 'คน' },
  'fin.collectionProgress':{en: 'Collection Progress',      th: 'ความคืบหน้าการเก็บเงิน' },
  'fin.collectedOf':      { en: 'collected of',            th: 'จาก' },
  'fin.collected2':       { en: 'collected',               th: 'เก็บได้' },
  'fin.sendReminders':    { en: 'Send Reminders',          th: 'ส่งการแจ้งเตือน' },
  'fin.exportReport':     { en: 'Export Report',           th: 'ส่งออกรายงาน' },
  'fin.title':            { en: 'Student Payment Status',  th: 'สถานะการชำระเงินของนักเรียน' },
  'fin.subtitle':         { en: 'Track individual records', th: 'ติดตามการชำระเงินรายบุคคล' },
  'fin.col.billed':       { en: 'Billed',                  th: 'ยอดเรียกเก็บ' },
  'fin.col.paid':         { en: 'Paid',                    th: 'ชำระแล้ว' },
  'fin.col.balance':      { en: 'Balance',                  th: 'คงเหลือ' },
  'fin.filter.all':       { en: 'All',                     th: 'ทั้งหมด' },
  'fin.noRecords':        { en: 'No records found.',        th: 'ไม่พบรายการ' },

  // ─── Documents Page ────────────────────────────────────────────────────
  'doc.quickGenerate':    { en: 'Quick Generate',          th: 'สร้างเอกสารด่วน' },
  'doc.customGenerate':   { en: 'Custom Generate',         th: 'สร้างแบบกำหนดเอง' },
  'doc.history':          { en: 'Document History',        th: 'ประวัติเอกสาร' },
  'doc.historySub':       { en: 'All generated documents', th: 'เอกสารทั้งหมดที่สร้าง' },
  'doc.generated':        { en: 'generated',               th: 'สร้างแล้ว' },
  'doc.allTypes':         { en: 'All',                     th: 'ทั้งหมด' },
  'doc.col.document':     { en: 'Document',                 th: 'เอกสาร' },
  'doc.col.type':         { en: 'Type',                    th: 'ประเภท' },
  'doc.col.generatedAt':  { en: 'Generated',               th: 'สร้างเมื่อ' },
  'doc.col.by':           { en: 'By',                      th: 'โดย' },
  'doc.noDocs':           { en: 'No documents yet.',       th: 'ยังไม่มีเอกสาร' },
  // Doc types
  'doc.type.receipt':     { en: 'Tuition Receipt',         th: 'ใบเสร็จค่าเทอม' },
  'doc.type.certificate': { en: 'Student Certificate',     th: 'ใบรับรองนักเรียน' },
  'doc.type.transcript':  { en: 'Grade Transcript',        th: 'ใบ ปพ. / ผลการเรียน' },
  'doc.type.enrollment':  { en: 'Enrollment Letter',       th: 'ใบรับรองการเป็นนักเรียน' },
  'doc.type.graduation':  { en: 'Graduation Cert',         th: 'ใบประกาศนียบัตร' },
  // Generate Modal
  'doc.modal.title':      { en: 'Generate Document',       th: 'สร้างเอกสาร' },
  'doc.step.type':        { en: 'Type',                    th: 'ประเภท' },
  'doc.step.students':    { en: 'Students',                 th: 'นักเรียน' },
  'doc.step.options':     { en: 'Options',                  th: 'ตัวเลือก' },
  'doc.selectType':       { en: 'Select Document Type',    th: 'เลือกประเภทเอกสาร' },
  'doc.selectStudents':   { en: 'Select Students',         th: 'เลือกนักเรียน' },
  'doc.selectAll':        { en: 'Select All',              th: 'เลือกทั้งหมด' },
  'doc.selected':         { en: 'selected',                th: 'เลือกแล้ว' },
  'doc.options':          { en: 'Generation Options',      th: 'ตัวเลือกการสร้าง' },
  'doc.summary':          { en: 'Summary',                 th: 'สรุป' },
  'doc.autoEmail':        { en: 'Auto-send to parents via email', th: 'ส่งอีเมลให้ผู้ปกครองอัตโนมัติ' },
  'doc.autoEmailDesc':    { en: 'Emails will be sent after generation', th: 'อีเมลจะถูกส่งหลังสร้างเอกสาร' },
  'doc.generating':       { en: 'Generating…',             th: 'กำลังสร้าง…' },
  'doc.generateNow':      { en: 'Generate Now',            th: 'สร้างเลย' },
  'doc.docsReady':        { en: 'Documents Generated!',     th: 'สร้างเอกสารสำเร็จ!' },

  // ─── Teachers Page ─────────────────────────────────────────────────────
  'tc.totalStaff':        { en: 'Total Staff',             th: 'บุคลากรทั้งหมด' },
  'tc.active':            { en: 'Active',                  th: 'ใช้งาน' },
  'tc.classrooms':        { en: 'Classrooms',              th: 'ห้องเรียน' },
  'tc.staffTab':          { en: 'Teaching Staff',          th: 'ทีมครู' },
  'tc.workspaceTab':      { en: 'My Workspace',            th: 'พื้นที่ของฉัน' },
  'tc.addTeacher':        { en: 'Add Teacher',             th: 'เพิ่มครู' },
  'tc.search':            { en: 'Search teachers…',         th: 'ค้นหาครู…' },
  'tc.studentsLabel':     { en: 'Students',                 th: 'นักเรียน' },
  'tc.classroomLabel':    { en: 'Classroom',                th: 'ห้องเรียน' },
  'tc.onLeave':           { en: 'On Leave',                th: 'ลา' },
  'tc.noTeachers':        { en: 'No teachers found.',       th: 'ไม่พบครู' },
  'tc.templatesTitle':    { en: 'Document Templates',       th: 'เทมเพลตเอกสาร' },
  'tc.templatesSub':      { en: 'Generate teaching PDFs',   th: 'สร้าง PDF สำหรับการสอน' },
  'tc.create':            { en: 'Create',                  th: 'สร้าง' },
  'tc.todaySchedule':     { en: "Today's Schedule",         th: 'ตารางสอนวันนี้' },

  // ─── Parent Portal ─────────────────────────────────────────────────────
  'pp.welcome':           { en: 'Welcome Back',            th: 'ยินดีต้อนรับกลับมา' },
  'pp.parentOf':          { en: 'Parent of',               th: 'ผู้ปกครองของ' },
  'pp.paymentStatus':     { en: 'Payment Status',           th: 'สถานะการชำระเงิน' },
  'pp.docsAvailable':     { en: 'Documents',                th: 'เอกสาร' },
  'pp.available':         { en: 'available',                th: 'พร้อมใช้' },
  'pp.gradeClass':        { en: 'Grade / Class',            th: 'ชั้น / ห้อง' },
  'pp.childInfo':         { en: 'Child Information',        th: 'ข้อมูลของบุตร' },
  'pp.fullName':          { en: 'Full Name',                th: 'ชื่อ-นามสกุล' },
  'pp.studentId':         { en: 'Student ID',               th: 'รหัสนักเรียน' },
  'pp.dob':               { en: 'DOB',                      th: 'วันเกิด' },
  'pp.bloodAllergies':    { en: 'Blood / Allergies',        th: 'หมู่เลือด / แพ้' },
  'pp.schoolContact':     { en: 'School Contact',           th: 'ติดต่อโรงเรียน' },
  'pp.messageSchool':     { en: 'Message School',           th: 'ส่งข้อความถึงโรงเรียน' },
  'pp.paymentSummary':    { en: 'Payment Summary',          th: 'สรุปการชำระเงิน' },
  'pp.paid':              { en: 'Paid',                    th: 'ชำระแล้ว' },
  'pp.outstanding':       { en: 'Outstanding',              th: 'ค้างชำระ' },
  'pp.myDocs':            { en: 'My Documents',             th: 'เอกสารของฉัน' },
  'pp.noDocs':            { en: 'No documents yet',         th: 'ยังไม่มีเอกสาร' },
  'pp.noPayments':        { en: 'No payment records',       th: 'ไม่มีรายการชำระเงิน' },
  'pp.due':               { en: 'Due',                     th: 'กำหนดชำระ' },
  'pp.paidOn':            { en: 'Paid',                    th: 'ชำระเมื่อ' },

  // ─── Student Profile ───────────────────────────────────────────────────
  'sp.back':              { en: 'Back to Students',         th: 'กลับไปหน้านักเรียน' },
  'sp.emailParent':       { en: 'Email Parent',             th: 'อีเมลผู้ปกครอง' },
  'sp.generateDoc':       { en: 'Generate Doc',             th: 'สร้างเอกสาร' },
  'sp.personalInfo':      { en: 'Personal Information',     th: 'ข้อมูลส่วนตัว' },
  'sp.dob':               { en: 'Date of Birth',            th: 'วันเกิด' },
  'sp.bloodAllergies':    { en: 'Blood / Allergies',        th: 'หมู่เลือด / แพ้' },
  'sp.address':           { en: 'Address',                  th: 'ที่อยู่' },
  'sp.parent':            { en: 'Parent / Guardian',        th: 'ผู้ปกครอง' },
  'sp.parentName':        { en: 'Name',                     th: 'ชื่อ' },
  'sp.teacher':           { en: 'Homeroom Teacher',         th: 'ครูประจำชั้น' },
  'sp.paymentSummary':    { en: 'Payment Summary',          th: 'สรุปการชำระเงิน' },
  'sp.totalBilled':       { en: 'Total Billed',             th: 'ยอดเรียกเก็บ' },
  'sp.totalPaid':         { en: 'Total Paid',               th: 'ชำระแล้ว' },
  'sp.outstanding':       { en: 'Outstanding',              th: 'คงเหลือ' },
  'sp.description':       { en: 'Description',              th: 'รายการ' },
  'sp.termLabel':         { en: 'Term',                     th: 'เทอม' },
  'sp.amount':            { en: 'Amount',                   th: 'จำนวนเงิน' },
  'sp.dueDate':           { en: 'Due',                      th: 'ครบกำหนด' },
  'sp.noPayments':        { en: 'No payment records',       th: 'ไม่มีรายการชำระเงิน' },
  'sp.generatedDocs':     { en: 'Generated Documents',      th: 'เอกสารที่สร้าง' },
  'sp.generate':          { en: 'Generate',                 th: 'สร้าง' },
  'sp.noDocs':            { en: 'No documents yet',         th: 'ยังไม่มีเอกสาร' },

  // ─── Common ────────────────────────────────────────────────────────────
  'common.search':       { en: 'Search…',         th: 'ค้นหา…' },
  'common.add':          { en: 'Add',             th: 'เพิ่ม' },
  'common.edit':         { en: 'Edit',            th: 'แก้ไข' },
  'common.delete':       { en: 'Delete',          th: 'ลบ' },
  'common.cancel':       { en: 'Cancel',          th: 'ยกเลิก' },
  'common.save':         { en: 'Save',            th: 'บันทึก' },
  'common.saving':       { en: 'Saving…',          th: 'กำลังบันทึก…' },
  'common.loading':      { en: 'Loading…',         th: 'กำลังโหลด…' },
  'common.export':       { en: 'Export',          th: 'ส่งออก' },
  'common.download':     { en: 'Download',        th: 'ดาวน์โหลด' },
  'common.preview':      { en: 'Preview',         th: 'ดูตัวอย่าง' },
  'common.email':        { en: 'Email',           th: 'อีเมล' },
  'common.phone':        { en: 'Phone',           th: 'โทรศัพท์' },
  'common.status':       { en: 'Status',          th: 'สถานะ' },
  'common.actions':      { en: 'Actions',         th: 'จัดการ' },
  'common.view':         { en: 'View',            th: 'ดู' },
  'common.next':         { en: 'Next',            th: 'ถัดไป' },
  'common.back':         { en: 'Back',            th: 'ย้อนกลับ' },
  'common.done':         { en: 'Done',            th: 'เสร็จสิ้น' },
  'common.signOut':      { en: 'Sign Out',        th: 'ออกจากระบบ' },
  'common.profile':      { en: 'Profile',         th: 'โปรไฟล์' },
  'common.notifications':{ en: 'Notifications',   th: 'การแจ้งเตือน' },
  'common.viewAll':      { en: 'View all notifications', th: 'ดูการแจ้งเตือนทั้งหมด' },
  'common.new':          { en: 'new',             th: 'ใหม่' },
};

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'edudoc_lang';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === 'en' || stored === 'th') setLangState(stored);
    } catch { /* ignore */ }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
  };

  const t = (key: string, fallback?: string) => {
    const entry = DICT[key];
    if (!entry) return fallback ?? key;
    return entry[lang];
  };

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
