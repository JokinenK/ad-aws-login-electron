export type IpcBaseEvent<T = any> = { data: T; }
type IpcMessageType<T = any> = { channel: string; message: T; eventId: number; };
type IpcMessageEvent = IpcBaseEvent<IpcMessageType>;
type IpcMessageListener<T = any> = (event: IpcMessageEvent, message: T) => void;

export abstract class AbstractPort<EventType extends IpcBaseEvent> {
  abstract start: () => void;
  abstract close: () => void;
  abstract postMessage: (message: any) => void;
  abstract onMessage: (handler: (event: EventType) => void) => void;
}

export abstract class AbstractIpcPort<EventType extends IpcBaseEvent = IpcBaseEvent> {
  private listeners: Record<string, Array<IpcMessageListener>> = {};
  private nextEventId: number = 0;

  constructor(private port: AbstractPort<EventType>) {
    this.port.onMessage((event: IpcMessageEvent) => {
      const { channel, message } = event.data;
      const listeners = this.getListeners(channel);
      listeners.forEach(listener => listener(event, message));
    });
  }

  start = () => {
    this.port.start();
  }

  close = () => {
    this.port.close();
  }

  send = <T>(channel: string, message: T) => {
    const payload: IpcMessageType<T> = {
      channel,
      message,
      eventId: this.nextEventId++
    };

    this.port.postMessage(payload);
  }

  on = <T>(channel: string, listener: IpcMessageListener<T>) => {
    this.addListener(channel, listener);
  }

  once = async <T>(channel: string, listener: IpcMessageListener<T>): Promise<void> => {
    let resultListener: IpcMessageListener;

    return new Promise<void>((resolve) => {
      resultListener = (event, message: T) => {
        listener(event, message);
        resolve();
      };

      this.on<T>(channel, resultListener);
    }).finally(() => {
      this.removeListener(channel, resultListener);
    });
  }

  invoke = <T, R>(channel: string, payload: T): Promise<R> => {
    let resultListener: IpcMessageListener;

    return new Promise<R>((resolve) => {
      const eventId = this.nextEventId;

      resultListener = async (event, message) => {
        if (eventId == event.data.eventId) {
          resolve(message);
        }
      };

      this.on<R>(channel, resultListener);
      this.send<T>(channel, payload);
    }).finally(() => {
      this.removeListener(channel, resultListener);
    });
  }

  handle = <T, R>(channel: string, handler: (event: IpcMessageEvent, input: T) => R | Promise<R>) => {
    this.on<T>(channel, async (event, message) => {
      const response = await handler(event, message);
      const payload: IpcMessageType<R> = {
        channel,
        message: response,
        eventId: event.data.eventId
      };

      this.port.postMessage(payload);
    });
  }

  handleOnce = <T, R>(channel: string, handler: (event: IpcMessageEvent, input: T) => R | Promise<R>) => {
    this.once<T>(channel, async (event, message) => {
      const response = await handler(event, message);
      const payload: IpcMessageType<R> = {
        channel,
        message: response,
        eventId: event.data.eventId
      };

      this.port.postMessage(payload);
    });
  }

  addListener = <T>(channel: string, listener: IpcMessageListener<T>) => {
    this.setListeners(channel, this.getListeners(channel).concat([listener]));
  }

  removeListener = <T>(channel: string, listener: IpcMessageListener<T>) => {
    this.setListeners(channel, this.getListeners(channel).filter(it => (it !== listener)));
  }

  removeAllListeners = (channel: string) => {
    this.setListeners(channel, []);
  }

  private getListeners = (channel: string): Array<IpcMessageListener> => {
    return this.listeners[channel] || [];
  }

  private setListeners = (channel: string, listeners: Array<IpcMessageListener>): void => {
    this.listeners[channel] = listeners;
  }
}
