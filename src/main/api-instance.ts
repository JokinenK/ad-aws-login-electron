import { MessagePortMain } from 'electron';
import { IpcPortMain } from './ipc-port-main';
import { Api } from './services/api'

export const createApiInstance = (port: MessagePortMain): Api => {
  return new Api(new IpcPortMain(port));
};
