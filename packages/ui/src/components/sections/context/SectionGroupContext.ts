import { createContext, useContext } from 'react';
import { Table } from 'dexie';
import { SectionItemGroupType, SectionItemType, SectionTableProps } from '../../../db/section-types';

type ItemGroupContextProps = Omit<SectionItemGroupType, 'sections'> &
  SectionTableProps & {
    sections: SectionItemType[];
    addSection?: (name: string) => Promise<void>;
    updateSection?: (id: unknown, section: SectionItemType) => Promise<void>;
    removeSection?: (id: unknown) => Promise<void>;
    toggle?: (expand: boolean) => void;
    sync?: () => void;
    activate?: () => void;
    deactivate?: () => void;
  } & {
    calculateNextDisplayId?: ((removedId: string, table: Table) => string | undefined) | undefined;
  };

export const SectionGroupContext = createContext<ItemGroupContextProps>({ name: '', sections: [] });

export function useSectionGroupContext() {
  return useContext(SectionGroupContext);
}
