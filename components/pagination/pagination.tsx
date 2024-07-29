'use client';

import { cn } from '@/lib/utils';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

import usePagination, { DOTS } from './usePagination';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useEffect } from 'react';

function CustomPagination(props: CustomPaginationProps) {
  const { onPageChange, totalCount, siblingCount = 1, pageSize } = props;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const currentPage = Number(searchParams.get('page')) || 1;

  const pages = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return push(`${pathname}?${params.toString()}`);
  };

  const onNext = () => {
    const pageNumber = currentPage + 1;
    createPageURL(pageNumber);
  };

  const onPrevious = () => {
    const pageNumber = currentPage - 1;
    createPageURL(pageNumber);
  };

  const lastPage = pages && pages[pages.length - 1];

  useEffect(() => {
    if (currentPage) {
      onPageChange(currentPage);
    }
  }, [currentPage, onPageChange]);

  if (currentPage === 0 || (pages && pages?.length < 2)) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem
          className={cn({
            'pointer-events-none opacity-50 cursor-not-allowed': currentPage === 1,
          })}
        >
          <PaginationPrevious onClick={onPrevious} />
        </PaginationItem>

        {pages?.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <PaginationItem key={`${pageNumber}-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return (
            <PaginationItem key={`${pageNumber}-${index}`}>
              <PaginationLink
                isActive={pageNumber === currentPage}
                onClick={() => {
                  createPageURL(pageNumber);
                }}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem
          className={cn({
            'pointer-events-none cursor-not-allowed opacity-50': currentPage === lastPage,
          })}
        >
          <PaginationNext onClick={onNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

type CustomPaginationProps = {
  onPageChange: (currentPage: number) => void;
  totalCount: number;
  siblingCount?: number;
  pageSize: number;
};

export default CustomPagination;
