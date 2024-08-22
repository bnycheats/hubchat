import { Fragment } from 'react';

import Chip from './chip';

function Chips(props: ChipsProps) {
  const { filters, displayLabel, onClick, onClose } = props;

  if (!filters || filters.length === 0) {
    return (
      <Fragment>
        <Divider />
        <span>No filters applied</span>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Divider />
      {filters.map((item, index) => {
        const label = displayLabel(item.key, item.value);
        if (!label) return;
        return <Chip key={index} label={label} onClick={() => onClick(item.key)} onClose={() => onClose(item.key)} />;
      })}
    </Fragment>
  );
}

function Divider() {
  return <div className="h-7 w-[1px] bg-slate-300" />;
}

export type FilterItem = {
  key: string;
  value: any;
};

type ChipsProps = {
  filters: Array<FilterItem>;
  displayLabel: (key: string, value: any) => string;
  onClick: (key: string) => void;
  onClose: (key: string) => void;
};

export default Chips;
