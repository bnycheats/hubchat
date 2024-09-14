import { notFound } from 'next/navigation';
import { getClient } from '@/db/queries/clients';
import { createClient } from '@/utils/supabase/server';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import UpdateClientForm from '@/components/forms/update-client-form';
import DisableClientButton from '@/components/buttons/disable-client-button';
import FullScreenModal from '@/components/full-sreen-modal';

export default async function UpdateClientPage(props: UpdateClientPageProps) {
  try {
    const { params } = props;
    const queryClient = new QueryClient();
    const supabase = createClient();

    await queryClient.prefetchQuery({
      queryKey: ['Client', params.uid],
      queryFn: () => getClient(supabase, params.uid),
    });

    return (
      <FullScreenModal path="/clients">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl">Update Client</h2>
              <DisableClientButton clientId={params.uid} />
            </div>
            <UpdateClientForm clientId={params.uid} />
          </section>
        </HydrationBoundary>
      </FullScreenModal>
    );
  } catch (e) {
    notFound();
  }
}

type UpdateClientPageProps = {
  params: {
    uid: string;
  };
};
