import { notFound } from 'next/navigation';
import { getCompany } from '@/db/queries/companies';
import { createClient } from '@/utils/supabase/server';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import UpdateCompanyForm from '@/components/forms/update-company-form';
import DisableCompanyButton from '@/components/buttons/disable-company-button';

export default async function UpdateCompanyPage(props: UpdateCompanyPageProps) {
  try {
    const { params } = props;
    const queryClient = new QueryClient();
    const supabase = createClient();

    await queryClient.prefetchQuery({
      queryKey: ['Company', params.uid],
      queryFn: () => getCompany(supabase, params.uid),
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl">Update Company</h2>
            <DisableCompanyButton companyId={params.uid} />
          </div>
          <UpdateCompanyForm companyId={params.uid} />
        </section>
      </HydrationBoundary>
    );
  } catch (e) {
    notFound();
  }
}

type UpdateCompanyPageProps = {
  params: {
    uid: string;
  };
};
