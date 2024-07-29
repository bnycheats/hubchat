'use client';

import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/utils/supabase/client/queries/users';
import CustomPagination from '@/components/pagination';
import DataTable from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { type AuthError, type Pagination, type User } from '@supabase/supabase-js';
import { useState } from 'react';
import { DEFAULT_SIZE, DEFAULT_PAGE } from './_constants';

function UsersDataTable(props: UsersDataTableProps) {
  const [page, setPage] = useState(DEFAULT_PAGE);

  const { data, isFetching } = useQuery({
    queryKey: ['Users', page],
    queryFn: () => getUsers({ page, perPage: DEFAULT_SIZE }),
    initialData: props.initialData,
  });

  const {
    data: { users, total },
  } = data as UsersResponse;

  return (
    <div>
      <DataTable
        isLoading={isFetching}
        data={users ?? []}
        columns={[
          {
            header: 'Created at',
            accessorKey: 'created_at',
            cell: ({ row }) => format(new Date(row.getValue('created_at')), 'MMM dd yyy H:MM a'),
          },
          {
            header: 'First name',
            accessorKey: 'user_metadata.first_name',
          },
          {
            header: 'Last name',
            accessorKey: 'user_metadata.last_name',
          },
          {
            header: 'Email',
            accessorKey: 'email',
          },
          {
            header: 'Status',
            accessorKey: 'active',
            cell: ({ row }) => (
              <Badge variant={row.getValue('active') ? 'default' : 'destructive'}>
                {row.getValue('active') ? 'Active' : 'Disabled'}
              </Badge>
            ),
          },
        ]}
      />
      <CustomPagination
        pageSize={DEFAULT_SIZE}
        totalCount={total ?? 0}
        onPageChange={(page) => {
          setPage(page);
        }}
      />
    </div>
  );
}

type UsersResponse = {
  data: {
    users: User[];
    aud: string;
  } & Pagination;
  error: null;
};

type UsersDataTableProps = {
  initialData:
    | UsersResponse
    | {
        data: {
          users: [];
        };
        error: AuthError;
      };
};

export default UsersDataTable;
