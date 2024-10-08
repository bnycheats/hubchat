'use client';

import { AiOutlineEllipsis } from 'react-icons/ai';
import { Fragment, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Row } from '@tanstack/react-table';
import { type User } from '@supabase/supabase-js';
import Link from 'next/link';
import UserInfo from '../sheets/user-info-sheet';
import DisableUserAlert from '../alerts/disable-user-alert';
import EnableUserAlert from '../alerts/enable-user-alert';
import { type UserMetadata } from '@/helpers/auth-types';
import { useRouter } from 'next/navigation';

function UserActionMenu(props: UserActionMenuProps) {
  const { row } = props;
  const { push } = useRouter();

  const userMetaData = row.original.user_metadata as UserMetadata;
  const [enableUserOpen, setEnableUserOpen] = useState(false);
  const [disableUserOpen, setDisableUserOpen] = useState(false);
  const [viewUserInfoOpen, setViewUserInfoOpen] = useState(false);

  const navigateToAccounts = (userId: string) => {
    const params = new URLSearchParams();
    params.set('filters', JSON.stringify({ userId }));
    return push(`/accounts?${params.toString()}`);
  };

  const navigateToCreateAccount = (userId: string) => {
    const params = new URLSearchParams();
    params.set('userId', userId);
    return push(`/create-account?${params.toString()}`);
  };

  return (
    <Fragment>
      <EnableUserAlert userId={row.original.id} open={enableUserOpen} closeAlert={() => setEnableUserOpen(false)} />
      <DisableUserAlert userId={row.original.id} open={disableUserOpen} closeAlert={() => setDisableUserOpen(false)} />
      <UserInfo row={row} open={viewUserInfoOpen} close={() => setViewUserInfoOpen(false)} />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <AiOutlineEllipsis size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setViewUserInfoOpen(true)}>View user info</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigateToAccounts(row.original.id)}>View user accounts</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigateToCreateAccount(row.original.id)}>
            Create user account
          </DropdownMenuItem>
          <Link href={`/users/${row.original.id}`}>
            <DropdownMenuItem>Update user</DropdownMenuItem>
          </Link>
          {userMetaData?.status ? (
            <DropdownMenuItem onClick={() => setDisableUserOpen(true)}>Disable user</DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setEnableUserOpen(true)}>Enable user</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
}

type UserActionMenuProps = {
  row: Row<User>;
};

export default UserActionMenu;
