import { format } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DialogProps } from '@radix-ui/react-dialog';
import { type Row } from '@tanstack/react-table';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ApplicationResponse } from '@/helpers/application-types';
import { StateEnums } from '@/helpers/types';

function ApplicationInfoSheet(props: ApplicationInfoSheetProps) {
  const {
    row: { original: application },
    close,
    ...other
  } = props;

  const statusVariant = (state: StateEnums) => {
    switch (state) {
      case StateEnums.APPROVED:
        return 'success';
      case StateEnums.PENDING:
        return 'warning';
      case StateEnums.REJECTED:
        return 'destructive';
    }
  };

  return (
    <Sheet
      {...other}
      onOpenChange={() => {
        close();
      }}
    >
      <SheetContent className="w-screen !max-w-[500px]">
        <SheetHeader>
          <SheetTitle>View application info</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Created:</TableCell>
                <TableCell>{format(new Date(application.created_at), 'MMM dd yyy h:mm a')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Application UID:</TableCell>
                <TableCell>{application.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Email:</TableCell>
                <TableCell>{application.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Start date:</TableCell>
                <TableCell>{format(new Date(application.start_date), 'MMM dd yyy h:mm a')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>End date:</TableCell>
                <TableCell>{format(new Date(application.end_date), 'MMM dd yyy h:mm a')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type of leave:</TableCell>
                <TableCell className="capitalize">{application.type_of_leave}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Other:</TableCell>
                <TableCell>{application.other}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Certificate:</TableCell>
                <TableCell>
                  <a href={application.file_path ?? ''}>{application.file_path}</a>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Reason:</TableCell>
                <TableCell>{application.reason}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Status:</TableCell>
                <TableCell>
                  {
                    <Badge className="capitalize" size="xs" variant={statusVariant(application.state)}>
                      {application.state}
                    </Badge>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Reject reason:</TableCell>
                <TableCell>{application.reject_reason}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  );
}

type ApplicationInfoSheetProps = { row: Row<ApplicationResponse>; close: () => void } & DialogProps;

export default ApplicationInfoSheet;
