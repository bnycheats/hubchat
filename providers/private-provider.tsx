'use client';

import { Dispatch, PropsWithChildren, SetStateAction, createContext, useState } from 'react';

export type PrivateContextValue = {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

export const PrivateContext = createContext<PrivateContextValue>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
});

export function PrivateProvider(props: PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <PrivateContext.Provider value={{ sidebarOpen, setSidebarOpen }}>{props.children}</PrivateContext.Provider>;
}

export default PrivateProvider;
