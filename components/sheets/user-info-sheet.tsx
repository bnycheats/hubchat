import { format } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DialogProps } from '@radix-ui/react-dialog';
import { type Row } from '@tanstack/react-table';
import { type User } from '@supabase/supabase-js';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { type UserMetadata } from '@/helpers/auth-types';
import { Badge } from '@/components/ui/badge';

function UserInfoSheet(props: UserInfoSheetProps) {
  const {
    row: { original: user },
    close,
    ...other
  } = props;
  const userMetaData = user.user_metadata as UserMetadata;
  return (
    <Sheet
      {...other}
      onOpenChange={() => {
        close();
      }}
    >
      <SheetContent className="w-screen !max-w-[500px]">
        <SheetHeader>
          <SheetTitle>View user info</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Created:</TableCell>
                <TableCell>{format(new Date(user.created_at), 'MMM dd yyy H:MM a')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>User UID:</TableCell>
                <TableCell>{user.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Email:</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>First name:</TableCell>
                <TableCell>{userMetaData.first_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Last name:</TableCell>
                <TableCell>{userMetaData.last_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date of birth:</TableCell>
                <TableCell>{userMetaData.dob && format(new Date(userMetaData.dob), 'MMM dd yyy')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Roles:</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {userMetaData.user_role?.map((item, index) => (
                      <Badge key={index} variant="secondary">
                        {item.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Phone number:</TableCell>
                <TableCell>{userMetaData.phone_number}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Postal code:</TableCell>
                <TableCell>{userMetaData.postal_code}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Province:</TableCell>
                <TableCell>{userMetaData.province}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Street:</TableCell>
                <TableCell>{userMetaData.street}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Status:</TableCell>
                <TableCell>
                  {
                    <Badge variant={userMetaData?.status ? 'default' : 'destructive'}>
                      {userMetaData?.status ? 'Active' : 'Disabled'}
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

type UserInfoSheetProps = { row: Row<User>; close: () => void } & DialogProps;

export default UserInfoSheet;
