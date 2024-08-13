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
import Link from 'next/link';
import AccountInfoSheet from '../sheets/account-info-sheet';
import DisableAccountAlert from '../alerts/disable-account-alert';
import EnableAccountAlert from '../alerts/enable-account-alert';
import { type AccountResponse } from '@/helpers/account-types';

function AccountActionMenu(props: AccountActionMenuProps) {
  const { row } = props;
  const account = row.original;
  const [enableAccountOpen, setEnableAccountOpen] = useState(false);
  const [disableAccountOpen, setDisableAccountOpen] = useState(false);
  const [viewAccountInfoOpen, setViewAccountInfoOpen] = useState(false);
  return (
    <Fragment>
      <EnableAccountAlert
        accountId={row.original.id}
        open={enableAccountOpen}
        closeAlert={() => setEnableAccountOpen(false)}
      />
      <DisableAccountAlert
        accountId={row.original.id}
        open={disableAccountOpen}
        closeAlert={() => setDisableAccountOpen(false)}
      />
      <AccountInfoSheet row={row} open={viewAccountInfoOpen} close={() => setViewAccountInfoOpen(false)} />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <AiOutlineEllipsis size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setViewAccountInfoOpen(true)}>View account info</DropdownMenuItem>
          <Link href={`/accounts/${account.id}`}>
            <DropdownMenuItem>Update account</DropdownMenuItem>
          </Link>
          {account?.status ? (
            <DropdownMenuItem onClick={() => setDisableAccountOpen(true)}>Disable account</DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setEnableAccountOpen(true)}>Enable account</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
}

type AccountActionMenuProps = {
  row: Row<AccountResponse>;
};

export default AccountActionMenu;
