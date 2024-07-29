import { createClient } from '../';
import { type UserMetadata, type Credential } from './types';

export async function createUser(credentials: Credential, userMetadata: UserMetadata) {
  const response = await createClient().auth.admin.createUser({
    ...credentials,
    email_confirm: true,
    user_metadata: {
      ...userMetadata,
      status: true,
    },
  });
  return response;
}

export function signIn(email: string, password: string) {
  return createClient().auth.signInWithPassword({ email, password });
}

export function forgotPassword(email: string) {
  return createClient().auth.resetPasswordForEmail(email, { redirectTo: process.env.NEXT_PUBLIC_APP_URL });
}

export function updatePassword(password: string) {
  return createClient().auth.updateUser({ password });
}

export function updateUserMetaData(updates: Partial<UserMetadata>) {
  return createClient().auth.updateUser({ data: updates });
}
