import { type SupabaseClient } from '@supabase/supabase-js';

export async function getUsers(supabase: SupabaseClient, page?: number, perPage?: number) {
  try {
    let query;

    if (page && perPage) {
      query = supabase.auth.admin.listUsers({ page, perPage });
    } else {
      query = supabase.auth.admin.listUsers();
    }

    const { error, data } = await query;

    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function getUser(supabase: SupabaseClient, userId: string) {
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
