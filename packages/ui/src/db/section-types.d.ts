import React, { ReactNode } from 'react';
import { Table } from 'dexie';
import { RowKeyType } from '../types';
import { TableAdapter } from './adapters/TableAdapter';

export interface IStatus {
  hasStarted?: boolean;
  hasCompleted?: boolean;
  hasError?: boolean;
}

export interface ISectionItem {
  id?: RowKeyType;
  name?: string;
  isDisabled?: boolean;
  isGroup?: boolean;
  type?: string;
}

export interface ISectionTable {
  name: string;
  table?: SectionTableType;
  uid?: Record<string, unknown>;
  displayNamePath?: string;
  type?: string;
}

export type SectionTableProps = ISectionTable;

export type SectionItemType = ISectionItem & IStatus;
export type SectionItemGroupType = SectionItemType &
  SectionTableProps & {
    isExpanded?: boolean;
    isActive?: boolean;
    sections?: SectionItemType[];
    placeholder?: string | React.ReactNode;
  };

type SectionTableType = Table | TableAdapter;

export interface ISectionStore {
  groups: Record<string, TableAdapter<RowKeyType>>;
  selectedSectionId: unknown;
  jobId: RowKeyType;
  form: string;
}

export type SectionListsType = {
  title: string;
  sectionList: SectionItemGroupType[];
}[];

export type TabsSectionsProps = {
  sectionLists: SectionListsType;
  placeholder: string | ReactNode;
};

export type SectionItemTableNameType = SectionItemType & { tableName: string };
