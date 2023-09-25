/// <reference types="vite/client" />
import pino, { LoggerOptions } from 'pino';
// check if envs are from vite
const viteEnvs = typeof import.meta.env !== 'undefined' ? import.meta.env : false;

// check if vite or next envs are available
const enabled = viteEnvs ? import.meta.env.LOG_ENABLED : process.env.LOG_ENABLED;
const devLevel = viteEnvs ? import.meta.env.LOG_LEVEL_DEV : process.env.LOG_LEVEL_DEV;
const prodLevel = viteEnvs ? import.meta.env.LOG_LEVEL_PROD : process.env.LOG_LEVEL_PROD;
const environment = viteEnvs ? import.meta.env.MODE : process.env.NODE_ENV;

interface LoggerOptionsExtended extends LoggerOptions {
  devLevel?: string;
  prodLevel?: string;
  enabled?: boolean;
  environment?: string;
}

const loggerOptions: LoggerOptionsExtended = {
  name: 'LINK',
  level: environment === 'development' ? devLevel : prodLevel ?? 'info',
  enabled: enabled,
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
    //bindings: (bindings) => ({ ...bindings, env: environment }),
  },
  browser: {
    asObject: false,
    serialize: true,
  },
};

export default pino(loggerOptions);
