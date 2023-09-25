import { createContext, useContext } from 'react';

export type PageContextProps = {
  heights: string[];
};

export const PageContext = createContext<PageContextProps>({
  heights: [],
});

export const usePageContext = () => useContext(PageContext);
