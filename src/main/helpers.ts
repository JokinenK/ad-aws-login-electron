import { app } from 'electron'
import * as path from 'path';

export const isOSX = (): boolean => process.platform === 'darwin';
export const isWindows = (): boolean => process.platform === 'win32';
export const isDevelopment = (): boolean => process.env.NODE_ENV === 'development';

export const getAppName = (): string => {
  return require('@buildroot/package.json').name;
}

export const parseBuildFile = (...paths: string[]): string => {
  return path.join(app.getAppPath(), 'build', ...paths);
}

export const getHomePath = (): string => {
  if (isWindows()) {
    const { HOMEDRIVE, HOMEPATH } = process.env;
    return path.resolve(String(HOMEDRIVE), String(HOMEPATH));
  }

  const { HOME } = process.env;
  return path.resolve(String(HOME));
}

export const getConfigPath = (): string => {
  const appName = getAppName();

  if (isDevelopment()) {
    return process.cwd();
  }
  
  if (isWindows()) {
    const { APPDATA } = process.env;
    return path.resolve(String(APPDATA), appName);
  }

  const { HOME } = process.env;
  return path.resolve(String(HOME), `.${appName}`);
}

export const getIndexUrl = (): string => {
  return isDevelopment()
    ? 'http://localhost:3000'
    : `file://${parseBuildFile('src/renderer/index.html')}`;
}
