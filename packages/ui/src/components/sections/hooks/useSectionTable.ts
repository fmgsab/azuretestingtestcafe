import { v4 } from 'uuid';
import { useWatchSections } from '../../../db/mappers/sections/hooks';
import { SectionItemType, SectionTableProps } from '../../../db/section-types';

/**
 * Hook that stores child sections statuses
 */
export function useSectionTable({ name, ...props }: SectionTableProps) {
  const { result, table } = useWatchSections<SectionItemType>({ name, ...props });

  const addSection = async (passedName = '') => {
    const record = { ...props.uid, name: passedName, hasStarted: false };
    const id = v4();
    const date = new Date().toISOString();
    return table.add({ ...record, id, created: date, updated: date });
  };

  const updateSection = async (id: unknown, section: SectionItemType) => {
    await table.update(id, section);
  };

  const removeSection = async (id: unknown) => {
    await table.delete(id);
  };

  return {
    addSection,
    updateSection,
    removeSection,
    sections: result,
    table,
  };
}
