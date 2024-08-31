import { notFound } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getUsers } from '@/db/queries/auth';
import { createClient } from '@/utils/supabase/server';
import FullScreenModal from '@/components/full-sreen-modal';
import ApplyLeaveForm from '@/components/forms/apply-leave-form';

export default async function ApplyLeavePage() {
  try {
    const queryClient = new QueryClient();
    const supabase = createClient();

    await queryClient.prefetchQuery({
      queryKey: ['Users'],
      queryFn: () => getUsers(supabase),
    });

    return (
      <FullScreenModal path="/applications">
        <h2 className="text-3xl">Apply Leave</h2>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ApplyLeaveForm />
        </HydrationBoundary>
      </FullScreenModal>
    );
  } catch (e) {
    notFound();
  }
}
