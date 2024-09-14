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
import RejectLeaveModal from '../modals/reject-leave-modal';
import { StateEnums } from '@/helpers/types';

function ApplicationActionMenu(props: ApplicationActionMenuProps) {
  const { row } = props;
  const [viewLeaveInfoOpen, setViewLeaveInfoOpen] = useState(false);
  const [approveLeaveOpen, setApproveLeaveOpen] = useState(false);
  const [rejectLeaveOpen, setRejectLeaveOpen] = useState(false);
  return (
    <Fragment>
      <ApplicationInfoSheet row={row} open={viewLeaveInfoOpen} close={() => setViewLeaveInfoOpen(false)} />
      <ApproveLeaveAlert
        applicationId={row.original.id}
        open={approveLeaveOpen}
        closeAlert={() => setApproveLeaveOpen(false)}
      />
      <RejectLeaveModal
        applicationId={row.original.id}
        open={rejectLeaveOpen}
        closeModal={() => setRejectLeaveOpen(false)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <AiOutlineEllipsis size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setViewLeaveInfoOpen(true)}>View application info</DropdownMenuItem>
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
