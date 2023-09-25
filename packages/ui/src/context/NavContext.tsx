import { createContext, useContext } from 'react';

export type NavContextProps = {
  push: (sectionId: string) => void;
  replace: (sectionId: string) => void;
  fid?: string | string[];
  shouldConfirm: boolean;
  openConfirmation: (callback: () => void) => void;
  onConfirm: () => void;
};

export const NavContext = createContext<NavContextProps>({
  onConfirm: () => {
    return;
  },
  push: () => {
    return;
  },
  replace: () => {
    return;
  },
  openConfirmation: () => {
    return;
  },
  shouldConfirm: false,
});
export const useNavContext = () => useContext(NavContext);
