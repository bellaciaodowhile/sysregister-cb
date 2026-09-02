import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase URL and Anon Key from environment variables (or localStorage if configured)
export function getSupabaseCredentials() {
  const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};
  
  const envUrl = env.VITE_SUPABASE_URL || '';
  const envKey = env.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_custom_url') : null;
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_custom_key') : null;

  const url = (envUrl || storedUrl || '').trim();
  const anonKey = (envKey || storedKey || '').trim();

  const isConfigured = Boolean(url && anonKey && url.startsWith('http'));

  return {
    url,
    anonKey,
    isConfigured,
  };
}

let supabaseInstance: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseCredentials();

  if (!isConfigured) {
    return null;
  }

  if (supabaseInstance && lastUrl === url && lastKey === anonKey) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    lastUrl = url;
    lastKey = anonKey;
    return supabaseInstance;
  } catch (err) {
    console.error('Error al inicializar cliente de Supabase:', err);
    return null;
  }
}
