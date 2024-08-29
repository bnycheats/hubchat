import { type SupabaseClient } from '@supabase/supabase-js';
import { type UserMetadata } from '@/helpers/auth-types';
import { type Filters } from '@/components/filter-popups/user-filter-popup/filter-popup';
import { type RolesEnums } from '@/helpers/types';

export async function getUsers(supabase: SupabaseClient, page?: number, perPage?: number, filters?: Filters) {
  try {
    const { error, data } = await supabase.auth.admin.listUsers();

    if (error) {
      throw error;
    }

    if (filters?.status) {
      data.users = data.users.filter((item) => {
        const userMetaData = item.user_metadata as UserMetadata;
        return !!userMetaData.status === (filters.status === 'ACTIVE');
      });
    }

    if (filters?.email) {
      const regex = new RegExp('^' + filters.email);
      data.users = data.users.filter((item) => {
        return item.email?.match(regex);
      });
    }

    if (filters?.role) {
      data.users = data.users.filter((item) => {
        const userMetaData = item.user_metadata as UserMetadata;
        return userMetaData?.user_role?.includes(filters.role as RolesEnums);
      });
    }

    if (page && perPage) {
      const startIndex = (page - 1) * perPage;
      const endIndex = page * perPage;
      data.total = data.users.length;
      data.users = data.users.slice(startIndex, endIndex);
    }

    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function getUser(supabase: SupabaseClient, userId: string) {
  try {
    const { error, data } = await supabase.auth.admin.getUserById(userId);
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
