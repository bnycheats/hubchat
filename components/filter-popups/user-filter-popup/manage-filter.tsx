import { Chips, type FilterItem } from '@/components/chips';
import { type Filters } from './filter-popup';

enum TabsKey {
  'EMAIL' = 'email',
  'STATUS' = 'status',
  'ROLE' = 'role',
}

function ManageFilter(props: ManageFilterProps) {
  const { filters = {}, onChange, showPopover } = props;

  const displayLabel = (key: string, value: string) => {
    switch (key) {
      case TabsKey.EMAIL:
        return value;
      case TabsKey.STATUS:
        return value === 'ACTIVE' ? 'Active' : 'Disabled';
      case TabsKey.ROLE:
        return value.charAt(0).toUpperCase() + value.slice(1);
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
      case TabsKey.EMAIL:
        return TabsKey.EMAIL;
      case TabsKey.STATUS:
        return TabsKey.STATUS;
      case TabsKey.ROLE:
        return TabsKey.ROLE;
      default:
        return TabsKey.EMAIL;
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
