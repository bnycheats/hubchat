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
import { Badge } from '../ui/badge';
import Avatar from './avatar';

import { createClient } from '@/utils/supabase/server';
import { type UserMetadata } from '@/helpers/auth-types';
import LogoutAction from './logout-action';

export default async function HeaderDropdown() {
  const {
    data: { user },
  } = await createClient().auth.getUser();
  const userMetaData = user?.user_metadata as UserMetadata;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar name={user?.email} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuLabel className="flex flex-col items-start gap-2">
          <div className="flex flex-wrap gap-1 max-w-52">
            {userMetaData?.user_role?.map((item, index) => (
              <Badge size="xs" key={index} variant="secondary">
                {item.toUpperCase()}
              </Badge>
            ))}
          </div>
          <span>{user?.email}</span>
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
