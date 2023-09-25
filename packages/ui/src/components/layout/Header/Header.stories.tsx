import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Header, HeaderProps } from './Header';
import { OnlineStatusContext } from '../../../hooks/useOnlineStatus';

type StoryProps = {
  useLongData?: boolean;
  online: boolean;
};

export default {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    online: true,
    headerType: 'acquisition',
    accountName: 'New Application',
    primaryContact: 'New Contact',
    useLongData: false,
  },
  argTypes: {
    online: { control: 'boolean' },
    useLongData: {
      control: 'boolean',
    },
  },
} as ComponentMeta<typeof Header & StoryProps>;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const Default: ComponentStory<typeof Header & StoryProps> = (args: StoryProps & HeaderProps) => {
  const newApplication = args.headerType === 'newApplication';

  //return long test data
  if (newApplication && args.useLongData) {
    args.accountName =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Utern';
    args.primaryContact =
      'Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident, Sunt In Culpa Qui Officia Deserunt';
  }

  return (
    <>
      <OnlineStatusContext.Provider value={args.online}>
        <Header {...args} />
      </OnlineStatusContext.Provider>
    </>
  );
};
