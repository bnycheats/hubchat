import { type AccountResponse } from '@/helpers/account-types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Filters } from '@/components/filter-popups/account-filter-popup/filter-popup';

export async function getAccounts(supabase: SupabaseClient, page: number, pageSize: number, filters?: Filters) {
  try {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
      .from('accounts')
      .select('*', { count: 'exact' })
      .range(start, end)
      .order('created_at', { ascending: false });

    if (filters?.name) {
      query = query.ilike('account_name', `%${filters.name}%`);
    }

    if (filters?.userId) {
      query = query.eq('id', filters.userId);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status === 'ACTIVE');
    }

    if (filters?.role) {
      query = query.eq('role', filters.role);
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
    return { data: data as Array<AccountResponse>, count };
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function getAccount(supabase: SupabaseClient, accountId: string) {
  try {
    const { error, data } = await supabase.from('accounts').select().eq('id', accountId).single();
    if (error) {
      throw error;
    }
    return data as unknown as AccountResponse;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
