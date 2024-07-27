
import { createClient } from "./";

const supabaseClient = createClient();

export function signIn(email: string, password: string) {
  return supabaseClient.auth.signInWithPassword({ email, password });
}

export function signOut() {
  return supabaseClient.auth.signOut();
}

export function updateUserPassword(password: string) {
  return supabaseClient.auth.updateUser({ password });
}

export function updateUserEmail(email: string) {
  return supabaseClient.auth.updateUser({ email });
}
