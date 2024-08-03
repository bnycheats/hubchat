'use client';

import type { UserMetadata, Credential } from '@/helpers/auth-types';
import { createClient } from '@/utils/supabase/client';
import { type AdminUserAttributes } from '@supabase/supabase-js';
import { RolesEnums } from '@/helpers/types';

export async function forgotPassword(email: string) {
  const supabase = createClient();
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

export async function updatePassword(password: string) {
  const supabase = createClient();
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

export async function createUser(credentials: Credential, userMetadata: UserMetadata) {
  const supabase = createClient();
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

export async function updateUserById(userId: string, payload: AdminUserAttributes) {
  const supabase = createClient();
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

export async function updateUserRoles(userId: string, roles: Array<RolesEnums>) {
  try {
    await updateUserById(userId, {
      user_metadata: { user_role: roles },
    });

    const { error: publicUserError } = await createClient().rpc('update_user_roles', {
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

export async function updateProfileUserMetaData(payload: Partial<UserMetadata>) {
  const supabase = createClient();
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
