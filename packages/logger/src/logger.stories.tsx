import { StoryObj } from '@storybook/react';
import { LoggerOptions } from 'pino';
import logger from './logger';

type LoggerProps = LoggerOptions & {
  environment: string;
  devLevel: string;
  prodLevel: string;
  msg: string;
  asObject: boolean;
  showChild: boolean;
};

const LoggerComponent = ({ ...props }: LoggerProps) => {
  const { msg, level } = props;

  switch (level) {
    case 'trace':
      logger.trace(msg);
      break;
    case 'debug':
      logger.debug(msg);
      break;
    case 'info':
      logger.info(msg);
      break;
    case 'warn':
      logger.warn(msg);
      break;
    case 'error':
      logger.error(new Error(msg));
      break;
    case 'fatal':
      logger.fatal(msg);
  }

  return (
    <div>
      <div className="mockup-code">
        <pre data-prefix="$" className="text-warning py-2">
          <code className="text-md">1: Install pino-pretty globally</code>
        </pre>
        <pre data-prefix="$">
          <code>pnpm install -g pino-pretty</code>
        </pre>
        <pre data-prefix="$" className="text-warning py-2">
          <code className="text-md">2: Import into file</code>
        </pre>
        <pre data-prefix="$">
          <code>import logger from './logger';</code>
        </pre>
        <pre data-prefix="$" className="text-warning py-2">
          <code className="text-md">3: Use</code>
        </pre>
        <pre data-prefix="$">
          <code>logger.trace(msg);</code>
        </pre>
        <pre data-prefix="$">
          <code>logger.debug(msg);</code>
        </pre>
        <pre data-prefix="$">
          <code>logger.info(msg);</code>
        </pre>
        <pre data-prefix="$">
          <code>logger.warn(msg);</code>
        </pre>
        <pre data-prefix="$">
          <code>logger.error(error, [msg]);</code>
        </pre>
        <pre data-prefix="$">
          <code>logger.fatal(msg);</code>
        </pre>
        <pre data-prefix="$" className="text-warning py-2">
          <code className="text-md">4: (Optional) Run dev in package.json to show coloured logs in node console.</code>
        </pre>
        <pre data-prefix="$">
          <code>"dev-pretty": "next dev | pino-pretty",</code>
        </pre>
        <pre data-prefix="$" className="text-warning py-2 ">
          <code className="text-md">Environment variables, set in .env file for each app</code>
        </pre>
        <pre data-prefix="$">LOG_ENABLED=true LOG_LEVEL_DEV=trace LOG_LEVEL_PROD=warn</pre>
      </div>
    </div>
  );
};

export default {
  title: 'Utils/Logger',
  component: LoggerComponent,
  args: {
    environment: 'development',
    msg: 'Logger Browser',
    level: 'trace',
    devLevel: 'trace',
    prodLevel: 'trace',
    showChild: true,
  },

  argTypes: {
    msg: {
      control: { type: 'text' },
    },
    environment: {
      options: ['development', 'production'],
      control: { type: 'radio' },
    },
    level: {
      options: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
      control: { type: 'select' },
    },
    devLevel: {
      options: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
      control: { type: 'select' },
    },
    prodLevel: {
      options: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
      control: { type: 'select' },
    },
  },
};

type Story = StoryObj<LoggerProps>;

export const Default: Story = {
  render: (args) => <LoggerComponent {...args} />,
};
