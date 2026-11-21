import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Request, Response, NextFunction } from 'express';

export interface AuthenticatedContext {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  accountStatus: 'pending_verification' | 'active' | 'suspended' | 'deactivated';
  fullName: string;
}

let cachedAdminClient: SupabaseClient | null = null;

export function getSupabaseUrl(): string {
  return (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
}

export function getSupabaseAnonKey(): string {
  return (process.env.VITE_SUPABASE_ANON_KEY || '').trim();
}

export function getSupabaseServiceKey(): string {
  return (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
}

export function isSupabaseClientConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseServiceKey());
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseAdminConfigured()) return null;
  if (!cachedAdminClient) {
    cachedAdminClient = createClient(getSupabaseUrl(), getSupabaseServiceKey(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return cachedAdminClient;
}

function getAdminBootstrapSet(): Set<string> {
  const raw = process.env.ADMIN_BOOTSTRAP_EMAILS || '';
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );
}

export async function resolveAuthContext(req: Request): Promise<AuthenticatedContext | null> {
  const admin = getSupabaseAdmin();
  if (!admin) return null;

  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  if (!token) return null;

  const { data: userData, error } = await admin.auth.getUser(token);
  if (error || !userData?.user) return null;

  const user = userData.user;
  const email = (user.email || '').toLowerCase();

  let { data: profile } = await admin
    .from('profiles')
    .select('id, email, role, account_status, full_name')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    const bootstrapAdmins = getAdminBootstrapSet();
    const initialRole = bootstrapAdmins.has(email) ? 'admin' : 'user';
    const initialStatus = user.email_confirmed_at ? 'active' : 'pending_verification';
    const { data: inserted } = await admin
      .from('profiles')
      .upsert(
        {
          id: user.id,
          email,
          full_name: (user.user_metadata?.full_name as string) || '',
          role: initialRole,
          account_status: initialStatus,
        },
        { onConflict: 'id' }
      )
      .select('id, email, role, account_status, full_name')
      .single();
    profile = inserted;
  } else {
    const bootstrapAdmins = getAdminBootstrapSet();
    if (bootstrapAdmins.has(email) && profile.role !== 'admin') {
      const { data: promoted } = await admin
        .from('profiles')
        .update({ role: 'admin', account_status: 'active' })
        .eq('id', user.id)
        .select('id, email, role, account_status, full_name')
        .single();
      if (promoted) profile = promoted;
    } else if (user.email_confirmed_at && profile.account_status === 'pending_verification') {
      const { data: activated } = await admin
        .from('profiles')
        .update({ account_status: 'active' })
        .eq('id', user.id)
        .select('id, email, role, account_status, full_name')
        .single();
      if (activated) profile = activated;
    }
  }

  if (!profile) return null;

  return {
    userId: profile.id,
    email: profile.email || email,
    role: profile.role === 'admin' ? 'admin' : 'user',
    accountStatus: profile.account_status,
    fullName: profile.full_name || '',
  };
}

export interface AuthedRequest extends Request {
  auth?: AuthenticatedContext;
}

export async function requireAuthenticatedUser(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!isSupabaseAdminConfigured()) {
    res.status(503).json({
      error: 'Supabase backend credentials (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) are not configured.',
      configRequired: true,
    });
    return;
  }
  const ctx = await resolveAuthContext(req);
  if (!ctx) {
    res.status(401).json({ error: 'Authentication required. Please sign in.' });
    return;
  }
  if (ctx.accountStatus === 'suspended' || ctx.accountStatus === 'deactivated') {
    res.status(403).json({
      error: `Account is currently ${ctx.accountStatus}. Contact educationatlas@gmail.com for assistance.`,
    });
    return;
  }
  req.auth = ctx;
  next();
}

export async function requireAdminUser(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  await requireAuthenticatedUser(req, res, () => {
    if (!req.auth || req.auth.role !== 'admin' || req.auth.accountStatus !== 'active') {
      res.status(403).json({ error: 'Administrator privileges required.' });
      return;
    }
    next();
  });
}
