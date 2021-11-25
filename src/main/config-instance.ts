import * as path from 'path';
import { ConfigKey } from '@common/types';
import { Config } from "@main/services/config";
import { default as exitHandler } from '@main/services/exit-handler';
import { getHomePath, getConfigPath } from '@main/helpers';
import moment = require('moment');

const defaultConfigPath = path.join(getHomePath(), '.aws', 'config');
const defaultCredentialsPath = path.join(getHomePath(), '.aws', 'credentials');
const defaultProfile = 'default';
const defaultNodeEnv = String(process.env.NODE_ENV || 'development');

const configInstance = new Config({
  configFile: path.join(getConfigPath(), 'config.json'),
  defaults: {
    [ConfigKey.AWS_CONFIG_PATH]: defaultConfigPath,
    [ConfigKey.AWS_CREDENTIALS_PATH]: defaultCredentialsPath,
    [ConfigKey.AWS_PROFILE]: defaultProfile,
    [ConfigKey.NODE_ENV]: defaultNodeEnv,
    [ConfigKey.TOKEN_DURATION]: `${(8 * 60 * 60)}`,
  }
});

exitHandler.addHook(() => configInstance.save());

export default configInstance;