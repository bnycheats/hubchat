import { AiOutlinePlus } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import UsersDataTable from '@/components/data-tables/users-data-table';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getUsers } from '@/db/queries/auth';
import { createClient } from '@/utils/supabase/server';
import { DEFAULT_SIZE, DEFAULT_PAGE } from '@/constants/data-table';
import UserFilterPopup from '@/components/filter-popups/user-filter-popup';

export default async function UsersPage(props: UsersPageProps) {
  try {
    const { searchParams } = props;
    const queryClient = new QueryClient();
    const supabase = createClient();

    const page = Number(searchParams?.page ?? DEFAULT_PAGE);
    const filters: { status?: string } = JSON.parse(searchParams?.filters ?? '{}');

    await queryClient.prefetchQuery({
      queryKey: ['Users', page],
      queryFn: () => getUsers(supabase, page, DEFAULT_SIZE, filters),
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
          <UserFilterPopup />
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
  searchParams: { page: string; filters: string };
};
