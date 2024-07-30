import { createClient } from '..';
import { type UserMetadata } from '../../server/functions/types';
import { type GetUsersPayload } from './types';

export function forgotPassword(email: string) {
  return createClient().auth.resetPasswordForEmail(email, { redirectTo: process.env.NEXT_PUBLIC_APP_URL });
}

export function updatePassword(password: string) {
  return createClient().auth.updateUser({ password });
}

export function updateUserMetaData(updates: Partial<UserMetadata>) {
  return createClient().auth.updateUser({ data: updates });
}

export function getUsers({ page, perPage }: GetUsersPayload) {
  return createClient().auth.admin.listUsers({ page, perPage });
}
