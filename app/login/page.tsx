'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { School, Eye, EyeOff, Loader2, ShieldCheck, BookOpen, Calculator, Users, Home } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n';
import type { Role } from '@/lib/types';
import { Copy, KeyRound } from 'lucide-react';
import { clsx } from 'clsx';

interface DemoRole {
  role: Role;
  label: string;
  email: string;
  color: string;
  bg: string;
  icon: React.ElementType;
  desc: string;
}

const DEMO_ROLES: DemoRole[] = [
  { role: 'admin',        label: 'Admin / IT',     email: 'admin@brightfuture.ac.th',    color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200 hover:bg-purple-100',   icon: ShieldCheck, desc: 'Full system access' },
  { role: 'registration', label: 'Registration',   email: 'register@brightfuture.ac.th', color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100',         icon: Users,       desc: 'Student records & documents' },
  { role: 'finance',      label: 'Finance',        email: 'finance@brightfuture.ac.th',  color: 'text-emerald-700',bg: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100', icon: Calculator,  desc: 'Payments & receipts' },
  { role: 'teacher',      label: 'Teacher',        email: 'teacher@brightfuture.ac.th',  color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200 hover:bg-amber-100',       icon: BookOpen,    desc: 'Class & lesson tools' },
  { role: 'parent',       label: 'Parent',         email: 'parent@brightfuture.ac.th',   color: 'text-cyan-700',   bg: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100',         icon: Home,        desc: 'Child info & payments' },
];

export default function LoginPage() {
  const { login, loginDemo, user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  const homeForRole = (role?: string) => role === 'parent' ? '/parent-portal' : '/dashboard';
  const [email, setEmail] = useState('admin@brightfuture.ac.th');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [showCredentials, setShowCredentials] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState('');

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEmail(text);
      setTimeout(() => setCopiedEmail(''), 1500);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    if (user) router.replace(homeForRole(user.role));
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      // user state will update via auth context; pick redirect based on email
      const role = email.toLowerCase().startsWith('parent') ? 'parent' : undefined;
      router.replace(homeForRole(role));
    } else {
      setError(t('login.invalid'));
    }
  };

  const handleDemoLogin = async (demo: DemoRole) => {
    setSelectedRole(demo.role);
    setEmail(demo.email);
    setPassword('demo1234');
    setError('');
    setLoading(true);
    const ok = await loginDemo(demo.role);
    setLoading(false);
    if (ok) router.replace(homeForRole(demo.role));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute top-1/2 -left-32 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-blue-600/30" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/5" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">

            {/* Left: Branding */}
            <div className="text-center lg:text-left">
              <div className="mb-6 flex justify-center lg:justify-start">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-sm">
                    <School size={28} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white tracking-tight">EduDoc</p>
                    <p className="text-xs font-medium text-blue-200">{t('brand.tagline')}</p>
                  </div>
                </div>
              </div>

              <h1 className="mb-4 text-3xl font-bold leading-tight text-white lg:text-4xl">
                {t('login.tagline1')}<br />
                <span className="text-blue-200">{t('login.tagline2')}</span>
              </h1>
              <p className="mb-8 text-sm leading-relaxed text-blue-100 lg:text-base">
                {t('login.intro')}
              </p>

              {/* Stats row */}
              <div className="flex justify-center gap-6 lg:justify-start">
                {[
                  { value: '179+', label: t('login.stats.students') },
                  { value: '47',   label: t('login.stats.docs') },
                  { value: '5',    label: t('login.stats.depts') },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-2xl font-black text-white">{s.value}</p>
                    <p className="text-xs text-blue-200">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Login card */}
            <div className="rounded-2xl bg-white p-6 shadow-2xl md:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">{t('login.signIn')}</h2>
                <p className="mt-1 text-sm text-slate-500">{t('brand.school')} — {t('login.year')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">{t('login.email')}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input"
                    placeholder={t('login.placeholderEmail')}
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label className="label">{t('login.password')}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="input pr-10"
                      placeholder={t('login.placeholderPwd')}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> {t('login.signingIn')}</>
                  ) : (
                    t('login.signIn')
                  )}
                </button>
              </form>

              {/* Credentials note toggle */}
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setShowCredentials(v => !v)}
                  className="flex w-full items-center justify-between rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2.5 text-left transition hover:bg-blue-50"
                >
                  <div className="flex items-center gap-2">
                    <KeyRound size={14} className="text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700">{t('login.credentialsTitle')}</span>
                  </div>
                  <span className="text-[10px] text-blue-500">{showCredentials ? '▲' : '▼'}</span>
                </button>

                {showCredentials && (
                  <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="mb-2 text-[10px] text-slate-500">{t('login.credentialsSub')}</p>
                    <ul className="space-y-1.5">
                      {DEMO_ROLES.map(demo => {
                        const Icon = demo.icon;
                        return (
                          <li key={demo.role} className="flex items-center justify-between gap-2 rounded-lg bg-white px-2.5 py-1.5 border border-slate-100">
                            <div className="flex items-center gap-2 min-w-0">
                              <Icon size={12} className={demo.color} />
                              <span className={clsx('text-[10px] font-bold w-16 shrink-0', demo.color)}>
                                {t(`role.${demo.role}`, demo.label)}
                              </span>
                              <span className="font-mono text-[10px] text-slate-600 truncate">{demo.email}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(demo.email)}
                              className="shrink-0 rounded p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                              title="Copy email"
                            >
                              {copiedEmail === demo.email ? (
                                <span className="text-[9px] font-bold text-emerald-600">✓</span>
                              ) : (
                                <Copy size={11} />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    <p className="mt-2 text-center text-[10px] text-slate-400">
                      {t('login.demoNote')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
