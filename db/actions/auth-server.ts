'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  let redirectPath: string | null = null;
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: { message: error.message } };
    }
    revalidatePath('/', 'layout');
    redirectPath = '/dashboard';
  } catch (e) {
    console.log(e);
    return { error: { message: 'An unknown error occurred. Please try again.' } };
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
      return { error: { message: error.message } };
    }
    revalidatePath('/', 'layout');
    redirectPath = '/login';
  } catch (e) {
    console.log(e);
    return { error: { message: 'An unknown error occurred. Please try again.' } };
  } finally {
    if (redirectPath) redirect(redirectPath);
  }
}
