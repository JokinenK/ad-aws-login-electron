import { SaveDialogOptions, OpenDialogOptions } from 'electron';
import { createRequestInvoker } from '@common/ipc';
import {
  ChannelName,
  GetConfigInvoker,
  SetConfigInvoker,
  GetProfilesInvoker,
  OpenDialogInvoker,
  SaveDialogInvoker,
} from '@common/types'
import { IpcPortRenderer } from '@renderer/ipc-port-renderer';

export class Api {
  private invokeGetConfig: GetConfigInvoker;
  private invokeSetConfig: SetConfigInvoker;
  private invokeGetProfiles: GetProfilesInvoker;
  private invokeOpenDialog: OpenDialogInvoker;
  private invokeSaveDialog: SaveDialogInvoker;

  constructor(port: IpcPortRenderer) {
    this.invokeGetConfig = createRequestInvoker(port, ChannelName.GET_CONFIG);
    this.invokeSetConfig = createRequestInvoker(port, ChannelName.SET_CONFIG);
    this.invokeGetProfiles = createRequestInvoker(port, ChannelName.GET_PROFILES);
    this.invokeOpenDialog = createRequestInvoker(port, ChannelName.OPEN_DIALOG);
    this.invokeSaveDialog = createRequestInvoker(port, ChannelName.SAVE_DIALOG);
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

  showOpenDialog = async(options: OpenDialogOptions) => {
    return this.invokeOpenDialog(options);
  }

  showSaveDialog = async(options: SaveDialogOptions) => {
    return this.invokeSaveDialog(options);
  }
}