import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseClientConfigured, supabase } from '../lib/supabase';
import { apiFetch } from '../lib/api';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  city_district: string;
  country: string;
  education_level: string;
  profession_role: string;
  organization: string;
  short_bio: string;
  preferred_language: 'Bangla' | 'English' | 'Bilingual';
  avatar_url: string;
  role: 'user' | 'admin';
  account_status: 'pending_verification' | 'active' | 'suspended' | 'deactivated';
  marketing_opt_in: boolean;
  created_at?: string;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  supabaseConfigured: boolean;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (params: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    preferredLanguage: 'Bangla' | 'English' | 'Bilingual';
    marketingOptIn: boolean;
  }) => Promise<{ error?: string; needsVerification?: boolean }>;
  signOut: () => Promise<void>;
  resendVerification: (email: string) => Promise<{ error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(isSupabaseClientConfigured);

  const loadProfile = useCallback(async (activeSession: Session | null) => {
    if (!activeSession || !supabase) {
      setProfile(null);
      return;
    }

    try {
      const res = await apiFetch<{ profile: UserProfile }>('/api/learner/overview', {
        requireAuth: true,
      });
      if (res?.profile) {
        setProfile(res.profile);
        return;
      }
    } catch {
      // Fallback to direct RLS select on profiles if backend service key isn't set yet
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', activeSession.user.id)
      .maybeSingle();

    if (data) {
      setProfile(data as UserProfile);
    } else {
      setProfile({
        id: activeSession.user.id,
        email: activeSession.user.email || '',
        full_name: (activeSession.user.user_metadata?.full_name as string) || '',
        phone: (activeSession.user.user_metadata?.phone as string) || '',
        city_district: '',
        country: 'Bangladesh',
        education_level: '',
        profession_role: '',
        organization: '',
        short_bio: '',
        preferred_language:
          (activeSession.user.user_metadata?.preferred_language as 'Bangla' | 'English' | 'Bilingual') ||
          'Bilingual',
        avatar_url: '',
        role: 'user',
        account_status: activeSession.user.email_confirmed_at ? 'active' : 'pending_verification',
        marketing_opt_in: Boolean(activeSession.user.user_metadata?.marketing_opt_in),
      });
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    await loadProfile(data.session);
  }, [loadProfile]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      loadProfile(data.session).finally(() => {
        if (mounted) setLoading(false);
      });
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      loadProfile(nextSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: 'Supabase authentication is not configured yet.' };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { error: error.message };
    await loadProfile(data.session);
    return {};
  };

  const signUp = async (params: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    preferredLanguage: 'Bangla' | 'English' | 'Bilingual';
    marketingOptIn: boolean;
  }) => {
    if (!supabase) {
      return { error: 'Supabase authentication is not configured yet.' };
    }
    const { data, error } = await supabase.auth.signUp({
      email: params.email.trim(),
      password: params.password,
      options: {
        emailRedirectTo: `${window.location.origin}/verify-email`,
        data: {
          full_name: params.fullName.trim(),
          phone: (params.phone || '').trim(),
          preferred_language: params.preferredLanguage,
          marketing_opt_in: params.marketingOptIn,
        },
      },
    });
    if (error) return { error: error.message };
    return { needsVerification: !data.session };
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const resendVerification = async (email: string) => {
    if (!supabase) return { error: 'Supabase authentication is not configured yet.' };
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/verify-email` },
    });
    return error ? { error: error.message } : {};
  };

  const sendPasswordReset = async (email: string) => {
    if (!supabase) return { error: 'Supabase authentication is not configured yet.' };
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return error ? { error: error.message } : {};
  };

  const updatePassword = async (newPassword: string) => {
    if (!supabase) return { error: 'Supabase authentication is not configured yet.' };
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return error ? { error: error.message } : {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        supabaseConfigured: isSupabaseClientConfigured,
        refreshProfile,
        signIn,
        signUp,
        signOut,
        resendVerification,
        sendPasswordReset,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
