'use client';

import { useEffect, useRef } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Logo from '@/assets/logo.svg';
import Image from 'next/image';
import Menu, { type MenuModelType } from './menu';
import usePrivateLayout from '@/hooks/usePrivateLayout';
import { usePathname } from 'next/navigation';

function Sidebar(props: SidebarProps) {
  const sidebar = useRef<any>(null);
  const trigger = useRef<any>(null);
  const pathname = usePathname();
  const { model } = props;

  const { setSidebarOpen, sidebarOpen } = usePrivateLayout();

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== 'Escape') return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  //close Sidebar menu if pathname change//
  useEffect(() => {
    if (sidebarOpen) setSidebarOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <aside
      ref={sidebar}
      className={cn(
        'absolute top-0 z-50 flex h-screen w-56 flex-col overflow-y-hidden border-r bg-slate-50 duration-300 ease-linear lg:static lg:translate-x-0',
        {
          'left-0 translate-x-0': sidebarOpen,
          '-translate-x-full': !sidebarOpen,
        },
      )}
    >
      <div className="py-5.5 lg:py-6.5 flex items-center justify-between gap-2 px-6">
        <div className="mx-auto my-4 w-3/5">
          <Link href="/">
            <Image src={Logo} width={150} height={150} alt="Logo" />
          </Link>
        </div>
        <button
          ref={trigger}
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
          }}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <AiOutlineArrowLeft />
        </button>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
        <Menu model={model} />
      </div>
    </aside>
  );
}

type SidebarProps = {
  model: MenuModelType[];
};

export default Sidebar;
