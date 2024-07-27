'use client';

import MenuItem, { type MenuItemProps } from './menu-item';

function Menu(props: MenuProps) {
  return (
    <nav className="mt-4 px-2">
      {props.model.map((item, index) => (
        <div key={index}>
          {item.label && <h3 className="mb-4 ml-4 text-sm font-semibold">{item.label}</h3>}
          {
            <ul className="mb-6 flex flex-col gap-0.5">
              {item.items.map((mItem, mIndex) => (
                <li key={mIndex}>
                  <MenuItem {...mItem} />
                </li>
              ))}
            </ul>
          }
        </div>
      ))}
    </nav>
  );
}

export type MenuModelType = {
  label?: React.ReactNode;
  items: MenuItemProps[];
};

type MenuProps = {
  model: MenuModelType[];
};

export default Menu;
