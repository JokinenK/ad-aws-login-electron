import { ipcRenderer } from 'electron';
import { createRequestInvoker } from '@common/ipc';

import {
  ChannelName,
  GetConfigInvoker,
  SetConfigInvoker,
  GetProfilesInvoker,
} from '@common/types'

export class Api {
  private invokeGetConfig: GetConfigInvoker;
  private invokeSetConfig: SetConfigInvoker;
  private invokeGetProfiles: GetProfilesInvoker;

  constructor() {
    this.invokeGetConfig = createRequestInvoker(ipcRenderer, ChannelName.GET_CONFIG);
    this.invokeSetConfig = createRequestInvoker(ipcRenderer, ChannelName.SET_CONFIG);
    this.invokeGetProfiles = createRequestInvoker(ipcRenderer, ChannelName.GET_PROFILES);
  }

  getConfig = (key: string) => {
    return this.invokeGetConfig({ key })
      .then(response => response.data);
  }

  setConfig = (key: string, value: string) => {
    return this.invokeSetConfig({ key, value })
      .then(response => response.data);
  }

  getProfiles = () => {
    return this.invokeGetProfiles({})
      .then(response => response.data);
  }
}

export default new Api();