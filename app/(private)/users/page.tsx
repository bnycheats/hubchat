import { AiOutlinePlus } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getUsers } from '@/utils/supabase/client/functions';
import { notFound } from 'next/navigation';
import UsersDataTable from './users-data-table';
import { DEFAULT_SIZE, DEFAULT_PAGE } from './constants';

export default async function UsersPage() {
  try {
    const initialData = await getUsers({ page: DEFAULT_PAGE, perPage: DEFAULT_SIZE });
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
        <UsersDataTable initialData={initialData} />
      </section>
    );
  } catch (e) {
    notFound();
  }
}
