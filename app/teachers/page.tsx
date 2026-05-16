'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  BookOpen, Plus, Search, Download, Mail, Phone,
  Users, GraduationCap, FileText, ChevronRight, X,
  Eye, Edit2, Calendar, Loader2,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fetchTeachers, fetchStudents } from '@/lib/supabase-queries';
import type { Teacher, Student } from '@/lib/types';
import { clsx } from 'clsx';

const LESSON_TEMPLATES = [
  { id: 'lt1', name: 'Daily Lesson Plan', desc: 'Standard daily teaching plan', pages: 2 },
  { id: 'lt2', name: 'Unit Plan Overview', desc: 'Multi-week unit plan', pages: 4 },
  { id: 'lt3', name: 'Activity Worksheet', desc: 'Student activity sheet', pages: 1 },
  { id: 'lt4', name: 'Parent Communication', desc: 'Formal note to parents', pages: 1 },
  { id: 'lt5', name: 'Field Trip Permission', desc: 'Permission slip', pages: 1 },
  { id: 'lt6', name: 'Class Roster', desc: 'Printable student list', pages: 1 },
];

function TeacherCard({ teacher, studentsCount }: { teacher: Teacher; studentsCount: number }) {
  const { t } = useI18n();
  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-sm font-black text-white shadow-sm">
            {teacher.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <p className="font-bold text-slate-800">{teacher.name}</p>
            <p className="text-xs text-slate-500">{teacher.subject}</p>
          </div>
        </div>
        <span className={clsx('rounded-full px-2.5 py-1 text-[10px] font-semibold', {
          'bg-emerald-100 text-emerald-700': teacher.status === 'active',
          'bg-amber-100 text-amber-700': teacher.status === 'on_leave',
        })}>{teacher.status === 'on_leave' ? t('tc.onLeave') : t('tc.active')}</span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-blue-50 p-2.5 text-center">
          <p className="text-lg font-black text-blue-700">{studentsCount || teacher.studentsCount}</p>
          <p className="text-[10px] text-slate-500">{t('tc.studentsLabel')}</p>
        </div>
        <div className="rounded-lg bg-purple-50 p-2.5 text-center">
          <p className="text-lg font-black text-purple-700">{teacher.classroom}</p>
          <p className="text-[10px] text-slate-500">{t('tc.classroomLabel')}</p>
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Mail size={12} className="shrink-0 text-slate-400" />
          <a href={`mailto:${teacher.email}`} className="text-blue-600 hover:underline truncate">{teacher.email}</a>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={12} className="shrink-0 text-slate-400" />
          <span>{teacher.phone}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 btn-secondary text-xs py-2 justify-center"><Mail size={13} /> {t('common.email')}</button>
        <button className="flex-1 btn-secondary text-xs py-2 justify-center"><Edit2 size={13} /> {t('common.edit')}</button>
      </div>
    </div>
  );
}

function LessonPlanModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('K1');
  const [date, setDate] = useState('');
  const [generated, setGenerated] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-800">Create Teaching Document</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>

        {!generated ? (
          <>
            <div className="p-6 space-y-5">
              <div>
                <p className="label">Select Template</p>
                <div className="grid gap-2">
                  {LESSON_TEMPLATES.map(t => (
                    <label key={t.id} className={clsx('flex cursor-pointer items-start gap-3 rounded-xl border p-3',
                      selected === t.id ? 'border-blue-300 bg-blue-50' : 'border-slate-100 hover:bg-slate-50')}>
                      <input type="radio" name="template" className="mt-0.5 accent-blue-600"
                        checked={selected === t.id} onChange={() => setSelected(t.id)} />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                        <p className="text-xs text-slate-500">{t.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="label">Subject</label>
                  <input className="input text-sm" placeholder="Thai" value={subject} onChange={e => setSubject(e.target.value)} />
                </div>
                <div>
                  <label className="label">Grade</label>
                  <select className="input text-sm" value={grade} onChange={e => setGrade(e.target.value)}>
                    {['K1','K2','K3','G1','G2','G3','G4','G5','G6'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Date</label>
                  <input type="date" className="input text-sm" value={date} onChange={e => setDate(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
              <button onClick={onClose} className="btn-secondary text-sm">Cancel</button>
              <button disabled={!selected} onClick={() => setGenerated(true)} className="btn-primary text-sm disabled:opacity-40">
                <FileText size={15} /> Generate PDF
              </button>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-emerald-100">
              <FileText size={32} className="text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Document Ready!</h3>
            <div className="mt-5 flex justify-center gap-3">
              <button className="btn-secondary gap-2"><Eye size={14} /> Preview</button>
              <button className="btn-primary gap-2"><Download size={14} /> Download PDF</button>
            </div>
            <button onClick={onClose} className="mt-3 text-xs text-slate-400">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeachersPage() {
  const { t } = useI18n();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'staff' | 'workspace'>('staff');

  useEffect(() => {
    Promise.all([fetchTeachers(), fetchStudents()]).then(([t, s]) => {
      setTeachers(t); setStudents(s); setLoading(false);
    });
  }, []);

  const grades = ['All', 'K1', 'K2', 'K3', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6'];

  const filtered = teachers.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.classroom.toLowerCase().includes(q);
    const matchGrade = gradeFilter === 'All' || t.grade === gradeFilter;
    return matchSearch && matchGrade;
  });

  const activeCount = teachers.filter(t => t.status === 'active').length;

  if (loading) {
    return (
      <DashboardLayout pageTitle={t('page.teachers')}>
        <div className="flex flex-col items-center py-32">
          <Loader2 size={36} className="animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-slate-500">{t('common.loading')}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle={t('page.teachers')}>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-4 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
            <GraduationCap size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{teachers.length}</p>
            <p className="text-xs text-slate-500">{t('tc.totalStaff')}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
            <Users size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{activeCount}</p>
            <p className="text-xs text-slate-500">{t('tc.active')} · {teachers.length - activeCount} {t('tc.onLeave').toLowerCase()}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
            <BookOpen size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{Array.from(new Set(teachers.map(tc => tc.classroom))).length}</p>
            <p className="text-xs text-slate-500">{t('tc.classrooms')}</p>
          </div>
        </div>
      </div>

      <div className="mb-5 flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 w-fit">
        {(['staff', 'workspace'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={clsx('rounded-lg px-5 py-2 text-sm font-semibold',
              activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500')}>
            {tab === 'staff' ? t('tc.staffTab') : t('tc.workspaceTab')}
          </button>
        ))}
      </div>

      {activeTab === 'staff' && (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className="input pl-8 text-xs py-2" placeholder={t('tc.search')} value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5 flex-wrap">
                {grades.map(g => (
                  <button key={g} onClick={() => setGradeFilter(g)}
                    className={clsx('rounded-md px-2.5 py-1 text-xs font-medium',
                      gradeFilter === g ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100')}>{g}</button>
                ))}
              </div>
            </div>
            <button className="btn-primary text-xs py-2 px-4"><Plus size={14} /> {t('tc.addTeacher')}</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(t => (
              <TeacherCard key={t.id} teacher={t}
                studentsCount={students.filter(s => s.classroom === t.classroom).length} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-16 text-center text-sm text-slate-400">
                <GraduationCap size={32} className="mx-auto mb-2 text-slate-200" />
                {t('tc.noTeachers')}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'workspace' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="section-title">{t('tc.templatesTitle')}</h2>
                <p className="section-subtitle">{t('tc.templatesSub')}</p>
              </div>
              <button onClick={() => setShowPlanModal(true)} className="btn-primary text-xs py-2 px-3">
                <Plus size={14} /> {t('tc.create')}
              </button>
            </div>
            <div className="space-y-2.5">
              {LESSON_TEMPLATES.map(t => (
                <div key={t.id} onClick={() => setShowPlanModal(true)}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 hover:bg-slate-100 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                      <FileText size={15} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-slate-400" />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="section-title mb-4">{t('tc.todaySchedule')}</h2>
            <div className="space-y-2">
              {[
                { time: '08:00', subj: 'Thai Language', done: true },
                { time: '09:00', subj: 'Mathematics', done: true },
                { time: '10:20', subj: 'Arts & Crafts', done: false },
                { time: '11:10', subj: 'English', done: false },
              ].map((item, i) => (
                <div key={i} className={clsx('flex items-center gap-3 rounded-lg px-3 py-2',
                  item.done ? 'bg-slate-50' : 'bg-blue-50 border border-blue-100')}>
                  <span className="font-mono text-xs text-slate-400 w-10">{item.time}</span>
                  <p className={clsx('flex-1 text-sm font-medium', item.done ? 'text-slate-500 line-through' : 'text-slate-800')}>{item.subj}</p>
                  {!item.done && <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showPlanModal && <LessonPlanModal onClose={() => setShowPlanModal(false)} />}
    </DashboardLayout>
  );
}
