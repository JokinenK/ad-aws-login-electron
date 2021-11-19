import { ipcMain } from 'electron';
import { default as config } from '@main/config-instance';
import { parseProfiles } from '@main/aws-helper';
import { assignRequestHandler } from '@common/ipc';
import {
  ConfigKey,
  ChannelName,
  GetConfigHandler,
  SetConfigHandler,
  GetProfilesHandler,
} from '@common/types'

class Api {
  constructor() {
    assignRequestHandler(ipcMain, ChannelName.GET_CONFIG, this.getConfig);
    assignRequestHandler(ipcMain, ChannelName.SET_CONFIG, this.setConfigHandler);
    assignRequestHandler(ipcMain, ChannelName.GET_PROFILES, this.getProfilesHandler);
  }

  getConfig: GetConfigHandler = (request) => {
    return { data: config.get(request.key) };
  };

  setConfigHandler: SetConfigHandler = (request) => {
    return { data: config.set(request.key, request.value) };
  };

  getProfilesHandler: GetProfilesHandler = (request) => {
    const configPath = config.get(ConfigKey.AWS_CONFIG_PATH);
    return { data: parseProfiles(configPath) };
  };
}

export default new Api();
