import { z } from 'zod';
import { FormSchema as CreateCompanyFormSchema } from '@/components/forms/create-company-form';
import { SupabaseClient } from '@supabase/supabase-js';

export async function createCompany(supabase: SupabaseClient, payload: z.infer<typeof CreateCompanyFormSchema>) {
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
