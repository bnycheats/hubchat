import { ReactNode, useState } from 'react';

function MenuItemGroup(props: MenuItemGroupProps) {
  const { children, active } = props;
  const [open, setOpen] = useState<boolean>(active);

  const handleClick = () => {
    setOpen(!open);
  };

  return children(handleClick, open);
}

type MenuItemGroupProps = {
  children: (handleClick: () => void, open: boolean) => ReactNode;
  active: boolean;
};

export default MenuItemGroup;
