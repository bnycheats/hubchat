import { format } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DialogProps } from '@radix-ui/react-dialog';
import { type Row } from '@tanstack/react-table';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { type CompanyResponse } from '@/helpers/company-types';
import convertCentsToAmount from '@/utils/convertCentsToAmount';

function CompanyInfoSheet(props: CompanyInfoSheetProps) {
  const {
    row: { original: company },
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
          <SheetTitle>View company info</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Created:</TableCell>
                <TableCell>{format(new Date(company.created_at), 'MMM dd yyy h:mm a')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Updated:</TableCell>
                <TableCell>{format(new Date(company.updated_at), 'MMM dd yyy h:mm a')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Company UID:</TableCell>
                <TableCell>{company.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Company name:</TableCell>
                <TableCell>{company.company_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Owner name:</TableCell>
                <TableCell>{company.owner_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Currency:</TableCell>
                <TableCell>{company.currency}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Commission rate:</TableCell>
                <TableCell>{company.commission_rate}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Expenses rate:</TableCell>
                <TableCell>{company.expenses_rate}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Per month rate:</TableCell>
                <TableCell>{convertCentsToAmount(company.per_month_rate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Per day rate:</TableCell>
                <TableCell>{convertCentsToAmount(company.per_day_rate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Per hour rate:</TableCell>
                <TableCell>{convertCentsToAmount(company.per_hour_rate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Status:</TableCell>
                <TableCell>
                  {
                    <Badge size="xs" variant={company.status ? 'success' : 'destructive'}>
                      {company.status ? 'Active' : 'Disabled'}
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

type CompanyInfoSheetProps = { row: Row<CompanyResponse>; close: () => void } & DialogProps;

export default CompanyInfoSheet;
