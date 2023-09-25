import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ClientInfoForm } from './ClientInfoForm';

export default {
  title: 'forms/ClientInformation',
  component: ClientInfoForm,
  parameters: {},
} as ComponentMeta<typeof ClientInfoForm>;

const Template: ComponentStory<typeof ClientInfoForm> = () => {
  return <ClientInfoForm />;
};

export const Default = Template.bind({});
Default.args = {};
