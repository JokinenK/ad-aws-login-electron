import { dialog, OpenDialogOptions, SaveDialogOptions } from 'electron';
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
import { IpcPortMain } from '@main/ipc-port-main';

export class Api {
  constructor(port: IpcPortMain) {
    assignRequestHandler(port, ChannelName.GET_CONFIG, this.getConfigHandler);
    assignRequestHandler(port, ChannelName.SET_CONFIG, this.setConfigHandler);
    assignRequestHandler(port, ChannelName.GET_PROFILES, this.getProfilesHandler);
    assignRequestHandler(port, ChannelName.OPEN_DIALOG, this.showOpenDialogHandler);
    assignRequestHandler(port, ChannelName.SAVE_DIALOG, this.showSaveDialogHandler);
    port.start();
  }

  getConfigHandler: GetConfigHandler = (request) => {
    return { data: config.get(request.key) };
  };

  setConfigHandler: SetConfigHandler = (request) => {
    return { data: config.set(request.key, request.value) };
  };

  getProfilesHandler: GetProfilesHandler = (request) => {
    const configPath = config.get(ConfigKey.AWS_CONFIG_PATH);
    return { data: parseProfiles(configPath) };
  };

  showOpenDialogHandler = async(options: OpenDialogOptions) => {
    return dialog.showOpenDialog(options);
  }

  showSaveDialogHandler = async(options: SaveDialogOptions) => {
    return dialog.showSaveDialog(options);
  }
}

