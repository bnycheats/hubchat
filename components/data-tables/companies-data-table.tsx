'use client';

import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { getCompanies } from '@/db/queries/companies';
import Pagination from '@/components/pagination';
import DataTable from '@/components/data-table';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { DEFAULT_SIZE, DEFAULT_PAGE } from '@/constants/data-table';
import { useSearchParams } from 'next/navigation';
import ActionMenu from '../action-menus/company-action-menu';

function CompaniesDataTable() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get('page')) || DEFAULT_PAGE);

  const { data, isFetching } = useQuery({
    queryKey: ['Companies', page],
    queryFn: () => getCompanies(supabase, page, DEFAULT_SIZE),
    placeholderData: (previousData) => previousData,
  });

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
            header: 'Updated',
            accessorKey: 'updated_at',
            cell: ({ row }) => format(new Date(row.getValue('updated_at')), 'MMM dd yyy H:MM a'),
          },
          {
            header: 'Company name',
            accessorKey: 'company_name',
          },
          {
            header: 'Owner name',
            accessorKey: 'owner_name',
          },
          {
            header: 'Currency',
            accessorKey: 'currency',
          },
          {
            header: 'Status',
            accessorKey: 'status',
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
        totalCount={data?.count ?? 0}
        onPageChange={(page) => {
          setPage(page);
        }}
      />
    </div>
  );
}

export default CompaniesDataTable;
