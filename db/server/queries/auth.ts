'use server';

import { createClient } from '@/utils/supabase/server';

export async function getUsers(page: number, perPage: number) {
  const supabase = createClient();
  try {
    const { error, data } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function getUser(userId: string) {
  const supabase = createClient();
  try {
    const { error, data } = await supabase.auth.admin.getUserById(userId);
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
