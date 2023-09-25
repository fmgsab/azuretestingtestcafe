import React from 'react';
import classnames from 'classnames';
import { useSectionStatus, useSectionTable } from '../hooks';
import { SectionItem } from '../SectionItem/SectionItem';
import { SectionTableProps } from '../../../db/section-types';
import { RowKeyType } from '../../../types';

export function SingleSection(props: SectionTableProps) {
  const { selectedSectionId, setSelectedSectionId } = useSectionStatus();
  const table = useSectionTable(props);
  const section = table.sections?.[0];
  const tableName = props?.table?.name ?? null;
  const displayId = getId(tableName, section?.id);

  const isActive = displayId === selectedSectionId;

  const handleOnClick = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    let id: unknown;
    if (!section) {
      const idNumber = await table.addSection?.(`${props.name}`);
      id = getId(tableName, idNumber);
    } else {
      id = displayId;
    }
    setSelectedSectionId(id);
  };

  return (
    <SectionItem
      {...section}
      isActive={isActive}
      title={<span className={classnames({ 'opacity-50': !section?.hasStarted && !isActive })}>{props.name}</span>}
      onClick={handleOnClick}
    />
  );
}

export function getId(tableName: string | null | undefined, id?: RowKeyType) {
  if (tableName && id) {
    return `${tableName}_${id}`;
  }
  if (!tableName && id) {
    return `${id}`;
  }
  if (tableName) {
    return `${tableName}`;
  }
  return '';
}
