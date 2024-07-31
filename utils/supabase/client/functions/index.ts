import { createClient } from '..';
import { type UserMetadata } from '../../server/functions/types';
import { type AdminUserAttributes } from '@supabase/supabase-js';

export function forgotPassword(email: string) {
  return createClient().auth.resetPasswordForEmail(email, { redirectTo: process.env.NEXT_PUBLIC_APP_URL });
}

export function updatePassword(password: string) {
  return createClient().auth.updateUser({ password });
}

export function updateProfileUserMetaData(payload: Partial<UserMetadata>) {
  return createClient().auth.updateUser({ data: payload });
}

export function getUsers(page: number, perPage: number) {
  return createClient().auth.admin.listUsers({ page, perPage });
}

export function getUser(userId: string) {
  return createClient().auth.admin.getUserById(userId);
}

export function updateUserById(userId: string, payload: AdminUserAttributes) {
  return createClient().auth.admin.updateUserById(userId, payload);
}
