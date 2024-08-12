import { z } from 'zod';
import { AccountFormSchema } from '@/helpers/account-types';
import { SupabaseClient } from '@supabase/supabase-js';

export async function createAccount(supabase: SupabaseClient, payload: z.infer<typeof AccountFormSchema>) {
  try {
    const { error, data } = await supabase.from('accounts').insert({ ...payload });
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
