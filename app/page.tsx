import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const { data } = await createClient().auth.getSession();
  if (data.session) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
