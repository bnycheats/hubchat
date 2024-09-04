import { AiOutlinePlus } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import ApplicationsDataTable from '@/components/data-tables/applications-data-table';
import { getApplications } from '@/db/queries/applications';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { DEFAULT_SIZE, DEFAULT_PAGE } from '@/constants/data-table';

export default async function ApplicationsPage(props: ApplicationsPageProps) {
  const supabase = createClient();
  const { searchParams } = props;
  const queryClient = new QueryClient();

  const page = Number(searchParams?.page ?? DEFAULT_PAGE);

  await queryClient.prefetchQuery({
    queryKey: ['Applications', page],
    queryFn: () => getApplications(supabase, page, DEFAULT_SIZE),
  });

  try {
    return (
      <section>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-3xl">Applications</h2>
          <Link href="/apply-leave">
            <Button className="rounded-full" variant="secondary" size="sm">
              <AiOutlinePlus /> Apply Leave
            </Button>
          </Link>
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ApplicationsDataTable />
        </HydrationBoundary>
      </section>
    );
  } catch (e) {
    notFound();
  }
}

type ApplicationsPageProps = {
  searchParams: { page: string };
};
