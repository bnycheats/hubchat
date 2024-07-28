import { AiOutlinePlus } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UsersPage() {
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
    </section>
  );
}
