'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthUser, Role } from './types';
import { DEMO_USERS } from './mock-data';
import { supabase } from './supabase';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: Role) => Promise<boolean>;
  loginDemo: (role: Role) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = 'edudoc_user';

function inferRoleFromEmail(email: string): Role {
  const e = email.toLowerCase();
  if (e.startsWith('admin'))    return 'admin';
  if (e.startsWith('register')) return 'registration';
  if (e.startsWith('finance'))  return 'finance';
  if (e.startsWith('teacher'))  return 'teacher';
  if (e.startsWith('parent'))   return 'parent';
  return 'admin';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage + Supabase session
  useEffect(() => {
    async function init() {
      // 1) Try Supabase session first
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const sUser = data.session.user;
        const role = inferRoleFromEmail(sUser.email ?? '');
        const initials = (sUser.user_metadata?.name ?? sUser.email ?? 'U')
          .split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();
        const authUser: AuthUser = {
          id: sUser.id,
          name: sUser.user_metadata?.name ?? sUser.email?.split('@')[0] ?? 'User',
          email: sUser.email ?? '',
          role,
          avatarInitials: initials,
        };
        setUser(authUser);
      } else {
        // 2) Fallback to localStorage (for demo)
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setUser(JSON.parse(stored));
      }
      setIsLoading(false);
    }
    init();

    // Listen for auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (session?.user) {
        const role = inferRoleFromEmail(session.user.email ?? '');
        const initials = (session.user.user_metadata?.name ?? session.user.email ?? 'U')
          .split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name ?? session.user.email?.split('@')[0] ?? 'User',
          email: session.user.email ?? '',
          role,
          avatarInitials: initials,
        });
      }
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  // Real Supabase Auth login
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      // Fallback to demo login if email matches demo user
      const demo = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (demo) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
        setUser(demo);
        return true;
      }
      return false;
    }
    return true;
  }, []);

  // Demo button login (no password)
  const loginDemo = useCallback(async (role: Role): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 400));
    const demo = DEMO_USERS.find(u => u.role === role);
    if (!demo) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    setUser(demo);
    return true;
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } },
    });
    return !error;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginDemo, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
