import { SectionItemType, SectionTableType } from '../../../db/section-types';
import { RowKeyType } from '../../../types';
import { v4 } from 'uuid';
import dayjs from 'dayjs';

/*
 * These functions makes changes to the db from Storybook controls.
 */
export default function multiSectionResolver({
  status,
  table,
  tableKey,
}: {
  status: string;
  table: SectionTableType;
  tableKey: RowKeyType;
}) {
  table.updateSection(tableKey, { ...resolveStatus(status) }).then();
}

export const resolveStatus = (status: string) => {
  switch (status) {
    case 'incomplete':
      return { hasStarted: true, hasCompleted: false, hasError: false };
    case 'complete':
      return { hasStarted: true, hasCompleted: true, hasError: false };
    case 'invalid':
      return { hasStarted: true, hasCompleted: false, hasError: true };
    case 'not started':
    default:
      return { hasStarted: false, hasCompleted: false, hasError: false };
  }
};

export async function sectionBulkModify(table: SectionTableType, setCount: string, section: SectionItemType & SectionTableType) {
  if (setCount === 'current') return;

  const itemCount = parseInt(setCount);
  const currentItems = await section.table.where(section.uid).toArray();
  const itemsDifference = itemCount - currentItems.length;
  if (itemsDifference > 0) {
    const newItems = [];
    for (let i = 0; i < itemsDifference; i++) {
      newItems.push({
        ...section.uid,
        id: v4(),
        name: `${section.name} ${currentItems.length + i + 1}`,
        hasStarted: false,
        hasCompleted: false,
        hasError: false,
        created: dayjs().add(i, 'millisecond').toISOString(),
      });
    }
    section.table.bulkAdd(newItems).finally();
  }

  if (setCount === '1') {
    const keysOfItemsToDelete = [];
    for (let i = 1; i < currentItems.length; i++) {
      keysOfItemsToDelete.push(currentItems[i].id);
    }
    section.table.bulkDelete(keysOfItemsToDelete).finally();
  }
}
