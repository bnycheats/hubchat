import { Chips, type FilterItem } from '@/components/chips';
import { type Filters } from './filter-popup';

enum TabsKey {
  'NAME' = 'name',
  'USER_ID' = 'userId',
  'STATUS' = 'status',
  'ROLE' = 'role',
  'CURRENCY' = 'currency',
}

function ManageFilter(props: ManageFilterProps) {
  const { filters = {}, onChange, showPopover } = props;

  const displayLabel = (key: string, value: string) => {
    switch (key) {
      case TabsKey.NAME:
      case TabsKey.USER_ID:
      case TabsKey.CURRENCY:
        return value;
      case TabsKey.ROLE:
        return value.toUpperCase();
      case TabsKey.STATUS:
        return value === 'ACTIVE' ? 'Active' : 'Disabled';
      default:
        return '';
    }
  };

  const reduceFilters: Array<FilterItem> = Object.keys(filters).reduce((newVal: Array<FilterItem>, item) => {
    const key = item as keyof Filters;
    const value = filters[key] ?? '';
    return [...newVal, { key, value }];
  }, []);

  const getActiveTab = (key: string) => {
    switch (key) {
      case TabsKey.NAME:
        return TabsKey.NAME;
      case TabsKey.USER_ID:
        return TabsKey.USER_ID;
      case TabsKey.STATUS:
        return TabsKey.STATUS;
      case TabsKey.ROLE:
        return TabsKey.ROLE;
      case TabsKey.CURRENCY:
        return TabsKey.CURRENCY;
      default:
        return TabsKey.USER_ID;
    }
  };

  const handleClick = (key: string) => showPopover(getActiveTab(key));

  const handleClose = (key: string) => {
    const asKey = key as keyof Filters;
    const newFilters = { ...filters };
    delete newFilters[asKey];
    onChange(newFilters);
  };

  return <Chips displayLabel={displayLabel} filters={reduceFilters} onClose={handleClose} onClick={handleClick} />;
}

type ManageFilterProps = {
  filters: Filters;
  showPopover: (activeTab: string) => void;
  onChange: (filters: Filters) => void;
};

export default ManageFilter;
