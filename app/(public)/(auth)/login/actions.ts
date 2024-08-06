'use server';

import { createClient } from '@/utils/supabase/server';
import { signIn, signOut } from '@/db/actions/auth';

export async function login(email: string, password: string) {
  const supabase = createClient();
  return signIn(supabase, email, password);
}

export async function logout() {
  const supabase = createClient();
  return signOut(supabase);
}
