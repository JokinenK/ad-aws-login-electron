import * as fs from 'fs';
import * as path from 'path';
import * as nconf from 'nconf';
import { isDefined } from '@common/helpers';

export interface ConfigOptions {
  useArgv?: boolean,
  useEnv?: boolean,
  configFile?: string,
  defaults?: Record<string, string>,
}

export class Config {
  private store: nconf.Provider;

  constructor(private options?: ConfigOptions) {
    const {
      useArgv = false,
      useEnv = false,
      configFile,
      defaults,
    } = options || {};

    const useFile = isDefined(configFile);
    const useDefaults = isDefined(defaults);

    let store = new nconf.Provider();

    if (useArgv)     { store = store.argv(); }
    if (useEnv)      { store = store.env(); }
    if (useFile)     { store = store.file({ file: configFile }); }
    if (useDefaults) { store = store.defaults(defaults); }

    this.store = store;
  }

  get = (key: string): string => {
    return this.store.get(key);
  }
  
  set = (key: string, value: string): boolean => {
    return this.store.set(key, value);
  }

  save = (): void => {
    const { configFile } = this.options || {};
    
    if (configFile) {
      const folder = path.parse(configFile).dir;
      fs.mkdirSync(folder, { recursive: true });

      const data = this.store.get();
      const json = JSON.stringify(data, null, 2);
      fs.writeFileSync(configFile, json);
    }
  }
}
