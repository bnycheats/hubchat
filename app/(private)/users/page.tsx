import { AiOutlinePlus } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import UsersDataTable from '@/components/data-tables/users-data-table';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getUsers } from '@/db/server/queries/auth';
import { DEFAULT_SIZE, DEFAULT_PAGE } from '@/constants/data-table';

export default async function UsersPage(props: UsersPageProps) {
  try {
    const { searchParams } = props;
    const queryClient = new QueryClient();

    const page = Number(searchParams?.page ?? DEFAULT_PAGE);

    await queryClient.prefetchQuery({
      queryKey: ['Users', page],
      queryFn: () => getUsers(page, DEFAULT_SIZE),
    });

    return (
      <section>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-3xl">Users</h2>
          <Link href="/create-user">
            <Button className="rounded-full" variant="secondary" size="sm">
              <AiOutlinePlus /> Create User
            </Button>
          </Link>
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <UsersDataTable />
        </HydrationBoundary>
      </section>
    );
  } catch (e) {
    notFound();
  }
}

type UsersPageProps = {
  searchParams: { page: string };
};
