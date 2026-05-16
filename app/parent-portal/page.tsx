'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  User, CreditCard, FileText, Bell, Download, Mail, Phone,
  Calendar, Home, Send, BookOpen, Loader2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/mock-data';
import { supabase } from '@/lib/supabase';
import { fetchStudentPayments, fetchStudentDocuments } from '@/lib/supabase-queries';
import type { Student, Payment, Document } from '@/lib/types';
import { clsx } from 'clsx';

export default function ParentPortalPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [student, setStudent] = useState<Student | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Find student by parent email
      const email = user?.email ?? 'parent@brightfuture.ac.th';
      const { data } = await supabase.from('students').select('*').eq('parent_email', email).limit(1);
      if (data && data[0]) {
        const s = data[0];
        const child: Student = {
          id: s.id, studentId: s.student_id,
          firstName: s.first_name, lastName: s.last_name,
          grade: s.grade, classroom: s.classroom,
          dateOfBirth: s.date_of_birth ?? '',
          enrollmentDate: s.enrollment_date ?? '',
          status: s.status, parentName: s.parent_name,
          parentEmail: s.parent_email, parentPhone: s.parent_phone,
          address: s.address, paymentStatus: s.payment_status,
          bloodType: s.blood_type, allergies: s.allergies,
          totalDebt: Number(s.total_debt ?? 0),
        };
        setStudent(child);
        const [p, d] = await Promise.all([
          fetchStudentPayments(child.id),
          fetchStudentDocuments(child.id),
        ]);
        setPayments(p); setDocuments(d);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout pageTitle={t('page.parent')}>
        <div className="flex flex-col items-center py-32">
          <Loader2 size={36} className="animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-slate-500">{t('common.loading')}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout pageTitle={t('page.parent')}>
        <div className="card p-8 text-center">
          <p className="text-slate-600">No child record linked to this account.</p>
          <p className="text-xs text-slate-400 mt-2">Logged in as: {user?.email}</p>
        </div>
      </DashboardLayout>
    );
  }

  const totalBilled = payments.reduce((s, p) => s + p.amount, 0);
  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);

  return (
    <DashboardLayout pageTitle={t('page.parent')}>
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-500 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-100">{t('pp.welcome')}</p>
            <h1 className="mt-1 text-xl font-bold">{student.parentName}</h1>
            <p className="mt-1 text-sm text-cyan-100">
              {t('pp.parentOf')} <span className="font-bold text-white">{student.firstName} {student.lastName}</span> · {student.classroom}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-black shadow-inner">
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{student.firstName} {student.lastName}</p>
              <p className="text-xs text-cyan-100">ID: {student.studentId}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-4 flex items-center gap-3">
          <div className={clsx('flex h-11 w-11 items-center justify-center rounded-xl',
            student.paymentStatus === 'paid' ? 'bg-emerald-100' : 'bg-amber-100')}>
            <CreditCard size={20} className={student.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'} />
          </div>
          <div>
            <p className="text-xs text-slate-500">{t('pp.paymentStatus')}</p>
            <p className={clsx('text-sm font-bold', student.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700')}>{t(`status.${student.paymentStatus}`, student.paymentStatus)}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
            <FileText size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">{t('pp.docsAvailable')}</p>
            <p className="text-sm font-bold">{documents.length} {t('pp.available')}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
            <BookOpen size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">{t('pp.gradeClass')}</p>
            <p className="text-sm font-bold">{student.grade} — {student.classroom}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
              <User size={15} className="text-cyan-500" /> {t('pp.childInfo')}
            </h3>
            <dl className="space-y-3 text-sm">
              <div><dt className="text-xs text-slate-400">{t('pp.fullName')}</dt><dd className="font-semibold">{student.firstName} {student.lastName}</dd></div>
              <div><dt className="text-xs text-slate-400">{t('pp.studentId')}</dt><dd className="font-mono font-semibold">{student.studentId}</dd></div>
              {student.dateOfBirth && (
                <div className="flex items-center gap-2"><Calendar size={13} className="text-slate-400" />
                  <div><dt className="text-xs text-slate-400">{t('pp.dob')}</dt><dd className="font-medium">{formatDate(student.dateOfBirth)}</dd></div>
                </div>
              )}
              <div><dt className="text-xs text-slate-400">{t('pp.bloodAllergies')}</dt><dd className="font-medium">{student.bloodType ?? 'N/A'} · {student.allergies ?? 'None'}</dd></div>
            </dl>
          </div>

          <div className="card p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
              <Home size={15} className="text-blue-500" /> {t('pp.schoolContact')}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400" /><span>02-123-4567</span></div>
              <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400" />
                <a href="mailto:info@brightfuture.ac.th" className="text-blue-600 hover:underline text-xs">info@brightfuture.ac.th</a>
              </div>
              <button className="btn-secondary w-full justify-center text-xs py-2">
                <Send size={13} /> {t('pp.messageSchool')}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5 lg:col-span-2">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <CreditCard size={15} className="text-emerald-500" /> {t('pp.paymentSummary')}
              </h3>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">
                <p className="text-xl font-black text-emerald-700 tabular-nums">{formatCurrency(totalPaid)}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t('pp.paid')}</p>
              </div>
              <div className={clsx('rounded-xl border p-4 text-center',
                totalBilled - totalPaid > 0 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100')}>
                <p className={clsx('text-xl font-black tabular-nums',
                  totalBilled - totalPaid > 0 ? 'text-red-700' : 'text-slate-400')}>
                  {formatCurrency(totalBilled - totalPaid)}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{t('pp.outstanding')}</p>
              </div>
            </div>

            {payments.length > 0 ? (
              <div className="space-y-2">
                {payments.map(p => (
                  <div key={p.id} className={clsx('flex items-center justify-between rounded-xl border px-4 py-3',
                    p.status === 'paid' ? 'border-emerald-100 bg-emerald-50/50' : 'border-amber-100 bg-amber-50/50')}>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{p.description}</p>
                      <p className="text-xs text-slate-500">
                        {t('pp.due')}: {formatDate(p.dueDate)}
                        {p.paidDate && ` · ${t('pp.paidOn')}: ${formatDate(p.paidDate)}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold tabular-nums text-sm">{formatCurrency(p.amount)}</p>
                      <span className={clsx('rounded-full px-2 py-0.5 text-[10px] font-semibold', {
                        'bg-emerald-100 text-emerald-700': p.status === 'paid',
                        'bg-amber-100 text-amber-700': p.status === 'unpaid',
                        'bg-red-100 text-red-700': p.status === 'overdue',
                      })}>{t(`status.${p.status}`, p.status)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-slate-400 py-4">{t('pp.noPayments')}</p>
            )}
          </div>

          <div className="card p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
              <FileText size={15} className="text-purple-500" /> {t('pp.myDocs')}
            </h3>
            {documents.length > 0 ? (
              <div className="space-y-2.5">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                        <FileText size={15} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{doc.title}</p>
                        <p className="text-xs text-slate-400">{formatDateTime(doc.generatedAt)}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100">
                      <Download size={12} /> {t('common.download')}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 text-slate-400">
                <FileText size={32} className="mb-2 text-slate-200" />
                <p className="text-sm">{t('pp.noDocs')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
