'use client';

import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { getApplications } from '@/db/queries/applications';
import Pagination from '@/components/pagination';
import DataTable from '@/components/data-table';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { DEFAULT_SIZE, DEFAULT_PAGE } from '@/constants/data-table';
import { useSearchParams } from 'next/navigation';
import typeOfLeaves from '@/constants/type-of-leaves';
import { StateEnums } from '@/helpers/types';

function ApplicationsDataTable() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get('page')) || DEFAULT_PAGE);
  //   const filters: { userId?: string; status?: string } = JSON.parse(searchParams.get('filters') ?? '{}');

  const { data, isFetching } = useQuery({
    queryKey: ['Applications', page],
    queryFn: () => getApplications(supabase, page, DEFAULT_SIZE),
    placeholderData: (previousData) => previousData,
  });

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
    <div>
      <DataTable
        isLoading={isFetching}
        data={data?.data ?? []}
        columns={[
          {
            header: 'Created',
            accessorKey: 'created_at',
            cell: ({ row }) => format(new Date(row.getValue('created_at')), 'MMM dd yyy H:MM a'),
          },
          {
            header: 'Email',
            accessorKey: 'email',
          },
          {
            header: 'Start date',
            accessorKey: 'start_date',
            cell: ({ row }) => format(new Date(row.getValue('start_date')), 'MMM dd yyy H:MM a'),
          },
          {
            header: 'End date',
            accessorKey: 'end_date',
            cell: ({ row }) => format(new Date(row.getValue('end_date')), 'MMM dd yyy H:MM a'),
          },
          {
            header: 'Type of leave',
            accessorKey: 'type_of_leave',
            cell: ({ row }) => typeOfLeaves.find((item) => item.value === row.getValue('type_of_leave'))?.name,
          },
          {
            header: 'Status',
            accessorKey: 'state',
            cell: ({ row }) => (
              <Badge className="capitalize" size="xs" variant={statusVariant(row.getValue('state'))}>
                {row.getValue('state')}
              </Badge>
            ),
          },
        ]}
      />
      <Pagination
        pageSize={DEFAULT_SIZE}
        totalCount={data?.count ?? 0}
        onPageChange={(page) => {
          setPage(page);
        }}
      />
    </div>
  );
}

export default ApplicationsDataTable;
