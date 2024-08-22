import { type CompanyResponse } from '@/helpers/company-types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Filters } from '@/components/filter-popups/company-filter-popup/filter-popup';

export async function getCompanies(supabase: SupabaseClient, page?: number, pageSize?: number, filters?: Filters) {
  try {
    let query = supabase.from('companies').select('*', { count: 'exact' }).order('created_at', { ascending: false });

    if (page && pageSize) {
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      query = query.range(start, end);
    }

    if (filters?.company_name) {
      query = query.ilike('company_name', `%${filters.company_name}%`);
    }

    if (filters?.owner_name) {
      query = query.ilike('owner_name', `%${filters.owner_name}%`);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status === 'ACTIVE');
    }

    if (filters?.currency) {
      query = query.eq('currency', filters.currency);
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
