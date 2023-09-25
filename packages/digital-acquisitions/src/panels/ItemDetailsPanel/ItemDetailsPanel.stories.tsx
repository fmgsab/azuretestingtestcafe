import React, { useCallback, useEffect, useState } from 'react';
import { z, ZodTypeAny } from 'zod';
import Dexie, { IndexableTypePart, Table } from 'dexie';
import { Meta, StoryObj } from '@storybook/react';
import classnames from 'classnames';

import { db, dd } from 'models';
import { ItemDetailsPanel, ItemSummaryPanelProps } from './ItemDetailsPanel';

type ItemType = Record<string, unknown>;

class ItemsDB extends Dexie {
  vehicle!: Table;
  building!: Table;
  contents!: Table;

  constructor() {
    super('itemsDB');
    this.version(1).stores({
      vehicle: `
        ++,
        &RowKey,
        jobId`,
      building: `
        ++,
        &RowKey,
        jobId`,
      contents: `
        ++,
        &RowKey,
        jobId`,
    });
  }

  async bulkUpdate(data: ItemType[]) {
    const vehicles = data.filter((item: ItemType) => item.itemType === 'Vehicle');
    const buildings = data.filter((item: ItemType) => item.itemType === 'Building');
    const contents = data.filter((item: ItemType) => item.itemType === 'Content');

    const vehicleKeys = (await this.vehicle.toCollection().primaryKeys()) as IndexableTypePart[];
    const buildingKeys = (await this.building.toCollection().primaryKeys()) as IndexableTypePart[];
    const contentKeys = (await this.contents.toCollection().primaryKeys()) as IndexableTypePart[];

    await this.vehicle.bulkPut(vehicles, vehicleKeys.length ? vehicleKeys : undefined);
    await this.building.bulkPut(buildings, buildingKeys.length ? buildingKeys : undefined);
    await this.contents.bulkPut(contents, contentKeys.length ? contentKeys : undefined);
  }
}

const meta: Meta<typeof ItemDetailsPanel> = {
  title: 'diga/Page Panels/Application Summary/Items',
  component: ItemDetailsPanel,
  parameters: {
    controls: {
      include: ['data', 'canEdit', 'showEmptyTable', 'labels', 'headings'],
    },
    layout: 'fullscreen',
  },
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof ItemDetailsPanel & z.infer<ZodTypeAny>>;

function Template(args: z.infer<ZodTypeAny>) {
  const [loaded, setLoaded] = useState(false);
  const [tableList, setTableList] = useState<ItemSummaryPanelProps['tableList']>({});

  const getTableList = useCallback(async () => {
    return dd
      .get('itemTypes')()
      .reduce(
        async (acc: Promise<ItemSummaryPanelProps['tableList']>, { value: tblName, label: heading }: { value: string; label: string }) => {
          const out = await acc;
          const table = await db.table(tblName);
          const count = await table.count();
          return count ? { ...out, [tblName]: { table, heading } } : out;
        },
        Promise.resolve({})
      ) as Promise<ItemSummaryPanelProps['tableList']>;
  }, []);

  useEffect(() => {
    getTableList().then((result) => {
      setLoaded(true);
      setTableList(result);
    });
  }, [getTableList]);

  return loaded ? (
    <main className={classnames('p-4.5 mx-auto max-w-[1278px]')}>
      <ItemDetailsPanel {...args} tableList={tableList} />
    </main>
  ) : (
    <></>
  );
}

export const Default: Story = {
  render: (args: z.infer<ZodTypeAny>) => <Template {...args} />,
  args: {
    jobId: 1,
    canEdit: true,
    itemType: '',
    address: '',
    showEmptyTable: false,
    labels: {
      description: 'Description',
      coverType: 'Cover Type',
      sumInsured: 'Sum Insured',
      excess: 'Excess',
      action: 'Action',
    },
  },
};
