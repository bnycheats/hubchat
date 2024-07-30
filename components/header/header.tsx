'use client';

import { AiOutlineMenu } from 'react-icons/ai';
import Link from 'next/link';
import Logo from '@/assets/logo.svg';
import Image from 'next/image';
import usePrivateLayout from '@/hooks/usePrivateLayout';
import { PropsWithChildren } from 'react';

function Header(props: PropsWithChildren) {
  const { setSidebarOpen, sidebarOpen } = usePrivateLayout();
  return (
    <header className="sticky bg-white top-0 z-40 flex w-full border-b">
      <div className="mx-auto flex max-w-[968px] flex-grow items-center justify-between px-2 py-4">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="block rounded-sm border p-1.5 shadow-sm lg:hidden"
          >
            <AiOutlineMenu />
          </button>
          <Link className="lg:hidden" href="/">
            <Image src={Logo} width={150} height={150} alt="Logo" />
          </Link>
        </div>
        <div className="hidden sm:block"></div>
        <div className="flex items-center gap-3">{props.children}</div>
      </div>
    </header>
  );
}

export default Header;
