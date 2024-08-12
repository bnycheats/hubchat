import { type AccountTypes } from '@/helpers/account-types';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function getAccounts(supabase: SupabaseClient, page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  try {
    const { error, data, count } = await supabase
      .from('accounts')
      .select('*', { count: 'exact' })
      .range(start, end)
      .order('created_at', { ascending: false });
    if (error) {
      throw error;
    }
    if (!data) {
      return { data, count: 0 };
    }
    return { data: data as Array<AccountTypes>, count };
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// export async function getCompany(supabase: SupabaseClient, companyId: string) {
//   try {
//     const { error, data } = await supabase.from('companies').select().eq('id', companyId).single();
//     if (error) {
//       throw error;
//     }
//     return data as unknown as CompanyResponse;
//   } catch (e) {
//     console.error(e);
//     throw e;
//   }
// }
