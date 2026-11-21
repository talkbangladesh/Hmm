import { supabase } from './supabase';

export class ApiError extends Error {
  status: number;
  configRequired?: boolean;

  constructor(message: string, status: number, configRequired?: boolean) {
    super(message);
    this.status = status;
    this.configRequired = configRequired;
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit & { requireAuth?: boolean } = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (supabase) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else if (options.requireAuth) {
      throw new ApiError('Authentication required. Please sign in.', 401);
    }
  } else if (options.requireAuth) {
    throw new ApiError('Supabase client is not configured yet.', 503, true);
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  const text = await response.text();
  let json: Record<string, unknown> = {};
  try {
    json = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    json = { error: text || 'Unexpected server response.' };
  }

  if (!response.ok) {
    throw new ApiError(
      String(json.error || `Request failed (${response.status})`),
      response.status,
      Boolean(json.configRequired)
    );
  }

  return json as T;
}
