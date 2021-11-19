const capturedSignals: Array<NodeJS.Signals> = ['SIGTERM', 'SIGINT', 'SIGBREAK'];

type ExitListener = () => void;

class ExitHandler {
  private exitListeners: Array<ExitListener> = [];
  private origExitListeners: Array<NodeJS.ExitListener>;
  private origSignalListeners: Record<NodeJS.Signals, Array<NodeJS.SignalsListener>>;

  constructor() {
    this.origExitListeners = process.listeners('exit');
    this.origSignalListeners = capturedSignals.reduce(
      (accum, signal) => ({ ...accum, [signal]: process.listeners(signal) }),
      {} as Record<NodeJS.Signals, Array<NodeJS.SignalsListener>>
    );

    process.removeAllListeners('exit');
    process.addListener('exit', this.onExit);
    
    capturedSignals.forEach(
      (signal) => {
        process.removeAllListeners(signal);
        process.addListener(signal, this.onSignal)
      }
    );
  }

  addHook = (listener: ExitListener) => {
    this.exitListeners.push(listener);
    return () => this.exitListeners = this.exitListeners.filter(it => (it != listener));
  }

  private onExit: NodeJS.ExitListener = (code: number) => {
    this.cleanUp(() => process.exit(code));
  }

  private onSignal: NodeJS.SignalsListener = (signal: NodeJS.Signals) => {
    this.cleanUp(() => process.kill(process.pid, signal));
  }

  private cleanUp = (onExit: () => void) => {
    for (const listener of this.exitListeners) {
      listener();
    }
    
    process.removeAllListeners('exit');
    this.origExitListeners.forEach(listener => {
      process.addListener('exit', listener);
    })

    capturedSignals.forEach(signal => {
      process.removeAllListeners(signal);
      this.origSignalListeners[signal].forEach(listener => {
        process.addListener(signal, listener)
      });
    });

    onExit();
  }
}

export default new ExitHandler();