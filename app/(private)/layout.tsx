import { type PropsWithChildren } from 'react';
import { AiOutlineAppstore, AiOutlineTeam, AiOutlineCalendar } from 'react-icons/ai';

import Header from '@/components/header';
import { type MenuModelType } from '@/components/menu';
import Sidebar from '@/components/sidebar';
import PrivateProvider from '@/providers/private-provider';
import { HeaderDropdown } from '@/components/header';

/**
 * The Layout is needed to specify the page title and meta tags.
 */
export default function PrivateLayout({ children }: PropsWithChildren) {
  return (
    <PrivateProvider>
      <section className="flex h-screen overflow-hidden">
        <Sidebar model={getMenus()} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header>
            <HeaderDropdown />
          </Header>
          <main>
            <div className="container py-4">{children}</div>
          </main>
        </div>
      </section>
    </PrivateProvider>
  );
}

function getMenus(): MenuModelType[] {
  return [
    {
      label: 'MENU',
      items: [
        {
          itemKey: 'dashboard',
          to: '/dashboard',
          label: 'Dashboard',
          icon: <AiOutlineAppstore />,
        },
        {
          itemKey: 'users',
          to: '/users',
          label: 'Users',
          icon: <AiOutlineTeam />,
        },
        {
          itemKey: 'accounts',
          to: '/accounts',
          label: 'Accounts',
          icon: <AiOutlineTeam />,
        },
        {
          itemKey: 'clients',
          to: '/clients',
          label: 'Clients',
          icon: <AiOutlineTeam />,
        },
        {
          itemKey: 'applications',
          to: '/applications',
          label: 'Applications',
          icon: <AiOutlineCalendar />,
        },
      ],
    },
  ];
}
