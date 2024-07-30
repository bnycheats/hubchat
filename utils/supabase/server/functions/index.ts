'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { type UserMetadata, type Credential } from './types';

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

export async function createUser(credentials: Credential, userMetadata: UserMetadata) {
  const supabase = createClient();
  try {
    const { error, data } = await supabase.auth.admin.createUser({
      ...credentials,
      email_confirm: true,
      user_metadata: {
        ...userMetadata,
        status: true,
      },
    });
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
