'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AiOutlineEye } from 'react-icons/ai';
import { notFound, useParams } from 'next/navigation';
import { getUser } from '@/utils/supabase/client/functions';
import UpdateUserForm from './update-user-form';

export default async function UpdateUserPage() {
  const { uid } = useParams<{ uid: string }>();
  const { data, error } = await getUser(uid);

  if (error) {
    notFound();
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl">Update User</h2>
          <Link href={`/users/${uid}/accounts`}>
            <Button className="rounded-full" variant="secondary" size="sm">
              <AiOutlineEye /> View Accounts
            </Button>
          </Link>
        </div>
        {/* {user?.active && <DisableButton />} */}
      </div>
      <UpdateUserForm user={data?.user} />
    </section>
  );
}
