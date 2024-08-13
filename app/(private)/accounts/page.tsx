import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AiOutlinePlus } from 'react-icons/ai';
import { notFound } from 'next/navigation';
import { getAccounts } from '@/db/queries/accounts';
import { createClient } from '@/utils/supabase/server';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import AccountsDataTable from '@/components/data-tables/accounts-data-table';
import { DEFAULT_SIZE, DEFAULT_PAGE } from '@/constants/data-table';

export default async function AccountsPage(props: AccountsPageProps) {
  try {
    const { searchParams } = props;
    const queryClient = new QueryClient();
    const supabase = createClient();

    const page = Number(searchParams?.page ?? DEFAULT_PAGE);

    await queryClient.prefetchQuery({
      queryKey: ['Accounts', page],
      queryFn: () => getAccounts(supabase, page, DEFAULT_SIZE),
    });

    return (
      <section>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-3xl">Accounts</h2>
          <Link href="create-account">
            <Button className="rounded-full" variant="secondary" size="sm">
              <AiOutlinePlus /> Create Account
            </Button>
          </Link>
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <AccountsDataTable />
        </HydrationBoundary>
      </section>
    );
  } catch (e) {
    notFound();
  }
}

type AccountsPageProps = {
  searchParams: { page: string };
};
