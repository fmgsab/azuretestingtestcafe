import { z, ZodTypeAny } from 'zod';

import { DataCell } from './DataCell';
import classnames from 'classnames';

const meta = {
  title: 'Components/Tables/DataCell',
  component: DataCell,
  parameters: {
    controls: {
      include: ['content', 'width'],
    },
  },
  argTypes: {
    content: {
      control: { type: 'text' },
    },
    width: {
      control: { type: 'text' },
    },
  },
};

export default meta;

const Template = (args: z.infer<ZodTypeAny>) => {
  return (
    <div className={classnames(`p-4.5 border-1 border-blue-216-border h-[54px] border`)} style={{ width: args.width }}>
      <DataCell {...args} />
    </div>
  );
};

export const Variable = {
  render: (args: z.infer<ZodTypeAny>) => <Template {...args} />,
  args: {
    content:
      'Another constructor offered by Intl is NumberFormat. You can use this constructor to change the way numbers are represented on the screen.',
    width: 'full',
  },
};
export const Fixed = {
  render: (args: z.infer<ZodTypeAny>) => <Template {...args} />,
  args: {
    ...Variable.args,
    content: 'Present Day Value',
    width: '162px',
  },
};
