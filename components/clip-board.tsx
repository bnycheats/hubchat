import { useState } from 'react';
import { cn } from '@/lib/utils';
import { IconContext } from 'react-icons';
import { AiOutlineCheck, AiOutlineCopy } from 'react-icons/ai';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function Clipboard(props: ClipboardProps) {
  const { value, children, className } = props;
  const [isCopied, setCopied] = useState(false);
  return (
    <IconContext.Provider value={{ className: 'fill-current text-xl' }}>
      <div className={cn('flex items-center gap-1', className)}>
        {children}
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger
              className="flex items-center"
              type="button"
              onClick={() => {
                const el = document.createElement('textarea');
                el.value = value?.toString() || '';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            >
              {isCopied ? <AiOutlineCheck className="text-green-500" /> : <AiOutlineCopy className="text-primary" />}
            </TooltipTrigger>
            <TooltipContent>Click to copy</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </IconContext.Provider>
  );
}

type ClipboardProps = { value: string } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export default Clipboard;
