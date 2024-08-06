import { AiOutlinePlus } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CompaniesDataTable from '@/components/data-tables/companies-data-table';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getCompanies } from '@/db/queries/companies';
import { createClient } from '@/utils/supabase/server';
import { DEFAULT_SIZE, DEFAULT_PAGE } from '@/constants/data-table';

export default async function CompaniesPage(props: CompaniesPageProps) {
  try {
    const supabase = createClient();
    const { searchParams } = props;
    const queryClient = new QueryClient();

    const page = Number(searchParams?.page ?? DEFAULT_PAGE);

    await queryClient.prefetchQuery({
      queryKey: ['Companies', page],
      queryFn: () => getCompanies(supabase, page, DEFAULT_SIZE),
    });

    return (
      <section>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-3xl">Companies</h2>
          <Link href="/create-company">
            <Button className="rounded-full" variant="secondary" size="sm">
              <AiOutlinePlus /> Create Company
            </Button>
          </Link>
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CompaniesDataTable />
        </HydrationBoundary>
      </section>
    );
  } catch (e) {
    notFound();
  }
}

type CompaniesPageProps = {
  searchParams: { page: string };
};
