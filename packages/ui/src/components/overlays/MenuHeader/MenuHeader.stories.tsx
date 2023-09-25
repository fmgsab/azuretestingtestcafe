import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { OnlineStatusProvider } from '../../../hooks';
import { Header } from '../../layout/Header/Header';
import { MenuHeader } from './MenuHeader';

const meta = {
  title: 'Overlays/MenuHeader',
  component: MenuHeader,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof MenuHeader>;

export default meta;
type Story = StoryObj<typeof MenuHeader>;

function Component() {
  // tailwind-safelist: md:h-[calc(100vh-96px)] md:h-[calc(100vh-72px)]
  const TRANSLATE =
    '-translate-x-full absolute transition duration-500 delay-100 ease-out peer-checked:translate-x-0 peer-checked:duration-300';
  const [checked, setChecked] = useState(false);
  return (
    <>
      <OnlineStatusProvider>
        <Header headerType="newApplication" accountName="John Collins" primaryContact="Sophie Collins" />
        <MenuHeader className={TRANSLATE} width={402} toggle={() => setChecked(!checked)} isOpen={checked} />
      </OnlineStatusProvider>
    </>
  );
}

export const Default: Story = {
  render: () => {
    return <Component />;
  },
};
