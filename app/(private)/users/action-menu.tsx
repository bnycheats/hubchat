'use client';

import { AiOutlineEllipsis } from 'react-icons/ai';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Row } from '@tanstack/react-table';
import { type User } from '@supabase/supabase-js';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import UserInfo from './user-info';

function ActionMenu(props: ActionMenuProps) {
  const { row } = props;

  const [viewUserInfoOpen, setViewUserInfoOpen] = useState(false);

  return (
    <Fragment>
      <UserInfo row={row} open={viewUserInfoOpen} close={() => setViewUserInfoOpen(false)} />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <AiOutlineEllipsis size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setViewUserInfoOpen(true)}>View user info</DropdownMenuItem>
          <Link href={`/users/${row.original.id}`}>
            <DropdownMenuItem>Update user</DropdownMenuItem>
          </Link>
          <DropdownMenuItem>Disable user</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
}

type ActionMenuProps = {
  row: Row<User>;
};

export default ActionMenu;
