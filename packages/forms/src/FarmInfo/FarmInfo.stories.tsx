import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Navbar } from 'react-daisyui';
import { FarmInfoForm } from './FarmInfo';

export default {
  title: 'forms/FarmInformation',
  component: FarmInfoForm,
  args: {},
  parameters: {},
} as ComponentMeta<typeof FarmInfoForm>;

const Template: ComponentStory<typeof FarmInfoForm> = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="component-preview flex w-full items-center justify-center gap-2 p-4">
        <Navbar className="tabs">
          <a data-sb-kind="forms-clientinformation" className="tab tab-bordered">
            Client information
          </a>
          <a data-sb-kind="forms-dwellinginformation" className="tab tab-bordered">
            Dwelling information
          </a>
          <a data-sb-kind="forms-farminformation" className="tab tab-bordered tab-active">
            Farm information
          </a>
        </Navbar>
      </div>
      <FarmInfoForm />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {};
