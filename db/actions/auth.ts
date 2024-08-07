import type { SupabaseClient, AdminUserAttributes } from '@supabase/supabase-js';
import type { UserMetadata, Credential } from '@/helpers/auth-types';
import { RolesEnums } from '@/helpers/types';

export async function forgotPassword(supabase: SupabaseClient, email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: process.env.NEXT_PUBLIC_APP_URL });
    if (error) {
      throw error;
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function updatePassword(supabase: SupabaseClient, password: string) {
  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      throw error;
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function createUser(supabase: SupabaseClient, credentials: Credential, userMetadata: UserMetadata) {
  try {
    const { error, data } = await supabase.auth.admin.createUser({
      ...credentials,
      email_confirm: true,
      user_metadata: {
        ...userMetadata,
        status: true,
      },
    });
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function updateUserById(supabase: SupabaseClient, userId: string, payload: AdminUserAttributes) {
  try {
    const { error } = await supabase.auth.admin.updateUserById(userId, payload);
    if (error) {
      throw error;
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function updateUserRoles(supabase: SupabaseClient, userId: string, roles: Array<RolesEnums>) {
  try {
    await updateUserById(supabase, userId, {
      user_metadata: { user_role: roles },
    });

    const { error: publicUserError } = await supabase.rpc('update_user_roles', {
      user_id: userId,
      new_roles: roles,
    });

    if (publicUserError) {
      throw publicUserError;
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function updateProfileUserMetaData(supabase: SupabaseClient, payload: Partial<UserMetadata>) {
  try {
    const { error } = await supabase.auth.updateUser({ data: payload });
    if (error) {
      throw error;
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}
