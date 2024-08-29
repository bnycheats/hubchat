'use client';

import { useCallback, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card } from '@/components/ui/card';
import { AiOutlineFilter } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSearchParams } from 'next/navigation';
import { ChipsWrapper } from '@/components/chips';
import ManageFilter from './manage-filter';
import removeNestedNullUndefinedEmptyString from '@/utils/removeNestedNullUndefinedEmptyString';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import currencies from '@/constants/currencies';

const STATUS = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Disabled', value: 'DISABLED' },
];

const DEFAULT_ACTIVE_TAB = 'name';
const tab_className = '!shadow-none data-[state=active]:text-primary';

function FilterPopup() {
  const searchParams = useSearchParams();

  const filters = JSON.parse(searchParams.get('filters') ?? '{}') as Filters;

  const [isOpen, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(DEFAULT_ACTIVE_TAB);

  const showPopover = (tab: string) => {
    setOpen(true);
    setActiveTab(tab);
  };

  const onFilterChange = useCallback(
    (newFilters: Filters) => {
      const params = new URLSearchParams(searchParams);
      if (newFilters && Object.keys(removeNestedNullUndefinedEmptyString(newFilters)).length > 0) {
        params.set('page', '1');
        params.set('filters', JSON.stringify(newFilters));
      } else {
        params.delete('filters');
      }
      return window.history.pushState(null, '', `?${params.toString()}`);
    },
    [filters],
  );

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) setActiveTab(DEFAULT_ACTIVE_TAB);
      }}
    >
      <ChipsWrapper>
        <PopoverTrigger asChild>
          <Button className="rounded-full" variant="secondary" size="sm">
            <AiOutlineFilter /> Add Filter
          </Button>
        </PopoverTrigger>
        <ManageFilter filters={filters} showPopover={showPopover} onChange={(filters) => onFilterChange(filters)} />
      </ChipsWrapper>
      <PopoverContent className="p-0" asChild align="start">
        <Card className="w-screen px-0 py-4 min-[450px]:max-w-[450px]">
          <Tabs defaultValue={activeTab} className="flex">
            <TabsList className="flex rounded-none justify-start border-r flex-col h-auto bg-transparent">
              <TabsTrigger className={tab_className} value="company_name">
                Company name
              </TabsTrigger>
              <TabsTrigger className={tab_className} value="owner_name">
                Owner name
              </TabsTrigger>
              <TabsTrigger className={tab_className} value="status">
                Status
              </TabsTrigger>
              <TabsTrigger className={tab_className} value="currency">
                Currency
              </TabsTrigger>
            </TabsList>
            <div className="px-4 w-full">
              <TabsContent value="company_name">
                <Input
                  defaultValue={filters?.company_name ?? ''}
                  placeholder="Enter a company name"
                  onBlur={(event) => onFilterChange({ ...filters, company_name: event.target.value })}
                />
              </TabsContent>
              <TabsContent value="owner_name">
                <Input
                  defaultValue={filters?.owner_name ?? ''}
                  placeholder="Enter a owner name"
                  onBlur={(event) => onFilterChange({ ...filters, owner_name: event.target.value })}
                />
              </TabsContent>
              <TabsContent value="status">
                <RadioGroup
                  onValueChange={(status) => onFilterChange({ ...filters, status })}
                  defaultValue={filters?.status ?? STATUS[0].value}
                >
                  {STATUS.map((item, index) => (
                    <div className="flex items-center space-x-2" key={index}>
                      <RadioGroupItem value={item.value} id={`r-${index}`} />
                      <Label htmlFor={`r-${index}`}>{item.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </TabsContent>
              <TabsContent value="currency">
                <Select
                  defaultValue={filters?.currency}
                  onValueChange={(currency) => onFilterChange({ ...filters, currency })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(currencies).map((item, index) => (
                      <SelectItem key={index} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

export type Filters = {
  company_name?: string;
  owner_name?: string;
  status?: string;
  currency?: string;
};

export default FilterPopup;
