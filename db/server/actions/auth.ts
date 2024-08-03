'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  let redirectPath: string | null = null;
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
    revalidatePath('/', 'layout');
    redirectPath = '/dashboard';
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    if (redirectPath) redirect(redirectPath);
  }
}

export async function signOut() {
  const supabase = createClient();
  let redirectPath: string | null = null;
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    revalidatePath('/', 'layout');
    redirectPath = '/login';
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    if (redirectPath) redirect(redirectPath);
  }
}
