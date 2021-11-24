import { AbstractIpcPort, AbstractPort } from '@common/abstract-ipc-port';

class PortWrapper extends AbstractPort<MessageEvent> {
  constructor(private port: MessagePort) { super(); };
  start = () => this.port.start();
  close = () => this.port.close();
  postMessage = (message: any) => this.port.postMessage(message);
  onMessage = (handler: (event: MessageEvent) => void) => { this.port.onmessage = handler; }
}

export class IpcPortRenderer extends AbstractIpcPort<MessageEvent> {
  constructor(port: MessagePort) {
    super(new PortWrapper(port));
  }
}
