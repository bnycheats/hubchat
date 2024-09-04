import { type ApplicationResponse } from '@/helpers/application-types';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function getApplications(supabase: SupabaseClient, page: number, pageSize: number) {
  try {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
      .from('applications')
      .select('*', { count: 'exact' })
      .range(start, end)
      .order('created_at', { ascending: false });

    const { error, data, count } = await query;

    if (error) {
      throw error;
    }
    if (!data) {
      return { data, count: 0 };
    }
    return { data: data as Array<ApplicationResponse>, count };
  } catch (e) {
    console.error(e);
    throw e;
  }
}
