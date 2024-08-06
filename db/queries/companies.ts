import { type CompanyType } from '@/helpers/company-types';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function getCompanies(supabase: SupabaseClient, page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  try {
    const { error, data, count } = await supabase.from('companies').select('*', { count: 'exact' }).range(start, end);
    if (error) {
      throw error;
    }
    if (!data) {
      return { data, count: 0 };
    }
    return { data: data as Array<CompanyType>, count };
  } catch (e) {
    console.error(e);
    throw e;
  }
}
