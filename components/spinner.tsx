import { cn } from '@/lib/utils';

const Spinner = (props: SpinnerProps) => {
  const { className, centered, fullScreen } = props;
  return (
    <div
      className={cn({
        'z-[99999] fixed inset-0 flex h-full w-full items-center justify-center bg-white/30 backdrop-blur-sm': centered,
        'h-screen': fullScreen,
      })}
    >
      <svg
        className={cn('-ml-1 h-16 w-16 animate-spin text-primary', className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

type SpinnerProps = {
  className?: string;
  centered?: boolean;
  fullScreen?: boolean;
};

export default Spinner;
