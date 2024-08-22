import { AiOutlineClose } from 'react-icons/ai';

import { Badge } from '@/components/ui/badge';

function Chip(props: ChipProps) {
  const { label, onClick, onClose } = props;
  return (
    <Badge onClick={onClick} size="sm" className="cursor-pointer flex gap-2  text-base font-normal">
      {label}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <AiOutlineClose size="16" className="cursor-pointer text-sm font-bold text-white hover:text-destructive" />
      </button>
    </Badge>
  );
}

type ChipProps = {
  label: string;
  onClick: () => void;
  onClose: () => void;
};

export default Chip;
