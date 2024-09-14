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
import { type ClientResponse } from '@/helpers/client-types';
import ClientInfoSheet from '../sheets/client-info-sheet';
import EnableClientAlert from '../alerts/enable-client-alert';
import DisableClientAlert from '../alerts/disable-client-alert';

function ClientActionMenu(props: ClientActionMenuProps) {
  const { row } = props;
  const [viewClientInfoOpen, setViewClientInfoOpen] = useState(false);
  const [enableClientOpen, setEnableClientOpen] = useState(false);
  const [disableClientOpen, setDisableClientOpen] = useState(false);
  return (
    <Fragment>
      <ClientInfoSheet row={row} open={viewClientInfoOpen} close={() => setViewClientInfoOpen(false)} />
      <EnableClientAlert
        clientId={row.original.id}
        open={enableClientOpen}
        closeAlert={() => setEnableClientOpen(false)}
      />
      <DisableClientAlert
        clientId={row.original.id}
        open={disableClientOpen}
        closeAlert={() => setDisableClientOpen(false)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <AiOutlineEllipsis size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setViewClientInfoOpen(true)}>View client info</DropdownMenuItem>
          <Link href={`/clients/${row.original.id}`}>
            <DropdownMenuItem>Update client</DropdownMenuItem>
          </Link>
          {row.original.status ? (
            <DropdownMenuItem onClick={() => setDisableClientOpen(true)}>Disable client</DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setDisableClientOpen(true)}>Enable client</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
}

type ClientActionMenuProps = {
  row: Row<ClientResponse>;
};

export default ClientActionMenu;
