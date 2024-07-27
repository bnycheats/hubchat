import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AiOutlineInfoCircle } from 'react-icons/ai';

function TooltipInfo(props: TooltipInfoProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger>
          <AiOutlineInfoCircle size="18" />
        </TooltipTrigger>
        <TooltipContent>{props.infoText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

type TooltipInfoProps = {
  infoText: string;
};

export default TooltipInfo;
