import { supabase } from './supabase';
import type {
  Student, Payment, Document, Teacher, DashboardStats,
  PaymentStatus, StudentStatus, DocumentType, DocumentStatus, PaymentType,
} from './types';

// ─── Type-safe row mappers ────────────────────────────────────────────────────

function mapStudent(row: any): Student {
  return {
    id: row.id,
    studentId: row.student_id,
    firstName: row.first_name,
    lastName: row.last_name,
    grade: row.grade,
    classroom: row.classroom,
    dateOfBirth: row.date_of_birth ?? '',
    enrollmentDate: row.enrollment_date ?? '',
    status: (row.status ?? 'active') as StudentStatus,
    parentName: row.parent_name ?? '',
    parentEmail: row.parent_email ?? '',
    parentPhone: row.parent_phone ?? '',
    address: row.address ?? '',
    paymentStatus: (row.payment_status ?? 'unpaid') as PaymentStatus,
    bloodType: row.blood_type ?? undefined,
    allergies: row.allergies ?? undefined,
    teacherId: row.teacher_id ?? undefined,
    totalDebt: Number(row.total_debt ?? 0),
  };
}

function mapPayment(row: any): Payment {
  return {
    id: row.id,
    studentId: row.student_id,
    amount: Number(row.amount ?? 0),
    dueDate: row.due_date,
    paidDate: row.paid_date ?? undefined,
    status: (row.status ?? 'unpaid') as PaymentStatus,
    term: row.term ?? '',
    type: (row.type ?? 'tuition') as PaymentType,
    receiptNumber: row.receipt_number ?? undefined,
    description: row.description ?? '',
  };
}

function mapDocument(row: any): Document {
  return {
    id: row.id,
    studentId: row.student_id,
    type: (row.type ?? 'receipt') as DocumentType,
    title: row.title,
    generatedAt: row.created_at,
    generatedBy: row.generated_by ?? '',
    status: (row.status ?? 'generated') as DocumentStatus,
    sentTo: row.sent_to ?? undefined,
    fileSize: row.file_size ?? undefined,
  };
}

function mapTeacher(row: any): Teacher {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? '',
    subject: row.subject ?? '',
    classroom: row.classroom ?? '',
    grade: row.grade ?? '',
    joinDate: row.join_date ?? row.created_at ?? '',
    status: (row.status ?? 'active') as 'active' | 'on_leave',
    studentsCount: row.students_count ?? 0,
  };
}

// ─── Students ─────────────────────────────────────────────────────────────────

export async function fetchStudents(): Promise<Student[]> {
  const { data, error } = await supabase.from('students').select('*').order('student_id');
  if (error) { console.error(error); return []; }
  return (data ?? []).map(mapStudent);
}

export async function fetchStudent(id: string): Promise<Student | null> {
  const { data, error } = await supabase.from('students').select('*').eq('id', id).single();
  if (error || !data) return null;
  return mapStudent(data);
}

export async function createStudent(payload: Partial<Student>) {
  const row = {
    student_id: payload.studentId,
    first_name: payload.firstName,
    last_name: payload.lastName,
    grade: payload.grade,
    classroom: payload.classroom,
    date_of_birth: payload.dateOfBirth || null,
    parent_name: payload.parentName,
    parent_email: payload.parentEmail,
    parent_phone: payload.parentPhone,
    address: payload.address,
    payment_status: payload.paymentStatus ?? 'unpaid',
    status: payload.status ?? 'active',
  };
  const { data, error } = await supabase.from('students').insert(row).select().single();
  if (error) throw error;
  return mapStudent(data);
}

export async function updateStudent(id: string, patch: Partial<Student>) {
  const row: any = {};
  if (patch.firstName)     row.first_name     = patch.firstName;
  if (patch.lastName)      row.last_name      = patch.lastName;
  if (patch.grade)         row.grade          = patch.grade;
  if (patch.classroom)     row.classroom      = patch.classroom;
  if (patch.parentEmail)   row.parent_email   = patch.parentEmail;
  if (patch.paymentStatus) row.payment_status = patch.paymentStatus;
  if (patch.status)        row.status         = patch.status;
  const { error } = await supabase.from('students').update(row).eq('id', id);
  if (error) throw error;
}

export async function deleteStudent(id: string) {
  const { error } = await supabase.from('students').delete().eq('id', id);
  if (error) throw error;
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function fetchPayments(): Promise<Payment[]> {
  const { data, error } = await supabase.from('payments').select('*').order('due_date', { ascending: false });
  if (error) { console.error(error); return []; }
  return (data ?? []).map(mapPayment);
}

export async function fetchStudentPayments(studentId: string): Promise<Payment[]> {
  const { data, error } = await supabase.from('payments').select('*').eq('student_id', studentId).order('due_date', { ascending: false });
  if (error) { console.error(error); return []; }
  return (data ?? []).map(mapPayment);
}

// ─── Documents ────────────────────────────────────────────────────────────────

export async function fetchDocuments(): Promise<Document[]> {
  const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return (data ?? []).map(mapDocument);
}

export async function fetchStudentDocuments(studentId: string): Promise<Document[]> {
  const { data, error } = await supabase.from('documents').select('*').eq('student_id', studentId).order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return (data ?? []).map(mapDocument);
}

export async function createDocument(payload: Partial<Document>) {
  const row = {
    student_id: payload.studentId,
    type: payload.type,
    title: payload.title,
    generated_by: payload.generatedBy,
    status: payload.status ?? 'generated',
    sent_to: payload.sentTo,
  };
  const { data, error } = await supabase.from('documents').insert(row).select().single();
  if (error) throw error;
  return mapDocument(data);
}

// ─── Teachers ─────────────────────────────────────────────────────────────────

export async function fetchTeachers(): Promise<Teacher[]> {
  const { data, error } = await supabase.from('teachers').select('*').order('name');
  if (error) { console.error(error); return []; }
  return (data ?? []).map(mapTeacher);
}

export async function fetchTeacher(id: string): Promise<Teacher | null> {
  const { data, error } = await supabase.from('teachers').select('*').eq('id', id).single();
  if (error || !data) return null;
  return mapTeacher(data);
}

// ─── Dashboard stats (computed) ───────────────────────────────────────────────

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [students, payments, documents, teachers] = await Promise.all([
    fetchStudents(),
    fetchPayments(),
    fetchDocuments(),
    fetchTeachers(),
  ]);

  const totalStudents  = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const totalTeachers  = teachers.length;

  const pendingPaymentIds = new Set(payments.filter(p => p.status === 'unpaid' || p.status === 'partial').map(p => p.studentId));
  const overdueIds        = new Set(payments.filter(p => p.status === 'overdue').map(p => p.studentId));

  const collectedRevenue = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pendingRevenue   = payments.filter(p => p.status !== 'paid').reduce((s, p) => s + p.amount, 0);

  const thisMonth = new Date();
  const documentsThisMonth = documents.filter(d => {
    const dt = new Date(d.generatedAt);
    return dt.getMonth() === thisMonth.getMonth() && dt.getFullYear() === thisMonth.getFullYear();
  }).length;

  return {
    totalStudents,
    activeStudents,
    pendingPayments: pendingPaymentIds.size,
    overduePayments: overdueIds.size,
    documentsThisMonth,
    totalTeachers,
    collectedRevenue,
    pendingRevenue,
  };
}
