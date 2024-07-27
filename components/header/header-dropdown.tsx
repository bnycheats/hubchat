'use server';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { Badge } from '../ui/badge';
import Avatar from './avatar';
import LogoutAction from './logout-action';

import { createClient } from '@/utils/supabase/server';

export default async function HeaderDropdown() {
  const { data } = await createClient().auth.getUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar name={data.user?.email} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="flex flex-col items-start gap-2">
          <div className="flex flex-wrap gap-1">
            {/* {userDetails?.role.map((item, index) => (
              <Badge key={index} variant="secondary">
                {item}
              </Badge>
            ))} */}
          </div>
          <span>{data.user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link className="w-full" href="/settings/profile">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link className="w-full" href="/settings/security">
            Security
          </Link>
        </DropdownMenuItem>
        <LogoutAction />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
