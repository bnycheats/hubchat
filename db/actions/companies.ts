import { z } from 'zod';
import { CompanyFormSchema } from '@/helpers/company-types';
import { SupabaseClient } from '@supabase/supabase-js';

export async function createCompany(supabase: SupabaseClient, payload: z.infer<typeof CompanyFormSchema>) {
  try {
    const { error, data } = await supabase.from('companies').insert({ ...payload });
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function updateCompanyStatus(supabase: SupabaseClient, companyId: string, status: boolean) {
  try {
    const { error, data } = await supabase.from('companies').update({ status }).eq('id', companyId);
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function updateCompany(
  supabase: SupabaseClient,
  companyId: string,
  payload: z.infer<typeof CompanyFormSchema>,
) {
  try {
    const { error, data } = await supabase.from('companies').update(payload).eq('id', companyId);
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
