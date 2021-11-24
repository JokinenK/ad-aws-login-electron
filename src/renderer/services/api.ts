import { createRequestInvoker } from '@common/ipc';

import {
  ChannelName,
  GetConfigInvoker,
  SetConfigInvoker,
  GetProfilesInvoker,
} from '@common/types'
import { IpcPortRenderer } from '@renderer/ipc-port-renderer';

export class Api {
  private invokeGetConfig: GetConfigInvoker;
  private invokeSetConfig: SetConfigInvoker;
  private invokeGetProfiles: GetProfilesInvoker;

  constructor(port: IpcPortRenderer) {
    this.invokeGetConfig = createRequestInvoker(port, ChannelName.GET_CONFIG);
    this.invokeSetConfig = createRequestInvoker(port, ChannelName.SET_CONFIG);
    this.invokeGetProfiles = createRequestInvoker(port, ChannelName.GET_PROFILES);
    port.start();
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