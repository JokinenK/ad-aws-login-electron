import { IpcRenderer, IpcMain } from 'electron';

export type RequestHandler<Request, Response> = (request: Request) => Response | Promise<Response>;
export type RequestInvoker<Request, Response> = (request: Request) => Promise<Response>;

export const assignRequestHandler = <Request, Response>(
  ipcMain: IpcMain,
  channel: string,
  handler: RequestHandler<Request, Response>,
) => {
  ipcMain.handle(channel, ((_event, request: Request) => handler(request)));
}

export const createRequestInvoker = <Request, Response>(
  ipcRenderer: IpcRenderer,
  channel: string,
): RequestInvoker<Request, Response> => (
  request: Request
) => {
  return ipcRenderer.invoke(channel, request);
};
