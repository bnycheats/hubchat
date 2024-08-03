'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
    revalidatePath('/', 'layout');
    return redirect('/dashboard');
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function signOut() {
  const supabase = createClient();
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    revalidatePath('/', 'layout');
    return redirect('/login');
  } catch (e) {
    console.error(e);
    throw e;
  }
}
