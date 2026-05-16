'use client';

import { use, useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, BookOpen,
  CreditCard, FileText, Heart, User, Send, Download, Plus,
  AlertCircle, Clock, Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/mock-data';
import {
  fetchStudent, fetchStudentPayments, fetchStudentDocuments, fetchTeacher,
} from '@/lib/supabase-queries';
import { generateAndDownload } from '@/lib/pdf/generate';
import type { Student, Payment, Document, Teacher, PaymentStatus, DocumentType } from '@/lib/types';
import { clsx } from 'clsx';

const PAYMENT_BADGE: Record<PaymentStatus, string> = {
  paid: 'badge-paid', unpaid: 'badge-unpaid', overdue: 'badge-overdue', partial: 'badge-partial',
};

const DOC_TYPE_COLOR: Record<DocumentType, string> = {
  receipt: 'bg-emerald-100 text-emerald-700',
  certificate: 'bg-blue-100 text-blue-700',
  transcript: 'bg-purple-100 text-purple-700',
  enrollment: 'bg-amber-100 text-amber-700',
  graduation: 'bg-cyan-100 text-cyan-700',
  lesson_plan: 'bg-slate-100 text-slate-600',
};

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useI18n();
  const { id } = use(params);
  const [student, setStudent] = useState<Student | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const s = await fetchStudent(id);
      setStudent(s);
      if (s) {
        const [p, d, t] = await Promise.all([
          fetchStudentPayments(id),
          fetchStudentDocuments(id),
          s.teacherId ? fetchTeacher(s.teacherId) : Promise.resolve(null),
        ]);
        setPayments(p); setDocuments(d); setTeacher(t);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout pageTitle={t('page.studentProfile')}>
        <div className="flex flex-col items-center py-32">
          <Loader2 size={36} className="animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-slate-500">{t('common.loading')}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout pageTitle="Student Not Found">
        <div className="flex flex-col items-center justify-center py-32">
          <AlertCircle size={48} className="mb-4 text-slate-300" />
          <h2 className="text-xl font-bold text-slate-600">Student not found</h2>
          <Link href="/students" className="mt-4 btn-primary">← Back to Students</Link>
        </div>
      </DashboardLayout>
    );
  }

  const totalBilled = payments.reduce((s, p) => s + p.amount, 0);
  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = totalBilled - totalPaid;
  const initials = `${student.firstName[0]}${student.lastName[0]}`;
  const AVATAR_COLORS = ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-emerald-500 to-emerald-600', 'from-amber-500 to-amber-600', 'from-cyan-500 to-cyan-600'];
  const avatarColor = AVATAR_COLORS[student.id.charCodeAt(1) % AVATAR_COLORS.length];

  return (
    <DashboardLayout pageTitle={t('page.studentProfile')}>
      <div className="mb-4">
        <Link href="/students" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft size={16} /> {t('sp.back')}
        </Link>
      </div>

      <div className="card mb-6 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-500" />
        <div className="px-6 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4 -mt-10">
              <div className={clsx('flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-black text-white shadow-lg ring-4 ring-white', avatarColor)}>
                {initials}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-800">{student.firstName} {student.lastName}</h1>
                  <span className={clsx('rounded-full px-2.5 py-0.5 text-xs font-semibold', {
                    'bg-emerald-100 text-emerald-700': student.status === 'active',
                    'bg-slate-100 text-slate-500': student.status === 'inactive',
                    'bg-purple-100 text-purple-700': student.status === 'graduated',
                  })}>{t(`status.${student.status}`, student.status)}</span>
                </div>
                <p className="text-sm text-slate-500">
                  {t('st.col.id')}: <span className="font-mono font-semibold">{student.studentId}</span>
                  {' · '}{student.classroom} · {student.grade}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary text-xs py-2 px-3"><Mail size={14} /> {t('sp.emailParent')}</button>
              <Link href="/documents" className="btn-primary text-xs py-2 px-3"><FileText size={14} /> {t('sp.generateDoc')}</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-1">
          <div className="card p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
              <User size={15} className="text-blue-500" /> {t('sp.personalInfo')}
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start gap-2"><Calendar size={14} className="mt-0.5 text-slate-400" />
                <div><dt className="text-xs text-slate-400">{t('sp.dob')}</dt>
                <dd className="font-medium text-slate-700">{student.dateOfBirth ? formatDate(student.dateOfBirth) : 'N/A'}</dd></div>
              </div>
              <div className="flex items-start gap-2"><Heart size={14} className="mt-0.5 text-slate-400" />
                <div><dt className="text-xs text-slate-400">{t('sp.bloodAllergies')}</dt>
                <dd className="font-medium text-slate-700">{student.bloodType ?? 'N/A'} · {student.allergies ?? 'None'}</dd></div>
              </div>
              <div className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 text-slate-400" />
                <div><dt className="text-xs text-slate-400">{t('sp.address')}</dt>
                <dd className="font-medium text-slate-700 leading-snug">{student.address || 'N/A'}</dd></div>
              </div>
            </dl>
          </div>

          <div className="card p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
              <User size={15} className="text-purple-500" /> {t('sp.parent')}
            </h3>
            <dl className="space-y-3 text-sm">
              <div><dt className="text-xs text-slate-400">{t('sp.parentName')}</dt><dd className="font-medium text-slate-700">{student.parentName}</dd></div>
              <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400" />
                <a href={`mailto:${student.parentEmail}`} className="text-blue-600 hover:underline text-xs">{student.parentEmail}</a>
              </div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400" />
                <span className="text-slate-700">{student.parentPhone}</span>
              </div>
            </dl>
          </div>

          {teacher && (
            <div className="card p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
                <BookOpen size={15} className="text-amber-500" /> {t('sp.teacher')}
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                  {teacher.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{teacher.name}</p>
                  <p className="text-xs text-slate-500">{teacher.subject}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5 lg:col-span-2">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <CreditCard size={15} className="text-emerald-500" /> {t('sp.paymentSummary')}
              </h3>
              <span className={PAYMENT_BADGE[student.paymentStatus]}>{t(`status.${student.paymentStatus}`, student.paymentStatus)}</span>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-lg font-black text-slate-800 tabular-nums">{formatCurrency(totalBilled)}</p>
                <p className="text-xs text-slate-500">{t('sp.totalBilled')}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-lg font-black text-emerald-700 tabular-nums">{formatCurrency(totalPaid)}</p>
                <p className="text-xs text-slate-500">{t('sp.totalPaid')}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className={clsx('text-lg font-black tabular-nums', totalPending > 0 ? 'text-red-600' : 'text-slate-400')}>{formatCurrency(totalPending)}</p>
                <p className="text-xs text-slate-500">{t('sp.outstanding')}</p>
              </div>
            </div>

            {payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead><tr className="border-b border-slate-100">
                    <th className="th">{t('sp.description')}</th><th className="th">{t('sp.termLabel')}</th>
                    <th className="th">{t('sp.amount')}</th><th className="th">{t('sp.dueDate')}</th><th className="th">{t('common.status')}</th>
                  </tr></thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p.id} className="tr-hover">
                        <td className="td">
                          <p className="text-sm font-medium text-slate-800">{p.description}</p>
                          {p.receiptNumber && <p className="text-xs text-slate-400 font-mono">{p.receiptNumber}</p>}
                        </td>
                        <td className="td text-xs text-slate-500">{p.term}</td>
                        <td className="td font-semibold tabular-nums">{formatCurrency(p.amount)}</td>
                        <td className="td text-xs text-slate-500">{formatDate(p.dueDate)}</td>
                        <td className="td"><span className={PAYMENT_BADGE[p.status]}>{t(`status.${p.status}`, p.status)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-sm text-slate-400 py-6">{t('sp.noPayments')}</p>
            )}
          </div>

          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <FileText size={15} className="text-purple-500" /> {t('sp.generatedDocs')}
              </h3>
              <button className="btn-primary text-xs py-1.5 px-3"><Plus size={13} /> {t('sp.generate')}</button>
            </div>
            {documents.length > 0 ? (
              <ul className="space-y-2.5">
                {documents.map(doc => (
                  <li key={doc.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
                        <FileText size={14} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{doc.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={clsx('rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize', DOC_TYPE_COLOR[doc.type])}>
                            {doc.type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-400">{formatDateTime(doc.generatedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        {doc.status === 'sent' && <Send size={12} className="text-emerald-500" />}
                        {doc.status === 'downloaded' && <Download size={12} className="text-blue-500" />}
                        {doc.status === 'generated' && <Clock size={12} className="text-slate-400" />}
                        <span className="capitalize">{doc.status}</span>
                      </div>
                      <button
                        onClick={() => generateAndDownload(doc.type, student, payments)}
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:text-blue-600"
                        title="Download PDF"
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center py-8 text-slate-400">
                <FileText size={32} className="mb-2 text-slate-200" />
                <p className="text-sm">{t('sp.noDocs')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
