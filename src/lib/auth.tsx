import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';

type AuthState = {
  /** Whether a real Supabase backend is configured. When false the app runs
   *  in open demo mode and protected routes are accessible without login. */
  configured: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    // getSession() reads the locally stored session without a network call.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: 'Authentication is disabled in demo mode.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        configured: isSupabaseConfigured,
        loading,
        session,
        user: session?.user ?? null,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
