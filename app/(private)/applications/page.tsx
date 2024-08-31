import { AiOutlinePlus } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ApplicatinsPage() {
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
      </section>
    );
  } catch (e) {
    notFound();
  }
}
