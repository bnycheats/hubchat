'use client';

import { createClient } from '@/utils/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, createContext, useEffect, useState } from 'react';

export type AuthContextValue = {
  session: Session | null;
};

export const AuthContext = createContext<AuthContextValue>({
  session: null,
});

export function AuthProvider(props: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const { push } = useRouter();

  useEffect(() => {
    const supabaseClient = createClient();
    supabaseClient.auth.getSession().then((response) => {
      setSession(response.data.session);
    });

    const { data } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setSession(session);
      console.log(event);
      switch (event) {
        case 'PASSWORD_RECOVERY': {
          push('/update-password');
          break;
        }
        default:
          break;
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ session }}>{props.children}</AuthContext.Provider>;
}

export default AuthProvider;
