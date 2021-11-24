import { AbstractIpcPort } from './abstract-ipc-port';

export type RequestHandler<Request, Response> = (request: Request) => Response | Promise<Response>;
export type RequestInvoker<Request, Response> = (request: Request) => Promise<Response>;

export const assignRequestHandler = <Port extends AbstractIpcPort, Request, Response>(
  port: Port,
  channel: string,
  handler: RequestHandler<Request, Response>,
) => {
  port.handle(channel, ((_event, request: Request) => handler(request)));
}

export const createRequestInvoker = <Port extends AbstractIpcPort, Request, Response>(
  port: Port,
  channel: string,
): RequestInvoker<Request, Response> => (
  request: Request
) => {
  return port.invoke(channel, request);
};
