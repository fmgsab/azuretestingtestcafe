import type { Preview } from '@storybook/react';
import '../src/tailwind.css';
import '@fmg/ui/src/styles.css';

// @ts-ignore
import screens from '@fmg/tailwind-config/screens.json';

const breakpointViewports = Object.keys(screens).reduce((acc, key) => {
  acc[key] = {
    name: `Breakpoint (${key}) ${screens[key as keyof typeof screens]}`,
    styles: {
      width: `${screens[key as keyof typeof screens]}`,
      height: 'calc(100% - 20px)',
    },
    type: 'other',
  };
  return acc;
}, {});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        //color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      grid: {
        cellSize: 6,
        opacity: 0.2,
        cellAmount: 7,
        offsetX: 16,
        offsetY: 16,
      },
    },
    viewport: {
      viewports: {
        ...breakpointViewports,
      },
    },
  },
};

export default preview;
