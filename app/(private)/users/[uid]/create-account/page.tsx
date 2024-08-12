import { notFound } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getCompanies } from '@/db/queries/companies';
import { createClient } from '@/utils/supabase/server';
import CreateAccountForm from '@/components/forms/create-account-form';

export default async function CreateAccountPage(props: CreateAccountProps) {
  try {
    const { params } = props;
    const queryClient = new QueryClient();
    const supabase = createClient();

    await queryClient.prefetchQuery({
      queryKey: ['Companies'],
      queryFn: () => getCompanies(supabase, 1, 100),
    });

    return (
      <section>
        <h2 className="text-3xl">Create Account</h2>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CreateAccountForm userId={params.uid} />
        </HydrationBoundary>
      </section>
    );
  } catch (e) {
    notFound();
  }
}

type CreateAccountProps = {
  params: {
    uid: string;
  };
};
