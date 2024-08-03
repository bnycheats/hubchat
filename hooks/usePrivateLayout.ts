import { useContext } from 'react';
import { PrivateContext, type PrivateContextValue } from '@/providers/private-provider';

export default function usePrivateLayout() {
  return useContext(PrivateContext) as PrivateContextValue;
}
