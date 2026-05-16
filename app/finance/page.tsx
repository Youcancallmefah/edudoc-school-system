'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  CreditCard, TrendingUp, AlertTriangle, CheckCircle2,
  Search, Download, Receipt, Send, Eye, DollarSign, Clock, Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { formatCurrency } from '@/lib/mock-data';
import { fetchStudents, fetchPayments, fetchStudentPayments } from '@/lib/supabase-queries';
import { generateAndDownload } from '@/lib/pdf/generate';
import type { Student, Payment, PaymentStatus } from '@/lib/types';
import { clsx } from 'clsx';

const STATUS_BADGE: Record<PaymentStatus, string> = {
  paid: 'badge-paid', unpaid: 'badge-unpaid', overdue: 'badge-overdue', partial: 'badge-partial',
};

function ReceiptModal({ studentName, onClose }: { studentName: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-800">Receipt Preview</h2>
          <p className="text-sm text-slate-500">{studentName}</p>
        </div>
        <div className="p-6">
          <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6">
            <div className="mb-4 text-center">
              <p className="text-lg font-black text-blue-700">BRIGHT FUTURE ACADEMY</p>
              <p className="text-xs text-slate-500">Official Tuition Receipt</p>
              <p className="mt-1 font-mono text-xs text-slate-400">RC-2026-{Math.floor(Math.random() * 900 + 100)}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Student:</span><span className="font-semibold">{studentName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Term:</span><span className="font-semibold">1 / 2026</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Tuition Fee:</span><span className="font-semibold">฿18,000</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-2"><span className="font-bold">Total:</span><span className="font-black text-emerald-700">฿18,000</span></div>
            </div>
            <div className="mt-4 rounded-lg bg-emerald-100 px-3 py-2 text-center text-xs font-semibold text-emerald-700">✓ PAYMENT CONFIRMED</div>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button className="btn-secondary gap-2"><Send size={14} /> Email</button>
          <button className="btn-primary gap-2"><Download size={14} /> PDF</button>
        </div>
      </div>
    </div>
  );
}

export default function FinancePage() {
  const { t } = useI18n();
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | PaymentStatus>('All');
  const [receiptStudent, setReceiptStudent] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchStudents(), fetchPayments()]).then(([s, p]) => {
      setStudents(s); setPayments(p); setLoading(false);
    });
  }, []);

  const rows = students.map(s => {
    const ps = payments.filter(p => p.studentId === s.id);
    const billed = ps.reduce((sum, p) => sum + p.amount, 0);
    const paid = ps.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    return { ...s, billed, paid, balance: billed - paid };
  });

  const filtered = rows.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.firstName.toLowerCase().includes(q) || r.lastName.toLowerCase().includes(q) || r.studentId.includes(q);
    const matchStatus = statusFilter === 'All' || r.paymentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const collected = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter(p => p.status !== 'paid').reduce((s, p) => s + p.amount, 0);
  const overdueAmount = rows.filter(r => r.paymentStatus === 'overdue').reduce((s, r) => s + r.balance, 0);
  const overdueCount = rows.filter(r => r.paymentStatus === 'overdue').length;
  const paidCount = rows.filter(r => r.paymentStatus === 'paid').length;

  const filters: { label: string; value: 'All' | PaymentStatus; color: string }[] = [
    { label: t('fin.filter.all'), value: 'All',     color: 'bg-slate-600' },
    { label: t('status.paid'),    value: 'paid',    color: 'bg-emerald-600' },
    { label: t('status.partial'), value: 'partial', color: 'bg-blue-500' },
    { label: t('status.unpaid'),  value: 'unpaid',  color: 'bg-amber-500' },
    { label: t('status.overdue'), value: 'overdue', color: 'bg-red-600' },
  ];

  if (loading) {
    return (
      <DashboardLayout pageTitle={t('page.finance')}>
        <div className="flex flex-col items-center py-32">
          <Loader2 size={36} className="animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-slate-500">{t('common.loading')}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle={t('page.finance')}>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: t('fin.collected'), value: formatCurrency(collected), sub: t('fin.term'), icon: TrendingUp, bg: 'bg-emerald-100', color: 'text-emerald-600', border: 'border-l-emerald-500' },
          { label: t('fin.pendingPayments'), value: formatCurrency(pending), sub: `${rows.filter(r => r.balance > 0).length} ${t('fin.students')}`, icon: Clock, bg: 'bg-amber-100', color: 'text-amber-600', border: 'border-l-amber-500' },
          { label: t('fin.overdueAmount'), value: formatCurrency(overdueAmount), sub: `${overdueCount} ${t('fin.students')}`, icon: AlertTriangle, bg: 'bg-red-100', color: 'text-red-600', border: 'border-l-red-500' },
          { label: t('fin.fullyPaid'), value: paidCount, sub: `${t('st.of')} ${students.length} ${t('fin.students')}`, icon: CheckCircle2, bg: 'bg-blue-100', color: 'text-blue-600', border: 'border-l-blue-500' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={clsx('card border-l-4 p-5', card.border)}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">{card.label}</p>
                  <p className="mt-1.5 text-2xl font-black tabular-nums text-slate-800">{card.value}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{card.sub}</p>
                </div>
                <div className={clsx('flex h-10 w-10 items-center justify-center rounded-xl', card.bg)}>
                  <Icon size={18} className={card.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-5 text-white shadow-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-100">{t('fin.collectionProgress')}</p>
            <p className="mt-1 text-2xl font-black">
              {formatCurrency(collected)} <span className="text-sm font-normal text-emerald-100">{t('fin.collectedOf')} {formatCurrency(collected + pending)}</span>
            </p>
            <div className="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-emerald-700">
              <div className="h-full rounded-full bg-white transition-all"
                style={{ width: collected + pending > 0 ? `${Math.round(collected / (collected + pending) * 100)}%` : '0%' }} />
            </div>
            <p className="mt-1.5 text-xs text-emerald-100">
              {collected + pending > 0 ? Math.round(collected / (collected + pending) * 100) : 0}% {t('fin.collected2')}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm hover:bg-white/30">
              <Send size={15} /> {t('fin.sendReminders')}
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
              <Download size={15} /> {t('common.export')}
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="section-title">{t('fin.title')}</h2>
              <p className="section-subtitle">{t('fin.subtitle')}</p>
            </div>
            <div className="relative">
              <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input pl-8 text-xs py-2" placeholder={t('common.search')} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {filters.map(f => (
              <button key={f.value} onClick={() => setStatusFilter(f.value)}
                className={clsx('rounded-full px-3 py-1 text-xs font-semibold transition',
                  statusFilter === f.value ? `${f.color} text-white shadow-sm` : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}>
                {f.label} <span className="ml-1 opacity-70">
                  ({f.value === 'All' ? rows.length : rows.filter(r => r.paymentStatus === f.value).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="table-head">
              <tr>
                <th className="th">{t('st.col.student')}</th><th className="th">{t('st.grade')}</th>
                <th className="th">{t('fin.col.billed')}</th><th className="th">{t('fin.col.paid')}</th>
                <th className="th">{t('fin.col.balance')}</th><th className="th">{t('common.status')}</th><th className="th">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className={clsx('tr-hover', row.paymentStatus === 'overdue' && 'bg-red-50/30')}>
                  <td className="td">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                        {row.firstName[0]}{row.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{row.firstName} {row.lastName}</p>
                        <p className="text-xs text-slate-400 font-mono">{row.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="td text-sm font-medium">{row.classroom}</td>
                  <td className="td font-mono text-sm">{row.billed > 0 ? formatCurrency(row.billed) : '—'}</td>
                  <td className="td font-mono text-sm text-emerald-700 font-semibold">{row.paid > 0 ? formatCurrency(row.paid) : '—'}</td>
                  <td className="td">
                    <span className={clsx('font-mono text-sm font-bold tabular-nums', row.balance > 0 ? 'text-red-600' : 'text-slate-400')}>
                      {row.balance > 0 ? formatCurrency(row.balance) : '฿0'}
                    </span>
                  </td>
                  <td className="td"><span className={STATUS_BADGE[row.paymentStatus]}>{t(`status.${row.paymentStatus}`, row.paymentStatus)}</span></td>
                  <td className="td">
                    <div className="flex items-center gap-1">
                      <button onClick={async () => {
                        const pays = await fetchStudentPayments(row.id);
                        generateAndDownload('receipt', row, pays);
                      }}
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:text-blue-600" title="Download Receipt PDF">
                        <Receipt size={13} />
                      </button>
                      <button className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:text-emerald-600" title="Send">
                        <Send size={13} />
                      </button>
                      <Link href={`/students/${row.id}`} className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:text-slate-700" title="View">
                        <Eye size={13} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-sm text-slate-400">
              <DollarSign size={32} className="mx-auto mb-2 text-slate-200" />
              {t('fin.noRecords')}
            </div>
          )}
        </div>
      </div>

      {receiptStudent && <ReceiptModal studentName={receiptStudent} onClose={() => setReceiptStudent(null)} />}
    </DashboardLayout>
  );
}
