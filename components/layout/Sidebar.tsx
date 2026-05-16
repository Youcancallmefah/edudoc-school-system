'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, CreditCard, FileText, GraduationCap,
  Home, Settings, ChevronLeft, ChevronRight, BookOpen, X,
  School,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useI18n } from '@/lib/i18n';
import type { Role } from '@/lib/types';

interface NavItem {
  labelKey: string;
  href: string;
  icon: React.ElementType;
  roles: Role[];
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav.dashboard', href: '/dashboard',      icon: LayoutDashboard, roles: ['admin', 'registration', 'finance', 'teacher'] },
  { labelKey: 'nav.students',  href: '/students',       icon: Users,           roles: ['admin', 'registration', 'teacher'] },
  { labelKey: 'nav.finance',   href: '/finance',        icon: CreditCard,      roles: ['admin', 'finance'] },
  { labelKey: 'nav.documents', href: '/documents',      icon: FileText,        roles: ['admin', 'registration', 'finance', 'teacher'] },
  { labelKey: 'nav.teachers',  href: '/teachers',       icon: BookOpen,        roles: ['admin', 'teacher'] },
  { labelKey: 'nav.parent',    href: '/parent-portal',  icon: Home,            roles: ['admin', 'parent'] },
  { labelKey: 'nav.settings',  href: '/settings',       icon: Settings,        roles: ['admin'] },
];

interface SidebarProps {
  role: Role;
  collapsed: boolean;
  mobileOpen: boolean;
  onCollapse: (v: boolean) => void;
  onMobileClose: () => void;
}

export default function Sidebar({ role, collapsed, mobileOpen, onCollapse, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const items = NAV_ITEMS.filter(i => i.roles.includes(role));

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = pathname === item.href || pathname.startsWith(item.href + '/');
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        onClick={onMobileClose}
        className={clsx(
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
          active
            ? 'bg-white/15 text-white shadow-sm'
            : 'text-blue-100 hover:bg-white/10 hover:text-white'
        )}
      >
        <Icon
          size={20}
          className={clsx('shrink-0 transition-colors', active ? 'text-white' : 'text-blue-200 group-hover:text-white')}
        />
        {!collapsed && (
          <span className="truncate">{t(item.labelKey)}</span>
        )}
        {!collapsed && item.badge && (
          <span className="ml-auto rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-gradient-to-b from-blue-900 to-blue-800">
      {/* Logo */}
      <div className={clsx('flex items-center border-b border-white/10 px-4 py-5', collapsed ? 'justify-center' : 'gap-3')}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-inner">
          <School size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold leading-none text-white">EduDoc</p>
            <p className="mt-0.5 text-[10px] text-blue-200">{t('brand.school')}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-blue-300">
            {t('nav.mainMenu')}
          </p>
        )}
        <ul className="space-y-1">
          {items.map(item => (
            <li key={item.href}>
              <NavLink item={item} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse toggle — desktop only */}
      <div className="hidden border-t border-white/10 p-3 md:block">
        <button
          onClick={() => onCollapse(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs text-blue-200 transition hover:bg-white/10 hover:text-white"
        >
          {collapsed ? <ChevronRight size={16} /> : (
            <>
              <ChevronLeft size={16} />
              <span>{t('nav.collapse')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={clsx(
          'hidden md:flex flex-col shrink-0 transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <aside className="relative z-50 flex w-64 flex-col animate-slide-in">
            {sidebarContent}
            <button
              onClick={onMobileClose}
              className="absolute right-3 top-4 rounded-lg p-1 text-white/70 hover:text-white"
            >
              <X size={18} />
            </button>
          </aside>
        </div>
      )}
    </>
  );
}
