import { AiOutlinePlus } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ClientsDataTable from '@/components/data-tables/clients-data-table';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getClients } from '@/db/queries/clients';
import { createClient } from '@/utils/supabase/server';
import { DEFAULT_SIZE, DEFAULT_PAGE } from '@/constants/data-table';
import ClientFilterPopup from '@/components/filter-popups/client-filter-popup';

export default async function ClientsPage(props: ClientsPageProps) {
  try {
    const supabase = createClient();
    const { searchParams } = props;
    const queryClient = new QueryClient();

    const page = Number(searchParams?.page ?? DEFAULT_PAGE);
    const filters: { userId?: string; status?: string } = JSON.parse(searchParams?.filters ?? '{}');

    await queryClient.prefetchQuery({
      queryKey: ['Clients', page],
      queryFn: () => getClients(supabase, page, DEFAULT_SIZE, filters),
    });

    return (
      <section>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-3xl">Clients</h2>
          <Link href="/create-client">
            <Button className="rounded-full" variant="secondary" size="sm">
              <AiOutlinePlus /> Create Client
            </Button>
          </Link>
          <ClientFilterPopup />
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ClientsDataTable />
        </HydrationBoundary>
      </section>
    );
  } catch (e) {
    notFound();
  }
}

type ClientsPageProps = {
  searchParams: { page: string; filters: string };
};
