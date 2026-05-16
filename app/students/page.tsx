'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Search, Plus, Download, Users,
  ChevronRight, SlidersHorizontal, X, Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { GRADE_ORDER } from '@/lib/mock-data';
import { useI18n } from '@/lib/i18n';
import { fetchStudents, createStudent } from '@/lib/supabase-queries';
import type { Student, PaymentStatus, StudentStatus } from '@/lib/types';
import { clsx } from 'clsx';

const PAYMENT_BADGE: Record<PaymentStatus, string> = {
  paid:    'badge-paid',
  unpaid:  'badge-unpaid',
  overdue: 'badge-overdue',
  partial: 'badge-partial',
};

const STATUS_BADGE: Record<StudentStatus, string> = {
  active:    'badge-active',
  inactive:  'badge-inactive',
  graduated: 'badge-graduated',
};

function AddStudentModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { t } = useI18n();
  const [form, setForm] = useState({
    studentId: '', firstName: '', lastName: '', grade: 'K1', classroom: 'K1-A',
    dateOfBirth: '', parentName: '', parentEmail: '', parentPhone: '', address: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await createStudent({
        studentId: form.studentId || `S-${Date.now()}`,
        firstName: form.firstName,
        lastName: form.lastName,
        grade: form.grade,
        classroom: form.classroom,
        dateOfBirth: form.dateOfBirth,
        parentName: form.parentName,
        parentEmail: form.parentEmail,
        parentPhone: form.parentPhone,
        address: form.address,
      });
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.message ?? 'Failed to save student');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-800">{t('st.modal.title')}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">{t('st.modal.studentId')} *</label>
              <input className="input font-mono" placeholder="6701001" value={form.studentId}
                onChange={e => setForm(p => ({ ...p, studentId: e.target.value }))} />
            </div>
            <div>
              <label className="label">{t('st.modal.firstName')} *</label>
              <input className="input" value={form.firstName}
                onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
            </div>
            <div>
              <label className="label">{t('st.modal.lastName')} *</label>
              <input className="input" value={form.lastName}
                onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
            </div>
            <div>
              <label className="label">{t('st.grade')} *</label>
              <select className="input" value={form.grade}
                onChange={e => setForm(p => ({ ...p, grade: e.target.value }))}>
                {GRADE_ORDER.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="label">{t('st.modal.classroom')} *</label>
              <input className="input" placeholder="K1-A" value={form.classroom}
                onChange={e => setForm(p => ({ ...p, classroom: e.target.value }))} />
            </div>
            <div>
              <label className="label">{t('st.modal.dob')}</label>
              <input type="date" className="input" value={form.dateOfBirth}
                onChange={e => setForm(p => ({ ...p, dateOfBirth: e.target.value }))} />
            </div>
            <div>
              <label className="label">{t('st.modal.parentName')} *</label>
              <input className="input" value={form.parentName}
                onChange={e => setForm(p => ({ ...p, parentName: e.target.value }))} />
            </div>
            <div>
              <label className="label">{t('st.modal.parentEmail')} *</label>
              <input type="email" className="input" placeholder="parent@email.com" value={form.parentEmail}
                onChange={e => setForm(p => ({ ...p, parentEmail: e.target.value }))} />
            </div>
            <div>
              <label className="label">{t('st.modal.parentPhone')} *</label>
              <input className="input" placeholder="08X-XXX-XXXX" value={form.parentPhone}
                onChange={e => setForm(p => ({ ...p, parentPhone: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">{t('st.modal.address')}</label>
              <textarea className="input resize-none" rows={2} value={form.address}
                onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
            </div>
            {error && (
              <div className="sm:col-span-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} className="btn-secondary" disabled={saving}>{t('common.cancel')}</button>
          <button
            onClick={handleSave}
            className="btn-primary"
            disabled={saving || !form.firstName || !form.lastName || !form.studentId}
          >
            {saving ? <><Loader2 size={14} className="animate-spin" /> {t('common.saving')}</> : <><Plus size={16} /> {t('st.addStudent')}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudentsPage() {
  const { t } = useI18n();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);

  async function reload() {
    setLoading(true);
    const data = await fetchStudents();
    setStudents(data);
    setLoading(false);
  }

  useEffect(() => { reload(); }, []);

  const grades = ['All', ...GRADE_ORDER];
  const statuses: (StudentStatus | 'All')[] = ['All', 'active', 'inactive', 'graduated'];
  const paymentStatuses: (PaymentStatus | 'All')[] = ['All', 'paid', 'partial', 'unpaid', 'overdue'];

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.studentId.includes(q) ||
      s.parentName.toLowerCase().includes(q) ||
      s.classroom.toLowerCase().includes(q);
    const matchGrade = gradeFilter === 'All' || s.grade === gradeFilter;
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchPayment = paymentFilter === 'All' || s.paymentStatus === paymentFilter;
    return matchSearch && matchGrade && matchStatus && matchPayment;
  });

  const totalActive = students.filter(s => s.status === 'active').length;
  const totalOverdue = students.filter(s => s.paymentStatus === 'overdue').length;

  if (loading) {
    return (
      <DashboardLayout pageTitle={t('page.students')}>
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 size={36} className="animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-slate-500">{t('st.loading')}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle={t('page.students')}>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-4 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
            <Users size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{students.length}</p>
            <p className="text-xs text-slate-500">{t('st.totalStudents')}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
            <Users size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{totalActive}</p>
            <p className="text-xs text-slate-500">{t('st.activeStudents')}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100">
            <Users size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{totalOverdue}</p>
            <p className="text-xs text-slate-500">{t('st.overdueCount')}</p>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-9"
                placeholder={t('st.searchPlaceholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary text-xs py-2 px-3 gap-1.5">
                <Download size={14} /> {t('common.export')}
              </button>
              <button onClick={() => setShowModal(true)} className="btn-primary text-xs py-2 px-3">
                <Plus size={14} /> {t('st.addStudent')}
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal size={13} className="text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">{t('st.filters')}</span>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5 flex-wrap">
              <span className="px-1.5 text-[10px] font-semibold text-slate-400 uppercase">{t('st.grade')}</span>
              {grades.map(g => (
                <button
                  key={g}
                  onClick={() => setGradeFilter(g)}
                  className={clsx(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition',
                    gradeFilter === g ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                  )}
                >{g}</button>
              ))}
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 outline-none">
              {statuses.map(s => <option key={s} value={s}>{s === 'All' ? t('st.allStatuses') : t(`status.${s}`, s)}</option>)}
            </select>
            <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 outline-none">
              {paymentStatuses.map(s => <option key={s} value={s}>{s === 'All' ? t('st.allPayments') : t(`status.${s}`, s)}</option>)}
            </select>
          </div>
          <p className="mt-2 text-xs text-slate-400">{t('st.showing')} {filtered.length} {t('st.of')} {students.length} {t('st.studentsLower')}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px]">
            <thead className="table-head">
              <tr>
                <th className="th">{t('st.col.student')}</th>
                <th className="th">{t('st.col.id')}</th>
                <th className="th">{t('st.col.gradeClass')}</th>
                <th className="th">{t('st.col.parent')}</th>
                <th className="th">{t('st.col.status')}</th>
                <th className="th">{t('st.col.payment')}</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student: Student) => (
                <tr key={student.id} className="tr-hover">
                  <td className="td">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-xs font-bold text-white shadow-sm">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{student.firstName} {student.lastName}</p>
                        <p className="text-xs text-slate-400">{student.parentEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="td"><span className="font-mono text-xs text-slate-600">{student.studentId}</span></td>
                  <td className="td">
                    <span className="font-semibold text-slate-700">{student.grade}</span>
                    <span className="ml-1.5 text-xs text-slate-400">{student.classroom}</span>
                  </td>
                  <td className="td">
                    <p className="text-sm text-slate-700">{student.parentName}</p>
                    <p className="text-xs text-slate-400">{student.parentPhone}</p>
                  </td>
                  <td className="td"><span className={STATUS_BADGE[student.status]}>{t(`status.${student.status}`, student.status)}</span></td>
                  <td className="td"><span className={PAYMENT_BADGE[student.paymentStatus]}>{t(`status.${student.paymentStatus}`, student.paymentStatus)}</span></td>
                  <td className="td">
                    <Link href={`/students/${student.id}`} className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                      {t('common.view')} <ChevronRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-sm text-slate-400">
                    <Users size={32} className="mx-auto mb-2 text-slate-200" />
                    {t('st.noResults')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <AddStudentModal onClose={() => setShowModal(false)} onSaved={reload} />}
    </DashboardLayout>
  );
}
