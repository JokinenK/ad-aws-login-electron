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

export const isError = (input?: any): input is Error => {
  return (input && input.stack && input.message);
}

export const isString = (input?: any): input is string => {
  return (typeof input === 'string');
}

export const serializeError = (input?: any): string => {
  if (isError(input)) {
    return input.message;
  }
  
  if (isString(input)) {
    return input;
  }

  return JSON.stringify(input);
}

export const getRouteUrl = (route: string): string => {
  const path = `file://${parseBuildFile('src/renderer/index.html')}#${route}`;
  console.log(path);
  return path;
}
