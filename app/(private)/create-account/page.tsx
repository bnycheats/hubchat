import { notFound } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getCompanies } from '@/db/queries/companies';
import { getUsers } from '@/db/queries/auth';
import { createClient } from '@/utils/supabase/server';
import CreateAccountForm from '@/components/forms/create-account-form';
import FullScreenModal from '@/components/full-sreen-modal';

export default async function CreateAccountPage() {
  try {
    const queryClient = new QueryClient();
    const supabase = createClient();

    await queryClient.prefetchQuery({
      queryKey: ['Companies'],
      queryFn: () => getCompanies(supabase),
    });

    await queryClient.prefetchQuery({
      queryKey: ['Users'],
      queryFn: () => getUsers(supabase),
    });

    return (
      <FullScreenModal path="/accounts">
        <h2 className="text-3xl">Create Account</h2>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CreateAccountForm />
        </HydrationBoundary>
      </FullScreenModal>
    );
  } catch (e) {
    notFound();
  }
}
