import { createClient } from '../';
import { type UserMetadata, type Credential } from './types';

const supabaseClient = createClient();

export async function createUser(credentials: Credential, userMetadata: UserMetadata) {
  const response = await supabaseClient.auth.signUp({
    ...credentials,
    options: {
      data: { ...userMetadata },
    },
  });
  return response;
}

export function signIn(email: string, password: string) {
  return supabaseClient.auth.signInWithPassword({ email, password });
}

export function signOut() {
  return supabaseClient.auth.signOut();
}

export function forgotPassword(email: string) {
  return supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: process.env.NEXT_PUBLIC_APP_URL });
}

export function updatePassword(password: string) {
  return supabaseClient.auth.updateUser({ password });
}
