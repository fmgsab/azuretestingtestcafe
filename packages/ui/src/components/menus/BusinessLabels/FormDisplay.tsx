import { useSectionStatus } from '../../../db/mappers/sections/hooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from 'models/src/@database';

function getDisplayName(id: unknown, table: undefined | { name: string }): string {
  if (!id || !table) {
    return '';
  }

  return `${table?.name}`;
}

export default function FormDisplay() {
  const { selectedSectionId } = useSectionStatus();

  const table = useLiveQuery(async () => {
    const [sectionName, sectionKey] = selectedSectionId && typeof selectedSectionId === 'string' ? selectedSectionId.split('_') : ['', 0];

    if (!sectionName || !(Number(sectionKey) >= 0)) return;

    if (Object.keys(db)?.includes(sectionName)) {
      return db.tables.find((t) => t.name === sectionName)?.get(Number(sectionKey ?? 0));
    }
  }, [selectedSectionId]);

  const display = selectedSectionId === 'summary' ? 'Application Summary' : getDisplayName(selectedSectionId, table);

  return <div className={`flex flex-1 items-center justify-center bg-blue-50`}>{display}</div>;
}
