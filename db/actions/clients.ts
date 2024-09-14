import { z } from 'zod';
import { ClientFormSchema } from '@/helpers/client-types';
import { SupabaseClient } from '@supabase/supabase-js';

export async function createClient(supabase: SupabaseClient, payload: z.infer<typeof ClientFormSchema>) {
  try {
    const { error, data } = await supabase.from('clients').insert({ ...payload });
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function updateClientStatus(supabase: SupabaseClient, clientId: string, status: boolean) {
  try {
    const { error, data } = await supabase.from('clients').update({ status }).eq('id', clientId);
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function updateClient(
  supabase: SupabaseClient,
  clientId: string,
  payload: z.infer<typeof ClientFormSchema>,
) {
  try {
    const { error, data } = await supabase.from('clients').update(payload).eq('id', clientId);
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
