import { ComponentMeta, ComponentStory } from '@storybook/react';
import { rest } from 'msw';
import { Navbar } from 'react-daisyui';

import { DwellingInfoForm } from './DwellingInfoForm';

export default {
  title: 'forms/DwellingInformation',
  component: DwellingInfoForm,
  args: {},
  parameters: {},
} as ComponentMeta<typeof DwellingInfoForm>;

const Template: ComponentStory<typeof DwellingInfoForm> = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex w-full component-preview p-4 items-center justify-center gap-2">
        <Navbar className="tabs">
          <a data-sb-kind="forms-clientinformation" className="tab tab-bordered">
            Client information
          </a>
          <a data-sb-kind="forms-dwellinginformation" className="tab tab-bordered tab-active">
            Dwelling information
          </a>
          <a data-sb-kind="forms-farminformation" className="tab tab-bordered">
            Farm information
          </a>
        </Navbar>
      </div>
      <DwellingInfoForm />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {};

export const Success = Template.bind({});
Success.parameters = {
  msw: {
    handlers: [
      rest.post('/submit', (req, res, ctx) => {
        return res(ctx.json({}));
      }),
    ],
  },
};

export const Loading = Template.bind({});
Loading.parameters = {
  msw: {
    handlers: [
      rest.post('/submit', (req, res, ctx) => {
        return res(ctx.delay(10000));
      }),
    ],
  },
};
