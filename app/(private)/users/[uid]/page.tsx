import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AiOutlineEye } from 'react-icons/ai';
import { notFound } from 'next/navigation';
import { getUser } from '@/db/server/queries/auth';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import UpdateUserForm from '@/components/forms/update-user-form';
import UpdateRolesButton from '@/components/buttons/update-roles-button';

export default async function UpdateUserPage(props: UpdateUserPageProps) {
  try {
    const { params } = props;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
      queryKey: ['User', params.uid],
      queryFn: () => getUser(params.uid),
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl">Update User</h2>
              <Link href={`/users/${props.params.uid}/accounts`}>
                <Button className="rounded-full" variant="secondary" size="sm">
                  <AiOutlineEye /> View Accounts
                </Button>
              </Link>
            </div>
            <UpdateRolesButton userId={params.uid} />
            {/* {user?.active && <DisableButton />} */}
          </div>
          <UpdateUserForm userId={params.uid} />
        </section>
      </HydrationBoundary>
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
