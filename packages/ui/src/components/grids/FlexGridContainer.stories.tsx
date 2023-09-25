import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { z, ZodTypeAny } from 'zod';

import { ContactCard, ContactData } from '../cards/Contact/ContactCard';
import { FlexGridContainer } from './FlexGridContainer';

export default {
  title: 'Components/Grids/FlexGridContainer',
  component: FlexGridContainer,
  parameters: {
    controls: {
      include: ['data', 'maxCols', 'maxContainerWidth'],
    },
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof FlexGridContainer>;

const Template: ComponentStory<typeof FlexGridContainer & z.infer<ZodTypeAny>> = (args) => {
  return (
    <div className="p-4.5">
      <FlexGridContainer {...args} />
    </div>
  );
};

const data = [
  {
    title: 'Dr',
    firstName: 'Contact',
    middleName: '',
    lastName: 'One',
    dateOfBirth: '12th June 1990',
    email: 'contact@email.com',
    primaryPhone: '0220123456',
    roleTypes: ['Role One', 'Role Two'],
  },
  {
    title: 'Mrs',
    firstName: 'Contact',
    middleName: '',
    lastName: 'Two',
    dateOfBirth: '12th June 1990',
    email: 'contact@email.com',
    primaryPhone: '0220123456',
    roleTypes: ['Role One', 'Role Two', 'Role Three', 'Role Four', 'Role Five', 'Role Six', 'Role Seven'],
  },
  {
    title: 'Mr',
    firstName: 'Contact',
    middleName: 'Middle',
    lastName: 'Three',
    dateOfBirth: '12th June 1990',
    email: 'contact@email.com',
    primaryPhone: '0220123456',
    roleTypes: ['Role One', 'Role Two', 'Role Three', 'Role Four', 'Role Five', 'Role Six'],
  },
  {
    title: 'Mr',
    firstName: 'Contact',
    middleName: 'Middle',
    lastName: 'Four',
    dateOfBirth: '12th June 1990',
    email: 'contact@email.com',
    primaryPhone: '0220123456',
    roleTypes: ['Role One', 'Role Two', 'Role Three', 'Role Four', 'Role Five', 'Role Six'],
  },
  {
    title: 'Mr',
    firstName: 'Contact',
    middleName: 'Middle',
    lastName: 'Five',
    dateOfBirth: '12th June 1990',
    email: 'contact@email.com',
    primaryPhone: '0220123456',
    roleTypes: ['Role One', 'Role Two', 'Role Three', 'Role Four', 'Role Five', 'Role Six'],
  },
];

const render = (cell: ContactData) => <ContactCard {...cell} />;

export const Dashboard = Template.bind({});
Dashboard.args = {
  render,
  data,
  maxCols: 4,
  containerClasses: 'md:mx-15 mx-12 xl:mx-auto',
};

export const ApplicationSummary = Template.bind({});
ApplicationSummary.args = {
  render,
  data,
  maxCols: 3,
  minColWidth: 370,
  maxContainerWidth: 1278,
  containerClasses: 'mx-auto',
};
