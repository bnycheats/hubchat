import { useContext } from 'react';
import { PrivateContext, type PrivateContextValue } from '@/context/private-provider';

export default function usePrivateLayout() {
  return useContext(PrivateContext) as PrivateContextValue;
}
