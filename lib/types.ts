export type Role = 'admin' | 'registration' | 'finance' | 'teacher' | 'parent';

export type PaymentStatus = 'paid' | 'unpaid' | 'overdue' | 'partial';
export type StudentStatus = 'active' | 'inactive' | 'graduated';
export type DocumentType =
  | 'receipt'
  | 'certificate'
  | 'transcript'
  | 'enrollment'
  | 'graduation'
  | 'lesson_plan';
export type DocumentStatus = 'generated' | 'sent' | 'downloaded';
export type PaymentType = 'tuition' | 'activity' | 'uniform' | 'lunch' | 'other';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarInitials: string;
  department?: string;
}

export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  grade: string;       // K1, K2, K3, G1 … G6
  classroom: string;   // e.g. "K1-A"
  dateOfBirth: string; // ISO date string
  enrollmentDate: string;
  status: StudentStatus;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  paymentStatus: PaymentStatus;
  bloodType?: string;
  allergies?: string;
  teacherId?: string;
  totalDebt: number; // remaining unpaid in THB
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;      // THB
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  term: string;        // e.g. "2024-T1"
  type: PaymentType;
  receiptNumber?: string;
  description: string;
}

export interface Document {
  id: string;
  studentId: string;
  type: DocumentType;
  title: string;
  generatedAt: string;
  generatedBy: string;
  status: DocumentStatus;
  sentTo?: string;
  fileSize?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  classroom: string;
  grade: string;
  joinDate: string;
  status: 'active' | 'on_leave';
  studentsCount: number;
}

export interface Notification {
  id: string;
  type: 'payment' | 'document' | 'system' | 'announcement';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  userId?: string;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  pendingPayments: number;
  overduePayments: number;
  documentsThisMonth: number;
  totalTeachers: number;
  collectedRevenue: number;
  pendingRevenue: number;
}
