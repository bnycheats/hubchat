import { format } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DialogProps } from '@radix-ui/react-dialog';
import { type Row } from '@tanstack/react-table';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AccountResponse } from '@/helpers/account-types';
import convertCentsToAmount from '@/utils/convertCentsToAmount';

function AccountInfoSheet(props: AccountInfoSheetProps) {
  const {
    row: { original: account },
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
          <SheetTitle>View account info</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Created:</TableCell>
                <TableCell>{format(new Date(account.created_at), 'MMM dd yyy H:MM a')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Updated:</TableCell>
                <TableCell>{format(new Date(account.updated_at), 'MMM dd yyy H:MM a')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Account UID:</TableCell>
                <TableCell>{account.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Account name:</TableCell>
                <TableCell>{account.account_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Currency:</TableCell>
                <TableCell>{account.currency}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Commission rate:</TableCell>
                <TableCell>{account.commission_rate}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Expenses rate:</TableCell>
                <TableCell>{account.expenses_rate}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Per month rate:</TableCell>
                <TableCell>{convertCentsToAmount(account.per_month_rate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Per day rate:</TableCell>
                <TableCell>{convertCentsToAmount(account.per_day_rate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Per hour rate:</TableCell>
                <TableCell>{convertCentsToAmount(account.per_hour_rate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Per hour rate:</TableCell>
                <TableCell>{convertCentsToAmount(account.per_hour_rate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Role:</TableCell>
                <TableCell>
                  <Badge size="xs" variant="secondary">
                    {account.role.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Status:</TableCell>
                <TableCell>
                  {
                    <Badge size="xs" variant={account.status ? 'default' : 'destructive'}>
                      {account.status ? 'Active' : 'Disabled'}
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

type AccountInfoSheetProps = { row: Row<AccountResponse>; close: () => void } & DialogProps;

export default AccountInfoSheet;
