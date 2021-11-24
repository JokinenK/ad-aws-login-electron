import { MessageEvent, MessagePortMain } from 'electron';
import { AbstractIpcPort, AbstractPort } from '@common/abstract-ipc-port';

class PortWrapper extends AbstractPort<MessageEvent> {
  constructor(private port: MessagePortMain) { super(); };
  start = () => this.port.start();
  close = () => this.port.close();
  postMessage = (message: any) => this.port.postMessage(message);
  onMessage = (handler: (event: MessageEvent) => void) => this.port.on('message', handler);
}

export class IpcPortMain extends AbstractIpcPort<MessageEvent> {
  constructor(port: MessagePortMain) {
    super(new PortWrapper(port));
  }
}
