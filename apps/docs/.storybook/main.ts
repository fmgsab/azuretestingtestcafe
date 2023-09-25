import type { StorybookConfig } from '@storybook/react-vite';
const turbosnap = require('vite-plugin-turbosnap');
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: [
    '../../../packages/ui/src/components/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../packages/ui/src/lookup/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../packages/ui/src/utils/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../packages/forms/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../packages/logger/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../packages/digital-acquisitions/src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },

  core: { disableTelemetry: true },

  async viteFinal(config, { configType }) {
    // return the customized config

    if (configType === 'DEVELOPMENT') {
    }

    config.optimizeDeps = {
      ...config.optimizeDeps,
    };

    return mergeConfig(config, {
      plugins: configType === 'PRODUCTION' ? [turbosnap({ rootDir: config.root ?? process.cwd() })] : [],
    });
  },
};
export default config;
