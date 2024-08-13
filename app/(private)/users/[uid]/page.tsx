import { notFound } from 'next/navigation';
import { getUser } from '@/db/queries/auth';
import { createClient } from '@/utils/supabase/server';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import UpdateUserForm from '@/components/forms/update-user-form';
import UpdateRolesButton from '@/components/buttons/update-roles-button';
import DisableUserButton from '@/components/buttons/disable-user-button';
import FullScreenModal from '@/components/full-sreen-modal';

export default async function UpdateUserPage(props: UpdateUserPageProps) {
  try {
    const { params } = props;
    const queryClient = new QueryClient();
    const supabase = createClient();

    await queryClient.prefetchQuery({
      queryKey: ['User', params.uid],
      queryFn: () => getUser(supabase, params.uid),
    });

    return (
      <FullScreenModal path="/users">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl">Update User</h2>
              <div className="flex gap-2">
                <UpdateRolesButton userId={params.uid} />
                <DisableUserButton userId={params.uid} />
              </div>
            </div>
            <UpdateUserForm userId={params.uid} />
          </section>
        </HydrationBoundary>
      </FullScreenModal>
    );
  } catch (e) {
    notFound();
  }
}

type UpdateUserPageProps = {
  params: {
    uid: string;
  };
};
