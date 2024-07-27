import { Fragment, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Transition } from 'react-transition-group';

import { cn } from '@/lib/utils';
import MenuItemGroup from './menu-item-group';
import SubMenu, { type SubMenuType } from './sub-menu';

const transitionClasses = {
  entering: 'max-h-0 opacity-0',
  entered: 'max-h-230 opacity-100',
  exiting: 'max-h-0 opacity-0',
  exited: 'max-h-0 opacity-0',
  unmounted: '',
};

function MenuItem(props: MenuItemProps) {
  const { hidden, to, label, itemKey, icon, children } = props;

  const nodeRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  if (hidden) return null;

  if ('children' in props) {
    const isActive =
      pathname === to || pathname.includes(itemKey) || !!children?.some((item) => pathname.includes(item?.to ?? ''));

    return (
      <MenuItemGroup active={isActive}>
        {(handleClick, open) => {
          return (
            <Fragment>
              <Link
                href="#"
                className={cn(
                  'group relative flex items-center justify-between rounded-sm px-4 py-2 duration-300 ease-in-out hover:bg-slate-100',
                )}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick();
                }}
              >
                <div className="flex items-center gap-2.5">
                  {icon && icon}
                  {label}
                </div>
                <svg
                  className={cn('fill-current transition-all duration-200', {
                    'rotate-180': open,
                  })}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                    fill=""
                  />
                </svg>
              </Link>
              {children && (
                <Transition
                  nodeRef={nodeRef}
                  in={open}
                  timeout={{
                    appear: 0,
                    enter: 0,
                    exit: 200,
                  }}
                  unmountOnExit
                >
                  {(state) => (
                    <div
                      ref={nodeRef}
                      className={cn(
                        'translate transform overflow-hidden transition-all duration-200',
                        transitionClasses[state],
                      )}
                    >
                      <SubMenu items={children} />
                    </div>
                  )}
                </Transition>
              )}
            </Fragment>
          );
        }}
      </MenuItemGroup>
    );
  }

  return (
    <Link
      href={to ?? '#'}
      className={cn(
        'group relative flex items-center gap-2.5 rounded-sm px-4 py-2 duration-300 ease-in-out hover:bg-slate-100',
        {
          'bg-slate-100 font-medium': pathname?.includes(itemKey),
        },
      )}
      onClick={(e) => {
        if (to === pathname) e.preventDefault();
      }}
    >
      {icon && icon}
      {label}
    </Link>
  );
}

export type MenuItemProps = {
  hidden?: boolean;
  itemKey: string;
  to?: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: SubMenuType[];
};

export default MenuItem;
