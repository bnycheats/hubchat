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

export async function updateAccountStatus(supabase: SupabaseClient, accountId: string, status: boolean) {
  try {
    const { error, data } = await supabase.from('accounts').update({ status }).eq('id', accountId);
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function updateAccount(
  supabase: SupabaseClient,
  accountId: string,
  payload: z.infer<typeof AccountFormSchema>,
) {
  try {
    const { error, data } = await supabase.from('accounts').update(payload).eq('id', accountId);
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
