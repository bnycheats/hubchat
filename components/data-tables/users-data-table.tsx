'use client';

import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/db/client/queries/auth';
import Pagination from '@/components/pagination';
import DataTable from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import ActionMenu from '../action-menus/user-action-menu';
import { DEFAULT_SIZE, DEFAULT_PAGE } from '@/constants/data-table';
import { useSearchParams } from 'next/navigation';
import { type UserMetadata } from '@/helpers/auth-types';

function UsersDataTable() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get('page')) || DEFAULT_PAGE);

  const { data, isFetching } = useQuery({
    queryKey: ['Users', page],
    queryFn: () => getUsers(page, DEFAULT_SIZE),
    placeholderData: (previousData) => previousData,
  });

  return (
    <div>
      <DataTable
        isLoading={isFetching}
        data={data?.users ?? []}
        columns={[
          {
            header: 'Created',
            accessorKey: 'created_at',
            cell: ({ row }) => format(new Date(row.getValue('created_at')), 'MMM dd yyy H:MM a'),
          },
          {
            header: 'First name',
            accessorFn: (originalRow) => (originalRow.user_metadata as UserMetadata).first_name,
          },
          {
            header: 'Last name',
            accessorFn: (originalRow) => (originalRow.user_metadata as UserMetadata).last_name,
          },
          {
            header: 'Email',
            accessorKey: 'email',
          },
          {
            header: 'Status',
            accessorFn: (originalRow) => (originalRow.user_metadata as UserMetadata).status,
            cell: ({ cell }) => (
              <Badge variant={cell.getValue() ? 'default' : 'destructive'}>
                {cell.getValue() ? 'Active' : 'Disabled'}
              </Badge>
            ),
          },
          {
            header: '',
            accessorKey: 'action',
            cell: ({ row }) => <ActionMenu row={row} />,
          },
        ]}
      />
      <Pagination
        pageSize={DEFAULT_SIZE}
        totalCount={data?.total ?? 0}
        onPageChange={(page) => {
          setPage(page);
        }}
      />
    </div>
  );
}

export default UsersDataTable;
