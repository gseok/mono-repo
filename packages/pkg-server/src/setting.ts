import packageJson from '../package.json';

declare const global: {
  __BUILD_DATE__: string;
};

export const NODE_ENV = 'development';
export const currentPhase = 'local';
export const PORT = 3131;
export const LOG_LEVEL = 'debug';
export const SERVER_STARTED_AT = global.__BUILD_DATE__ || new Date();
export const VERSION = `v${packageJson.version}-${currentPhase}-${SERVER_STARTED_AT}`;
