import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SecurityPage() {
  return (
    <section>
      <ul>
        <li className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-medium">Password</h2>
            <p className="text-sm">Set a unique password to protect your account.</p>
          </div>
          <Link href="/update-password">
            <Button variant="secondary" className="rounded-full text-primary">
              Change Password
            </Button>
          </Link>
        </li>
      </ul>
    </section>
  );
}
