import { format } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DialogProps } from '@radix-ui/react-dialog';
import { type Row } from '@tanstack/react-table';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { type ClientResponse } from '@/helpers/client-types';
import convertCentsToAmount from '@/utils/convertCentsToAmount';

function ClientInfoSheet(props: ClientInfoSheetProps) {
  const {
    row: { original: client },
    close,
    ...other
  } = props;
  return (
    <Sheet
      {...other}
      onOpenChange={() => {
        close();
      }}
    >
      <SheetContent className="w-screen !max-w-[500px]">
        <SheetHeader>
          <SheetTitle>View client info</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Created:</TableCell>
                <TableCell>{format(new Date(client.created_at), 'MMM dd yyy h:mm a')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Updated:</TableCell>
                <TableCell>{format(new Date(client.updated_at), 'MMM dd yyy h:mm a')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Client UID:</TableCell>
                <TableCell>{client.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Company name:</TableCell>
                <TableCell>{client.company_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Owner name:</TableCell>
                <TableCell>{client.owner_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Currency:</TableCell>
                <TableCell>{client.currency}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Commission rate:</TableCell>
                <TableCell>{client.commission_rate}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Expenses rate:</TableCell>
                <TableCell>{client.expenses_rate}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Per month rate:</TableCell>
                <TableCell>{convertCentsToAmount(client.per_month_rate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Per day rate:</TableCell>
                <TableCell>{convertCentsToAmount(client.per_day_rate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Per hour rate:</TableCell>
                <TableCell>{convertCentsToAmount(client.per_hour_rate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Status:</TableCell>
                <TableCell>
                  {
                    <Badge size="xs" variant={client.status ? 'success' : 'destructive'}>
                      {client.status ? 'Active' : 'Disabled'}
                    </Badge>
                  }
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  );
}

type ClientInfoSheetProps = { row: Row<ClientResponse>; close: () => void } & DialogProps;

export default ClientInfoSheet;
