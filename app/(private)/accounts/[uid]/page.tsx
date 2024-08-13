import { notFound } from 'next/navigation';
import { getAccount } from '@/db/queries/accounts';
import { createClient } from '@/utils/supabase/server';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import UpdateAccountForm from '@/components/forms/update-account-form';
import DisableAccountButton from '@/components/buttons/disable-account-button';
import FullScreenModal from '@/components/full-sreen-modal';

export default async function UpdateAccountPage(props: UpdateAccountPageProps) {
  try {
    const { params } = props;
    const queryClient = new QueryClient();
    const supabase = createClient();

    await queryClient.prefetchQuery({
      queryKey: ['Account', params.uid],
      queryFn: () => getAccount(supabase, params.uid),
    });

    return (
      <FullScreenModal path="/accounts">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl">Update Account</h2>
              <DisableAccountButton accountId={params.uid} />
            </div>
            <UpdateAccountForm accountId={params.uid} />
          </section>
        </HydrationBoundary>
      </FullScreenModal>
    );
  } catch (e) {
    notFound();
  }
}

type UpdateAccountPageProps = {
  params: {
    uid: string;
  };
};
