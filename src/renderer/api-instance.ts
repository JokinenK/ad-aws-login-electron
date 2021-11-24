import { ipcRenderer } from 'electron';
import { IpcPortRenderer } from './ipc-port-renderer';
import { Api } from './services/api';

export const createApiInstance = (): Api => {
  const { port1, port2 } = new MessageChannel();
  ipcRenderer.postMessage('request-api', null, [port2]);
  return new Api(new IpcPortRenderer(port1));
};

export default createApiInstance();