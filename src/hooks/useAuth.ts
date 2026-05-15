import { useEffect, useState } from 'react';
import { supabase, WHITELIST_EMAIL } from '@/api/supabase';
import type { Session, User } from '@supabase/supabase-js';

export interface AuthState {
  loading: boolean;
  user: User | null;
  session: Session | null;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      // whitelist enforcement
      if (sess && sess.user.email && sess.user.email !== WHITELIST_EMAIL) {
        supabase.auth.signOut();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return {
    loading,
    user: session?.user ?? null,
    session,
    signInGoogle: async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };
}
