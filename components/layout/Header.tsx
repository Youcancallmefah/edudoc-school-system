'use client';

import { useState } from 'react';
import { Bell, Menu, ChevronDown, LogOut, User, Settings, Languages } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n';
import { NOTIFICATIONS } from '@/lib/mock-data';
import { clsx } from 'clsx';

const ROLE_COLORS: Record<string, string> = {
  admin:        'bg-purple-100 text-purple-700',
  registration: 'bg-blue-100 text-blue-700',
  finance:      'bg-emerald-100 text-emerald-700',
  teacher:      'bg-amber-100 text-amber-700',
  parent:       'bg-cyan-100 text-cyan-700',
};


interface HeaderProps {
  onMobileMenuOpen: () => void;
  pageTitle?: string;
}

export default function Header({ onMobileMenuOpen, pageTitle }: HeaderProps) {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useI18n();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  const roleLabel = (role: string) => t(`role.${role}`, role);

  const notifIconColor: Record<string, string> = {
    payment:      'bg-amber-100 text-amber-600',
    document:     'bg-blue-100 text-blue-600',
    system:       'bg-slate-100 text-slate-600',
    announcement: 'bg-emerald-100 text-emerald-600',
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 md:hidden"
        >
          <Menu size={22} />
        </button>
        {pageTitle && (
          <h1 className="text-base font-semibold text-slate-800 md:text-lg">{pageTitle}</h1>
        )}
      </div>

      {/* Right: lang + notifs + user */}
      <div className="flex items-center gap-2">
        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === 'en' ? 'th' : 'en')}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          title={lang === 'en' ? 'เปลี่ยนเป็นภาษาไทย' : 'Switch to English'}
        >
          <Languages size={14} className="text-blue-600" />
          <span className="hidden sm:inline">{lang === 'en' ? 'EN' : 'TH'}</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">{lang === 'en' ? 'ไทย' : 'ENG'}</span>
        </button>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(v => !v); setShowUserMenu(false); }}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 z-20 mt-1 w-80 rounded-xl border border-slate-200 bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">{t('common.notifications')}</p>
                  {unread > 0 && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                      {unread} {t('common.new')}
                    </span>
                  )}
                </div>
                <ul className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {NOTIFICATIONS.slice(0, 6).map(n => (
                    <li key={n.id} className={clsx('flex gap-3 px-4 py-3 hover:bg-slate-50', !n.read && 'bg-blue-50/40')}>
                      <div className={clsx('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold', notifIconColor[n.type])}>
                        {n.type === 'payment' ? '₿' : n.type === 'document' ? '📄' : n.type === 'system' ? '⚙' : '📢'}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                        <p className="mt-0.5 text-xs leading-snug text-slate-500">{n.message}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-slate-100 px-4 py-2">
                  <button className="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-700">
                    {t('common.viewAll')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => { setShowUserMenu(v => !v); setShowNotifications(false); }}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {user?.avatarInitials ?? 'U'}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-none">{user?.name ?? 'User'}</p>
              <p className="mt-0.5 text-[10px] text-slate-500">{roleLabel(user?.role ?? 'admin')}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 z-20 mt-1 w-52 rounded-xl border border-slate-200 bg-white shadow-lg">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                  <span className={clsx('mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold', ROLE_COLORS[user?.role ?? 'admin'])}>
                    {roleLabel(user?.role ?? 'admin')}
                  </span>
                </div>
                <ul className="p-1">
                  <li>
                    <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                      <User size={15} /> {t('common.profile')}
                    </button>
                  </li>
                  <li>
                    <Link href="/settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                      <Settings size={15} /> {t('nav.settings')}
                    </Link>
                  </li>
                  <li className="mt-1 border-t border-slate-100 pt-1">
                    <button
                      onClick={() => { void logout(); }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={15} /> {t('common.signOut')}
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
