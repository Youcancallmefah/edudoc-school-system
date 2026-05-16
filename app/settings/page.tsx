'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Settings, School, Mail, Bell, Shield, Palette, Database,
  Save, ChevronRight, Check, Globe, Phone, Clock, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useI18n } from '@/lib/i18n';

type Tab = 'school' | 'email' | 'notifications' | 'security' | 'appearance' | 'system';

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'school',        label: 'School Profile',  icon: School },
  { key: 'email',         label: 'Email & Comms',   icon: Mail },
  { key: 'notifications', label: 'Notifications',   icon: Bell },
  { key: 'security',      label: 'Security',        icon: Shield },
  { key: 'appearance',    label: 'Appearance',      icon: Palette },
  { key: 'system',        label: 'System',          icon: Database },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={clsx('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', checked ? 'bg-blue-600' : 'bg-slate-200')}
    >
      <span className={clsx('inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform', checked ? 'translate-x-6' : 'translate-x-1')} />
    </button>
  );
}

function SaveBanner() {
  return (
    <div className="fixed bottom-6 right-6 z-20 flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-3 text-white shadow-xl">
      <p className="text-sm font-medium">You have unsaved changes</p>
      <button className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition">
        <Save size={13} /> Save
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<Tab>('school');
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const [school, setSchool] = useState({
    name: 'Bright Future Academy',
    shortName: 'BFA',
    address: '123 Education Rd, Bangkok 10110',
    phone: '02-123-4567',
    email: 'info@brightfuture.ac.th',
    website: 'www.brightfuture.ac.th',
    timezone: 'Asia/Bangkok',
    academicYear: '2026',
    currentTerm: '1',
  });

  const [notifications, setNotifications] = useState({
    paymentReminders: true,
    overdueAlerts: true,
    documentGenerated: true,
    newStudent: true,
    systemUpdates: false,
    parentMessages: true,
  });

  const [emailSettings, setEmailSettings] = useState({
    fromName: 'Bright Future Academy',
    fromEmail: 'noreply@brightfuture.ac.th',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    autoSendReceipts: true,
    autoSendDocuments: true,
    reminderDaysBefore: '7',
  });

  const handleSave = () => {
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const mark = () => setDirty(true);

  return (
    <DashboardLayout pageTitle={t('page.settings')}>
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar nav */}
        <aside className="lg:w-56 shrink-0">
          <div className="card p-2">
            <ul className="space-y-0.5">
              {TABS.map(tab => {
                const Icon = tab.icon;
                return (
                  <li key={tab.key}>
                    <button
                      onClick={() => setActiveTab(tab.key)}
                      className={clsx(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                        activeTab === tab.key
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      )}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* School Profile */}
          {activeTab === 'school' && (
            <div className="card p-6 space-y-6">
              <div>
                <h2 className="section-title">School Profile</h2>
                <p className="section-subtitle">Basic school information shown across the system</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label">School Name</label>
                  <input className="input" value={school.name}
                    onChange={e => { setSchool(p => ({ ...p, name: e.target.value })); mark(); }} />
                </div>
                <div>
                  <label className="label">Short Name / Abbreviation</label>
                  <input className="input" value={school.shortName}
                    onChange={e => { setSchool(p => ({ ...p, shortName: e.target.value })); mark(); }} />
                </div>
                <div>
                  <label className="label">Academic Year</label>
                  <input className="input" value={school.academicYear}
                    onChange={e => { setSchool(p => ({ ...p, academicYear: e.target.value })); mark(); }} />
                </div>
                <div>
                  <label className="label">Current Term</label>
                  <select className="input" value={school.currentTerm}
                    onChange={e => { setSchool(p => ({ ...p, currentTerm: e.target.value })); mark(); }}>
                    <option value="1">Term 1</option>
                    <option value="2">Term 2</option>
                    <option value="3">Term 3</option>
                  </select>
                </div>
                <div>
                  <label className="label">Timezone</label>
                  <select className="input" value={school.timezone}
                    onChange={e => { setSchool(p => ({ ...p, timezone: e.target.value })); mark(); }}>
                    <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                    <option value="America/New_York">America/New_York (GMT-5)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Address</label>
                  <textarea className="input resize-none" rows={2} value={school.address}
                    onChange={e => { setSchool(p => ({ ...p, address: e.target.value })); mark(); }} />
                </div>
                <div>
                  <label className="label">Contact Phone</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input className="input pl-8" value={school.phone}
                      onChange={e => { setSchool(p => ({ ...p, phone: e.target.value })); mark(); }} />
                  </div>
                </div>
                <div>
                  <label className="label">Contact Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input className="input pl-8" value={school.email}
                      onChange={e => { setSchool(p => ({ ...p, email: e.target.value })); mark(); }} />
                  </div>
                </div>
                <div>
                  <label className="label">Website</label>
                  <div className="relative">
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input className="input pl-8" value={school.website}
                      onChange={e => { setSchool(p => ({ ...p, website: e.target.value })); mark(); }} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={handleSave} className="btn-primary gap-2">
                  {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
                </button>
              </div>
            </div>
          )}

          {/* Email */}
          {activeTab === 'email' && (
            <div className="card p-6 space-y-6">
              <div>
                <h2 className="section-title">Email & Communication</h2>
                <p className="section-subtitle">Configure outgoing email settings</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Sender Name</label>
                  <input className="input" value={emailSettings.fromName}
                    onChange={e => { setEmailSettings(p => ({ ...p, fromName: e.target.value })); mark(); }} />
                </div>
                <div>
                  <label className="label">Sender Email</label>
                  <input className="input" value={emailSettings.fromEmail}
                    onChange={e => { setEmailSettings(p => ({ ...p, fromEmail: e.target.value })); mark(); }} />
                </div>
                <div>
                  <label className="label">SMTP Host</label>
                  <input className="input font-mono" value={emailSettings.smtpHost}
                    onChange={e => { setEmailSettings(p => ({ ...p, smtpHost: e.target.value })); mark(); }} />
                </div>
                <div>
                  <label className="label">SMTP Port</label>
                  <input className="input font-mono" value={emailSettings.smtpPort}
                    onChange={e => { setEmailSettings(p => ({ ...p, smtpPort: e.target.value })); mark(); }} />
                </div>
                <div>
                  <label className="label">Reminder (days before due)</label>
                  <input type="number" className="input" value={emailSettings.reminderDaysBefore}
                    onChange={e => { setEmailSettings(p => ({ ...p, reminderDaysBefore: e.target.value })); mark(); }} />
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 divide-y divide-slate-100">
                {[
                  { key: 'autoSendReceipts', label: 'Auto-send receipts to parents', desc: 'Email tuition receipts immediately after payment is recorded' },
                  { key: 'autoSendDocuments', label: 'Auto-send generated documents', desc: 'Email documents to parents when generated' },
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between p-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle
                      checked={emailSettings[item.key as keyof typeof emailSettings] as boolean}
                      onChange={v => { setEmailSettings(p => ({ ...p, [item.key]: v })); mark(); }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button className="btn-secondary">Test Email</button>
                <button onClick={handleSave} className="btn-primary gap-2">
                  {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
                </button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="card p-6 space-y-5">
              <div>
                <h2 className="section-title">Notification Settings</h2>
                <p className="section-subtitle">Choose which events trigger notifications</p>
              </div>

              <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                {[
                  { key: 'paymentReminders',  label: 'Payment Reminders',      desc: 'Notify staff 7 days before payment due dates' },
                  { key: 'overdueAlerts',     label: 'Overdue Payment Alerts',  desc: 'Alert when a payment becomes overdue' },
                  { key: 'documentGenerated', label: 'Document Generated',      desc: 'Notify when a document is generated' },
                  { key: 'newStudent',        label: 'New Student Registered',  desc: 'Alert when a new student is added' },
                  { key: 'systemUpdates',     label: 'System Updates',          desc: 'EduDoc version updates and announcements' },
                  { key: 'parentMessages',    label: 'Parent Messages',         desc: 'Notify when a parent sends a message' },
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between p-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={v => { setNotifications(p => ({ ...p, [item.key]: v })); mark(); }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button onClick={handleSave} className="btn-primary gap-2">
                  {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
                </button>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="card p-6 space-y-5">
              <div>
                <h2 className="section-title">Security Settings</h2>
                <p className="section-subtitle">Manage access controls and authentication</p>
              </div>

              <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                {[
                  { label: 'Two-Factor Authentication', desc: 'Require 2FA for admin and finance accounts', on: true },
                  { label: 'Session Timeout',           desc: 'Auto logout after 2 hours of inactivity',   on: true },
                  { label: 'Login Attempt Limit',       desc: 'Lock account after 5 failed login attempts', on: true },
                  { label: 'Audit Log',                 desc: 'Record all system actions for compliance',   on: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between p-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle checked={item.on} onChange={mark} />
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm font-semibold text-amber-800">Change Admin Password</p>
                <p className="text-xs text-amber-600 mt-0.5">Last changed: 90 days ago. Recommended every 60 days.</p>
                <button className="mt-3 btn-secondary text-xs py-2">Change Password</button>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div className="card p-6 space-y-6">
              <div>
                <h2 className="section-title">Appearance</h2>
                <p className="section-subtitle">Customize the look of the admin interface</p>
              </div>

              <div>
                <p className="label mb-3">Theme Color</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: 'Ocean Blue', color: 'bg-blue-600', active: true },
                    { name: 'Forest',     color: 'bg-emerald-600', active: false },
                    { name: 'Violet',     color: 'bg-violet-600', active: false },
                    { name: 'Amber',      color: 'bg-amber-500', active: false },
                    { name: 'Slate',      color: 'bg-slate-700', active: false },
                  ].map(theme => (
                    <button key={theme.name} onClick={mark}
                      className={clsx('flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition', theme.active ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300')}>
                      <div className={clsx('h-8 w-8 rounded-lg', theme.color)} />
                      <span className="text-xs font-medium text-slate-600">{theme.name}</span>
                      {theme.active && <Check size={12} className="text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="label mb-3">Sidebar Style</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: 'Dark (default)',  desc: 'Dark blue gradient sidebar', active: true },
                    { label: 'Light',           desc: 'Clean white sidebar',         active: false },
                  ].map((opt, i) => (
                    <label key={i} className={clsx('flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4', opt.active ? 'border-blue-400 bg-blue-50' : 'border-slate-100')}>
                      <input type="radio" name="sidebar" className="mt-0.5 accent-blue-600" defaultChecked={opt.active} onChange={mark} />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
                        <p className="text-xs text-slate-500">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* System */}
          {activeTab === 'system' && (
            <div className="card p-6 space-y-5">
              <div>
                <h2 className="section-title">System Information</h2>
                <p className="section-subtitle">EduDoc platform details</p>
              </div>

              <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 text-sm">
                {[
                  { label: 'EduDoc Version',       value: '2.4.1' },
                  { label: 'Next.js Version',       value: '14.2.5' },
                  { label: 'Database',              value: 'Supabase (PostgreSQL)' },
                  { label: 'Storage',               value: 'Supabase Storage + Bucket CDN' },
                  { label: 'Email Provider',        value: 'Supabase Edge Functions + SMTP' },
                  { label: 'PDF Engine',            value: 'PDFKit / React-PDF' },
                  { label: 'Auth Provider',         value: 'Supabase Auth' },
                  { label: 'Last System Update',    value: '16 May 2026' },
                  { label: 'Data Backup',           value: 'Daily at 02:00 (GMT+7)' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between px-4 py-3">
                    <span className="text-slate-500">{row.label}</span>
                    <span className="font-mono font-medium text-slate-800 text-xs">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="btn-secondary text-xs py-2 px-4">Export Data</button>
                <button className="btn-secondary text-xs py-2 px-4">Clear Cache</button>
                <button className="btn-danger text-xs py-2 px-4 ml-auto">Reset Demo Data</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {dirty && <SaveBanner />}
    </DashboardLayout>
  );
}
