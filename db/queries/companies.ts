import { type CompanyResponse } from '@/helpers/company-types';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function getCompanies(supabase: SupabaseClient, page?: number, pageSize?: number) {
  try {
    let query = supabase.from('companies').select('*', { count: 'exact' }).order('created_at', { ascending: false });

    if (page && pageSize) {
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      query = query.range(start, end);
    }

    const { error, data, count } = await query;

    if (error) {
      throw error;
    }
    if (!data) {
      return { data, count: 0 };
    }
    return { data: data as Array<CompanyResponse>, count };
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function getCompany(supabase: SupabaseClient, companyId: string) {
  try {
    const { error, data } = await supabase.from('companies').select().eq('id', companyId).single();
    if (error) {
      throw error;
    }
    return data as unknown as CompanyResponse;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
