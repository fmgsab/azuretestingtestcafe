import { SectionItemGroupType, SectionListsType, SectionTableType, SectionItemTableNameType } from '../../../db/section-types';
import { useLiveQuery } from 'dexie-react-hooks';
import { getAllPromises } from '../../../hooks/useApplicationSubmission';

export function useDisplayStatus(sectionLists: SectionListsType = []) {
  const riskTableNames = sectionLists.find((s) => s.title === 'Risk')?.sectionList.map((s) => s.table?.name);
  const allSections = sectionLists.flatMap((s) => s.sectionList);
  const liveQueryData = useLiveQuery(getAllPromises(allSections));
  const liveData = liveQueryData?.map((table, tableIndex) => {
    return table?.map((t: SectionItemGroupType) => ({ ...t, tableName: allSections[tableIndex].table.name }));
  });

  function calculateDisplayId(removedIdStr: string, table: SectionTableType) {
    const removedId = removedIdStr;
    if (!liveData || !liveData.length) return;

    const item1 = liveData?.[0]?.[0];
    //if (!item1) return;

    const defaultReturn = buildDisplayId('keyInfo', item1?.id);

    if (!removedId) {
      return defaultReturn;
    }

    const tableName = table.name;
    const items = liveData.filter((t) => t?.[0]?.type === tableName).flat();
    const itemPosition = items.findIndex((item) => item.id === removedId);

    if (!(itemPosition > -1)) {
      return defaultReturn;
    }

    // Case 1A not-first of many
    if (itemPosition > 0 && items.length > 1) {
      return buildDisplayId(tableName, items[itemPosition - 1].id);
    }

    // Case 1B first of many
    if (itemPosition === 0 && items.length > 1) {
      return buildDisplayId(tableName, items[itemPosition + 1].id);
    }

    // Case 2 Only item in section
    const allItemsInTabGroup = liveData
      .filter((s) => s?.length && s.some((item: SectionItemTableNameType) => riskTableNames?.includes(item?.tableName)))
      .flat();

    // Case 2A Only item with items above
    const positionInTabGroup = allItemsInTabGroup.findIndex((item) => item.tableName === tableName && item.id === removedId);
    if (items.length === 1 && positionInTabGroup > 0) {
      return buildDisplayId(allItemsInTabGroup[positionInTabGroup - 1].tableName, allItemsInTabGroup[positionInTabGroup - 1].id);
    }

    // Case 2B Only item with no items above but items below
    if (items.length === 1 && allItemsInTabGroup.length > 1) {
      return buildDisplayId(allItemsInTabGroup[positionInTabGroup + 1].tableName, allItemsInTabGroup[positionInTabGroup + 1].id);
    }

    // Case 2C Only item with no items above or below
    return defaultReturn;
  }

  return calculateDisplayId;
}

function buildDisplayId(name: string, index: number | string) {
  return `${name}_${index}`;
}
