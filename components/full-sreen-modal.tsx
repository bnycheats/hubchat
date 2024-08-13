'use client';

import { PropsWithChildren } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

function FullScreenModal(props: FullScreenModalProps) {
  const { path, children } = props;
  const { push } = useRouter();
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <Button
        onClick={() => push(path)}
        className="absolute hover:text-destructive rounded-full text-gray-400 right-10 top-10"
        variant="ghost"
        size="icon"
      >
        <AiOutlineClose size="24" />
      </Button>
      <div className="mx-auto mt-16 max-w-[800px]">{children}</div>
    </div>
  );
}

type FullScreenModalProps = {
  path: string;
} & PropsWithChildren;

export default FullScreenModal;
