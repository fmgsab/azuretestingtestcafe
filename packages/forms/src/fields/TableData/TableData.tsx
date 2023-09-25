import React, { useEffect, useState } from 'react';
import { db } from 'models';
import { OptionsViewer } from '../shared/OptionsViewer/OptionsViewer';
import { AbstractFieldProps } from '../fields';
import { FieldProps } from '@fmg/ui';

export type Data = {
  [key: string]: string | number | boolean | undefined | null;
};

export type TableSearchArgs = {
  tableName: string;
  mapper?: (data: Data) => object | string | number | boolean | undefined | null;
  searchCriteria?: object;
};

export function TableData({
  tableSearchArgs,
  name,
  question,
  size = 10,
  required = true,
  as = 'list',
  ...props
}: AbstractFieldProps &
  Partial<FieldProps> & {
    tableSearchArgs: TableSearchArgs[];
  }) {
  const options = useTableData(tableSearchArgs);

  return (
    <OptionsViewer
      {...props}
      data-testid={`options-${name}`}
      name={name}
      question={question}
      options={options.filter(({ label }: any) => Boolean(label))}
      required={required}
      size={size}
      as={as}
    />
  );
}

export function useTableData(tableSearchArgs: TableSearchArgs[]) {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    getTableData(tableSearchArgs).then((data) => {
      setOptions(data);
    });
  }, []);

  return options;
}

export async function getTableData(tableSearchArgs: TableSearchArgs[]) {
  const dataArray: string[] = [];

  for (let index = 0; index < tableSearchArgs.length; index++) {
    const { tableName, searchCriteria, mapper } = tableSearchArgs[index];
    const table = db.tables.find((t) => t.name === tableName);
    const result = searchCriteria ? table?.where({ ...searchCriteria }) : table;

    await result?.toArray((d) => {
      dataArray.push(...d.map((d) => mapper?.(d) ?? d));
    });
  }

  return dataArray;
}
