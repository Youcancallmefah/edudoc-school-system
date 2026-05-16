'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Users, CreditCard, FileText, GraduationCap,
  TrendingUp, AlertTriangle, CheckCircle2, Clock,
  ChevronRight, Send, Download, Plus, ArrowUpRight, Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { formatCurrency, formatDateTime } from '@/lib/mock-data';
import {
  fetchStudents, fetchPayments, fetchDocuments, fetchTeachers, fetchDashboardStats,
} from '@/lib/supabase-queries';
import type { Student, Payment, Document, Teacher, DashboardStats } from '@/lib/types';
import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  trend?: string;
  href?: string;
}

function StatCard({ title, value, sub, icon: Icon, color, bg, trend, href }: StatCardProps) {
  const inner = (
    <div className="card card-hover flex items-start justify-between p-5">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-1.5 text-3xl font-black text-slate-800 tabular-nums">{value}</p>
        {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
        {trend && (
          <div className="mt-2 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-500" />
            <span className="text-xs font-medium text-emerald-600">{trend}</span>
          </div>
        )}
      </div>
      <div className={clsx('flex h-12 w-12 items-center justify-center rounded-xl', bg)}>
        <Icon size={22} className={color} />
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function DashboardPage() {
  const { t } = useI18n();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchStudents(), fetchPayments(), fetchDocuments(), fetchTeachers(), fetchDashboardStats(),
    ]).then(([s, p, d, t, st]) => {
      setStudents(s); setPayments(p); setDocuments(d); setTeachers(t); setStats(st);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <DashboardLayout pageTitle={t('page.dashboard')}>
        <div className="flex flex-col items-center py-32">
          <Loader2 size={36} className="animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-slate-500">{t('dash.loading')}</p>
        </div>
      </DashboardLayout>
    );
  }

  // Payment overview
  const paid    = students.filter(s => s.paymentStatus === 'paid').length;
  const partial = students.filter(s => s.paymentStatus === 'partial').length;
  const unpaid  = students.filter(s => s.paymentStatus === 'unpaid').length;
  const overdue = students.filter(s => s.paymentStatus === 'overdue').length;
  const total   = students.length || 1;
  const pct = (n: number) => Math.round((n / total) * 100);

  // Overdue students
  const overduePayments = payments.filter(p => p.status === 'overdue');
  const studentIds = Array.from(new Set(overduePayments.map(p => p.studentId)));
  const overdueStudents = studentIds.map(id => ({
    student: students.find(s => s.id === id)!,
    payments: overduePayments.filter(p => p.studentId === id),
  })).filter(x => x.student);

  // Recent documents
  const recentDocs = documents.slice(0, 6);
  const typeColors: Record<string, string> = {
    receipt: 'bg-emerald-100 text-emerald-700',
    certificate: 'bg-blue-100 text-blue-700',
    transcript: 'bg-purple-100 text-purple-700',
    enrollment: 'bg-amber-100 text-amber-700',
    graduation: 'bg-cyan-100 text-cyan-700',
    lesson_plan: 'bg-slate-100 text-slate-700',
  };

  return (
    <DashboardLayout pageTitle={t('page.dashboard')}>
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">{t('dash.year')}</p>
            <h1 className="mt-1 text-xl font-bold sm:text-2xl">{t('dash.greeting')}</h1>
            <p className="mt-1 text-sm text-blue-100">
              {stats.pendingPayments} {t('dash.greetingSub')} · {stats.overduePayments} {t('pay.overdue').toLowerCase()}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/documents" className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm hover:bg-white/30">
              <Plus size={16} /> {t('dash.newDocument')}
            </Link>
            <Link href="/students" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50">
              <Users size={16} /> {t('dash.addStudent')}
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t('dash.totalStudents')} value={stats.totalStudents} sub={`${stats.activeStudents} ${t('dash.activeStudents')}`}
          icon={Users} color="text-blue-600" bg="bg-blue-100" href="/students" />
        <StatCard title={t('dash.collectedRevenue')} value={formatCurrency(stats.collectedRevenue)} sub={`${formatCurrency(stats.pendingRevenue)} ${t('dash.pending')}`}
          icon={CreditCard} color="text-emerald-600" bg="bg-emerald-100" href="/finance" />
        <StatCard title={t('dash.docsMonth')} value={stats.documentsThisMonth} sub={t('dash.docsGenSent')}
          icon={FileText} color="text-purple-600" bg="bg-purple-100" href="/documents" />
        <StatCard title={t('dash.teachers')} value={`${stats.totalTeachers - teachers.filter(tc => tc.status === 'on_leave').length}/${stats.totalTeachers}`}
          sub={`${teachers.filter(tc => tc.status === 'on_leave').length} ${t('dash.onLeave')}`}
          icon={GraduationCap} color="text-amber-600" bg="bg-amber-100" href="/teachers" />
      </div>

      <div className="mb-6 card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="section-title">{t('dash.paymentOverview')}</h2>
            <p className="section-subtitle">{t('dash.currentStatus')} {total} {t('dash.studentsLabel')}</p>
          </div>
          <Link href="/finance" className="btn-secondary text-xs py-1.5 px-3">
            {t('dash.viewFinance')} <ChevronRight size={14} />
          </Link>
        </div>

        <div className="mb-4 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="bg-emerald-500" style={{ width: `${pct(paid)}%` }} />
          <div className="bg-blue-400" style={{ width: `${pct(partial)}%` }} />
          <div className="bg-amber-400" style={{ width: `${pct(unpaid)}%` }} />
          <div className="bg-red-500" style={{ width: `${pct(overdue)}%` }} />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: t('pay.paid'),    count: paid,    dot: 'bg-emerald-500' },
            { label: t('pay.partial'), count: partial, dot: 'bg-blue-400' },
            { label: t('pay.unpaid'),  count: unpaid,  dot: 'bg-amber-400' },
            { label: t('pay.overdue'), count: overdue, dot: 'bg-red-500' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
              <div className={clsx('h-2.5 w-2.5 rounded-full', item.dot)} />
              <div>
                <p className="text-lg font-bold text-slate-800">{item.count}</p>
                <p className="text-xs text-slate-500">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="section-title">{t('dash.recentDocs')}</h2>
              <p className="section-subtitle">{t('dash.lastGenerated')}</p>
            </div>
            <Link href="/documents" className="btn-secondary text-xs py-1.5 px-3">
              {t('dash.allDocs')} <ChevronRight size={14} />
            </Link>
          </div>
          {recentDocs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px]">
                <thead className="table-head">
                  <tr>
                    <th className="th">Document</th>
                    <th className="th">Type</th>
                    <th className="th">Generated</th>
                    <th className="th">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDocs.map(doc => {
                    const student = students.find(s => s.id === doc.studentId);
                    return (
                      <tr key={doc.id} className="tr-hover">
                        <td className="td">
                          <p className="font-medium text-slate-800 text-sm">{doc.title}</p>
                          <p className="text-xs text-slate-500">{student?.firstName} {student?.lastName}</p>
                        </td>
                        <td className="td">
                          <span className={clsx('rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', typeColors[doc.type])}>
                            {doc.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="td text-xs text-slate-500">{formatDateTime(doc.generatedAt)}</td>
                        <td className="td">
                          <div className="flex items-center gap-1.5">
                            {doc.status === 'sent' && <Send size={12} className="text-emerald-500" />}
                            {doc.status === 'downloaded' && <Download size={12} className="text-blue-500" />}
                            {doc.status === 'generated' && <Clock size={12} className="text-slate-400" />}
                            <span className="text-xs capitalize">{doc.status}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-slate-400">
              <FileText size={32} className="mx-auto mb-2 text-slate-200" />
              No documents yet
            </div>
          )}
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="section-title text-red-700">{t('dash.overdueAlerts')}</h2>
              <p className="section-subtitle">{overdueStudents.length} {t('dash.studentsLabel')}</p>
            </div>
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          {overdueStudents.length > 0 ? (
            <ul className="space-y-3">
              {overdueStudents.map(({ student, payments }) => {
                const t = payments.reduce((s, p) => s + p.amount, 0);
                return (
                  <li key={student.id} className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{student.firstName} {student.lastName}</p>
                      <p className="text-xs text-slate-500">{student.classroom} · {payments.length} payment{payments.length > 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-700">{formatCurrency(t)}</p>
                      <Link href={`/students/${student.id}`} className="text-xs text-blue-600 hover:underline flex items-center gap-0.5 justify-end">
                        View <ArrowUpRight size={10} />
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-8 text-center text-sm text-slate-400">
              <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-200" />
              {t('dash.noOverdue')}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
