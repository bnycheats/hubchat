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
import { type ApplicationResponse } from '@/helpers/application-types';
import ApplicationInfoSheet from '../sheets/application-info-sheet';
import ApproveLeaveAlert from '../alerts/approve-leave-alert';
import RejectLeaveAlert from '../alerts/reject-leave-alert';
import { StateEnums } from '@/helpers/types';

function ApplicationActionMenu(props: ApplicationActionMenuProps) {
  const { row } = props;
  const [viewCompanyInfoOpen, setViewCompanyInfoOpen] = useState(false);
  const [approveLeaveOpen, setApproveLeaveOpen] = useState(false);
  const [rejectLeaveOpen, setRejectLeaveOpen] = useState(false);
  return (
    <Fragment>
      <ApplicationInfoSheet row={row} open={viewCompanyInfoOpen} close={() => setViewCompanyInfoOpen(false)} />
      <ApproveLeaveAlert
        applicationId={row.original.id}
        open={approveLeaveOpen}
        closeAlert={() => setApproveLeaveOpen(false)}
      />
      <RejectLeaveAlert
        applicationId={row.original.id}
        open={rejectLeaveOpen}
        closeAlert={() => setRejectLeaveOpen(false)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <AiOutlineEllipsis size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setViewCompanyInfoOpen(true)}>View application info</DropdownMenuItem>
          {row.original.state === StateEnums.PENDING && (
            <Fragment>
              <DropdownMenuItem onClick={() => setApproveLeaveOpen(true)}>Approve</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRejectLeaveOpen(true)}>Reject</DropdownMenuItem>
            </Fragment>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
}

type ApplicationActionMenuProps = {
  row: Row<ApplicationResponse>;
};

export default ApplicationActionMenu;
