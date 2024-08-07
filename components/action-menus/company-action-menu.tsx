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
import { type CompanyResponse } from '@/helpers/company-types';
import CompanyInfoSheet from '../sheets/company-info-sheet';
import EnableCompanyAlert from '../alerts/enable-company-alert';
import DisableCompanyAlert from '../alerts/disable-company-alert';

function CompanyActionMenu(props: CompanyActionMenuProps) {
  const { row } = props;
  const [viewCompanyInfoOpen, setViewCompanyInfoOpen] = useState(false);
  const [enableCompanyOpen, setEnableCompanyOpen] = useState(false);
  const [disableCompanyOpen, setDisableCompanyOpen] = useState(false);
  return (
    <Fragment>
      <CompanyInfoSheet row={row} open={viewCompanyInfoOpen} close={() => setViewCompanyInfoOpen(false)} />
      <EnableCompanyAlert
        companyId={row.original.id}
        open={enableCompanyOpen}
        closeAlert={() => setEnableCompanyOpen(false)}
      />
      <DisableCompanyAlert
        companyId={row.original.id}
        open={disableCompanyOpen}
        closeAlert={() => setDisableCompanyOpen(false)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <AiOutlineEllipsis size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setViewCompanyInfoOpen(true)}>View company info</DropdownMenuItem>
          <Link href={`/companies/${row.original.id}`}>
            <DropdownMenuItem>Update company</DropdownMenuItem>
          </Link>
          {row.original.status ? (
            <DropdownMenuItem onClick={() => setDisableCompanyOpen(true)}>Disable company</DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setEnableCompanyOpen(true)}>Enable company</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
}

type CompanyActionMenuProps = {
  row: Row<CompanyResponse>;
};

export default CompanyActionMenu;
