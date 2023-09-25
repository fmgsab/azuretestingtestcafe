import { Meta, StoryObj } from '@storybook/react';
import { Data, TableData, TableSearchArgs } from './TableData';
import { FormProviderWrapper } from '@fmg/ui';
import { z } from 'zod';

const meta: Meta<typeof TableData> = {
  title: 'Fields/TableData',
  component: TableData,
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof TableData>;

const tableSearchArgs: TableSearchArgs[] = [
  {
    tableName: 'house',
    searchCriteria: { jobId: '3ae39f99-9a6f-4ab4-81b6-c3108e49eb5b' },
    mapper: (data: Data) => ({ value: data.location, label: data.location }),
  },
  {
    tableName: 'farmBuilding',
    searchCriteria: { jobId: '3ae39f99-9a6f-4ab4-81b6-c3108e49eb5b' },
    mapper: (data: Data) => ({ value: data.location, label: data.location }),
  },
  {
    tableName: 'commercialBuilding',
    searchCriteria: { jobId: '3ae39f99-9a6f-4ab4-81b6-c3108e49eb5b' },
    mapper: (data: Data) => ({ value: data.location, label: data.location }),
  },
];

const schema = z.object({
  location: z.string(),
});

export const Default: Story = {
  render: (args) => {
    return (
      <FormProviderWrapper model={{ schema }} uid={0} onSubmit={(data) => console.log(data)} mode="all">
        <TableData {...args} />
      </FormProviderWrapper>
    );
  },

  args: {
    tableSearchArgs: tableSearchArgs,
    name: 'location',
    question: 'Location',
    label: '',
    className: '',
    required: true,
    size: 8,
    as: 'list',
  },
};
