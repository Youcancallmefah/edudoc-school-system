'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  FileText, Plus, Search, Download, Send, Eye,
  Receipt, Award, BookOpen, FileCheck, GraduationCap,
  CheckCircle2, Clock, Loader2, X, ChevronDown,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { formatDateTime } from '@/lib/mock-data';
import { fetchStudents, fetchDocuments, createDocument, fetchStudentPayments } from '@/lib/supabase-queries';
import { generateAndDownload, previewPdf } from '@/lib/pdf/generate';
import type { Student, Document, DocumentType } from '@/lib/types';
import { clsx } from 'clsx';

interface DocTypeConfig {
  key: DocumentType;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  estimatedTime: string;
}

const DOC_TYPES: DocTypeConfig[] = [
  { key: 'receipt', label: 'Tuition Receipt', desc: 'Official payment receipt', icon: Receipt, color: 'text-emerald-600', bg: 'bg-emerald-100', estimatedTime: '~5 sec' },
  { key: 'certificate', label: 'Student Certificate', desc: 'Academic achievement', icon: Award, color: 'text-blue-600', bg: 'bg-blue-100', estimatedTime: '~8 sec' },
  { key: 'transcript', label: 'Grade Transcript', desc: 'Semester report card', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100', estimatedTime: '~10 sec' },
  { key: 'enrollment', label: 'Enrollment Letter', desc: 'Active enrollment', icon: FileCheck, color: 'text-amber-600', bg: 'bg-amber-100', estimatedTime: '~5 sec' },
  { key: 'graduation', label: 'Graduation Cert', desc: 'Official graduation', icon: GraduationCap, color: 'text-cyan-600', bg: 'bg-cyan-100', estimatedTime: '~12 sec' },
];

const TYPE_COLOR: Record<DocumentType, string> = {
  receipt: 'bg-emerald-100 text-emerald-700',
  certificate: 'bg-blue-100 text-blue-700',
  transcript: 'bg-purple-100 text-purple-700',
  enrollment: 'bg-amber-100 text-amber-700',
  graduation: 'bg-cyan-100 text-cyan-700',
  lesson_plan: 'bg-slate-100 text-slate-600',
};

function GenerateModal({ students, onClose, onGenerated }: { students: Student[]; onClose: () => void; onGenerated: () => void }) {
  const { t } = useI18n();
  const [step, setStep] = useState<'pick-type' | 'pick-student' | 'options' | 'generating' | 'done'>('pick-type');
  const [selectedType, setSelectedType] = useState<DocTypeConfig | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [sendEmail, setSendEmail] = useState(true);
  const [search, setSearch] = useState('');

  const filteredStudents = students.filter(s => {
    const q = search.toLowerCase();
    return !q || `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) || s.studentId.includes(q);
  });

  const handleGenerate = async () => {
    setStep('generating');
    try {
      const typeMap: Record<DocumentType, string> = {
        receipt: 'Tuition Receipt T1/2026',
        certificate: 'Student Certificate 2026',
        transcript: 'Grade Transcript 2025',
        enrollment: 'Enrollment Verification Letter',
        graduation: 'Graduation Certificate 2026',
        lesson_plan: 'Lesson Plan',
      };
      for (const studentId of selectedStudents) {
        const student = students.find(s => s.id === studentId);
        if (!student) continue;
        await createDocument({
          studentId,
          type: selectedType!.key,
          title: typeMap[selectedType!.key],
          generatedBy: 'Wanchai Sukreep',
          status: sendEmail ? 'sent' : 'generated',
          sentTo: sendEmail ? student.parentEmail : undefined,
        });
        // Generate real PDF + auto-download
        const payments = await fetchStudentPayments(studentId);
        await generateAndDownload(selectedType!.key, student, payments);
      }
      setStep('done');
      onGenerated();
    } catch (e) {
      console.error(e);
      setStep('options');
    }
  };

  const toggleStudent = (id: string) => setSelectedStudents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl" style={{ maxHeight: '85vh' }}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{t('doc.modal.title')}</h2>
            <div className="mt-1 flex items-center gap-2">
              {['pick-type', 'pick-student', 'options'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={clsx('flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                    step === s || (step === 'generating' && i < 3) || step === 'done'
                      ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500')}>{i + 1}</div>
                  <span className="text-xs text-slate-500">{[t('doc.step.type'), t('doc.step.students'), t('doc.step.options')][i]}</span>
                  {i < 2 && <div className="h-px w-4 bg-slate-200" />}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 'pick-type' && (
            <div>
              <p className="mb-4 text-sm font-semibold text-slate-600">{t('doc.selectType')}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {DOC_TYPES.map(dt => {
                  const Icon = dt.icon;
                  return (
                    <button key={dt.key} onClick={() => { setSelectedType(dt); setStep('pick-student'); }}
                      className="flex flex-col items-start rounded-xl border-2 border-slate-100 bg-slate-50 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50">
                      <div className={clsx('mb-3 flex h-10 w-10 items-center justify-center rounded-xl', dt.bg)}>
                        <Icon size={20} className={dt.color} />
                      </div>
                      <p className="text-sm font-semibold text-slate-800">{t(`doc.type.${dt.key}`, dt.label)}</p>
                      <p className="mt-0.5 text-xs text-slate-500 leading-snug">{dt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'pick-student' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">{t('doc.selectStudents')}: <span className="text-blue-600">{selectedType ? t(`doc.type.${selectedType.key}`, selectedType.label) : ''}</span></p>
                <button onClick={() => setSelectedStudents(students.map(s => s.id))} className="text-xs text-blue-600 hover:underline">{t('doc.selectAll')}</button>
              </div>
              <div className="relative mb-3">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className="input pl-8 text-xs py-2" placeholder={t('common.search')} value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {filteredStudents.map(s => (
                  <label key={s.id} className={clsx('flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5',
                    selectedStudents.includes(s.id) ? 'border-blue-300 bg-blue-50' : 'border-slate-100 bg-white hover:bg-slate-50')}>
                    <input type="checkbox" className="h-4 w-4 rounded accent-blue-600" checked={selectedStudents.includes(s.id)} onChange={() => toggleStudent(s.id)} />
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{s.firstName} {s.lastName}</p>
                      <p className="text-xs text-slate-400">{s.classroom} · {s.studentId}</p>
                    </div>
                  </label>
                ))}
              </div>
              {selectedStudents.length > 0 && (
                <div className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
                  {selectedStudents.length} {t('doc.step.students')} {t('doc.selected')}
                </div>
              )}
            </div>
          )}

          {step === 'options' && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-600">{t('doc.options')}</p>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">{t('doc.summary')}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">{t('doc.step.type')}</span><span className="font-medium">{selectedType ? t(`doc.type.${selectedType.key}`, selectedType.label) : ''}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">{t('doc.step.students')}</span><span className="font-medium">{selectedStudents.length}</span></div>
                </div>
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 bg-white p-4">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded accent-blue-600" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)} />
                <div>
                  <p className="text-sm font-semibold text-slate-700">{t('doc.autoEmail')}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t('doc.autoEmailDesc')}</p>
                </div>
              </label>
            </div>
          )}

          {step === 'generating' && (
            <div className="flex flex-col items-center py-12">
              <Loader2 size={36} className="animate-spin text-blue-600" />
              <h3 className="mt-4 text-lg font-bold text-slate-800">{t('doc.generating')}</h3>
              <p className="mt-2 text-sm text-slate-500">{selectedStudents.length} {t('doc.step.students')}</p>
            </div>
          )}

          {step === 'done' && (
            <div className="flex flex-col items-center py-12">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 size={40} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">{t('doc.docsReady')}</h3>
              <p className="mt-2 text-sm text-slate-500">{selectedStudents.length} {t('doc.step.students')}</p>
              <button onClick={onClose} className="mt-6 btn-primary">{t('common.done')}</button>
            </div>
          )}
        </div>

        {step !== 'generating' && step !== 'done' && (
          <div className="flex justify-between border-t border-slate-100 px-6 py-4">
            <button onClick={() => {
              if (step === 'pick-type') onClose();
              else if (step === 'pick-student') setStep('pick-type');
              else if (step === 'options') setStep('pick-student');
            }} className="btn-secondary text-sm">
              {step === 'pick-type' ? t('common.cancel') : `← ${t('common.back')}`}
            </button>
            <button disabled={step === 'pick-student' && selectedStudents.length === 0}
              onClick={() => {
                if (step === 'pick-student') setStep('options');
                else if (step === 'options') handleGenerate();
              }} className="btn-primary text-sm disabled:opacity-40">
              {step === 'pick-student' ? `${t('common.next')} →` : t('doc.generateNow')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const { t } = useI18n();
  const [students, setStudents] = useState<Student[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');
  const [showModal, setShowModal] = useState(false);

  async function reload() {
    const [s, d] = await Promise.all([fetchStudents(), fetchDocuments()]);
    setStudents(s); setDocuments(d); setLoading(false);
  }

  useEffect(() => { reload(); }, []);

  const filtered = documents.filter(d => {
    const student = students.find(s => s.id === d.studentId);
    const q = search.toLowerCase();
    const matchSearch = !q || d.title.toLowerCase().includes(q) || `${student?.firstName} ${student?.lastName}`.toLowerCase().includes(q);
    const matchType = typeFilter === 'all' || d.type === typeFilter;
    return matchSearch && matchType;
  });

  const docTypeCounts: Record<string, number> = {};
  documents.forEach(d => { docTypeCounts[d.type] = (docTypeCounts[d.type] ?? 0) + 1; });

  if (loading) {
    return (
      <DashboardLayout pageTitle={t('page.documents')}>
        <div className="flex flex-col items-center py-32">
          <Loader2 size={36} className="animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-slate-500">{t('common.loading')}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle={t('page.documents')}>
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="section-title">{t('doc.quickGenerate')}</h2>
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm">
            <Plus size={16} /> {t('doc.customGenerate')}
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {DOC_TYPES.map(dt => {
            const Icon = dt.icon;
            return (
              <button key={dt.key} onClick={() => setShowModal(true)} className="card card-hover flex flex-col items-start p-4 text-left">
                <div className={clsx('mb-3 flex h-10 w-10 items-center justify-center rounded-xl', dt.bg)}>
                  <Icon size={20} className={dt.color} />
                </div>
                <p className="text-sm font-semibold text-slate-800 leading-tight">{t(`doc.type.${dt.key}`, dt.label)}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">{docTypeCounts[dt.key] ?? 0} {t('doc.generated')}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600">
                  {t('sp.generate')} <ChevronDown size={12} className="rotate-[-90deg]" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="section-title">{t('doc.history')}</h2>
              <p className="section-subtitle">{t('doc.historySub')}</p>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input pl-8 text-xs py-2" placeholder={t('common.search')} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(['all', ...DOC_TYPES.map(d => d.key)] as const).map(type => (
              <button key={type} onClick={() => setTypeFilter(type)}
                className={clsx('rounded-full px-3 py-1 text-xs font-medium transition',
                  typeFilter === type ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}>
                {type === 'all' ? t('doc.allTypes') : t(`doc.type.${type}`, type.replace('_', ' '))}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="table-head">
              <tr>
                <th className="th">{t('doc.col.document')}</th><th className="th">{t('st.col.student')}</th>
                <th className="th">{t('doc.col.type')}</th><th className="th">{t('doc.col.generatedAt')}</th>
                <th className="th">{t('doc.col.by')}</th><th className="th">{t('common.status')}</th><th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => {
                const student = students.find(s => s.id === doc.studentId);
                return (
                  <tr key={doc.id} className="tr-hover">
                    <td className="td">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                          <FileText size={14} className="text-blue-500" />
                        </div>
                        <p className="font-medium text-slate-800 text-sm">{doc.title}</p>
                      </div>
                    </td>
                    <td className="td">
                      <p className="text-sm text-slate-700">{student?.firstName} {student?.lastName}</p>
                      <p className="text-xs text-slate-400">{student?.classroom}</p>
                    </td>
                    <td className="td">
                      <span className={clsx('rounded-full px-2.5 py-0.5 text-xs font-semibold', TYPE_COLOR[doc.type])}>
                        {t(`doc.type.${doc.type}`, doc.type.replace('_', ' '))}
                      </span>
                    </td>
                    <td className="td text-xs text-slate-500">{formatDateTime(doc.generatedAt)}</td>
                    <td className="td text-xs text-slate-600">{doc.generatedBy}</td>
                    <td className="td">
                      <div className="flex items-center gap-1.5">
                        {doc.status === 'sent' && <Send size={12} className="text-emerald-500" />}
                        {doc.status === 'downloaded' && <Download size={12} className="text-blue-500" />}
                        {doc.status === 'generated' && <Clock size={12} className="text-slate-400" />}
                        <span className="text-xs capitalize text-slate-600">{doc.status}</span>
                      </div>
                    </td>
                    <td className="td">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={async () => {
                            if (!student) return;
                            const pays = await fetchStudentPayments(student.id);
                            previewPdf(doc.type, student, pays);
                          }}
                          className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:text-blue-600" title="Preview"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={async () => {
                            if (!student) return;
                            const pays = await fetchStudentPayments(student.id);
                            generateAndDownload(doc.type, student, pays);
                          }}
                          className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:text-emerald-600" title="Download"
                        >
                          <Download size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-sm text-slate-400">
                    <FileText size={32} className="mx-auto mb-2 text-slate-200" />
                    {t('doc.noDocs')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <GenerateModal students={students} onClose={() => setShowModal(false)} onGenerated={reload} />}
    </DashboardLayout>
  );
}
