import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { OptionProps } from '../types/input-types';
import { UseScopeProps, UseScopeReturn } from '../types/form-types';

export type ScopeContextProps = Partial<UseScopeProps> &
  Partial<UseScopeReturn> & {
    source: string;
    highlight: boolean;
    inline: boolean;
    isExpanded?: boolean;
    isEnabled?: boolean;
    setIsExpanded?: Dispatch<SetStateAction<boolean>>;
    registerTarget?: (targetId: string, isVisible: boolean) => void;
    hasVisibleTarget?: () => boolean;
    options?: OptionProps[];
  };

export const ScopeContext = createContext<ScopeContextProps>({
  highlight: false,
  inline: false,
  isEnabled: true,
  source: '',
});

export function useScopeContext() {
  return useContext(ScopeContext);
}
