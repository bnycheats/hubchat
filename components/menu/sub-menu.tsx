import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

function SubMenu(props: SubMenuProps) {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col gap-0.5 pl-6">
      {props.items.map((item, index) => (
        <li key={index}>
          <Link
            href={item.to ?? '#'}
            className={cn(
              'group relative flex items-center justify-between rounded-sm px-4 py-2 duration-300 ease-in-out hover:bg-slate-100',
              {
                'bg-slate-100 font-medium': pathname === item.to,
              },
            )}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export type SubMenuType = {
  to?: string;
  label: React.ReactNode;
};

export type SubMenuProps = {
  items: SubMenuType[];
};

export default SubMenu;
