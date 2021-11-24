import { RequestHandler, RequestInvoker } from "@common/ipc";
import { OpenDialogOptions, OpenDialogReturnValue, SaveDialogOptions, SaveDialogReturnValue } from "electron";

export enum ChannelName {
  GET_CONFIG = 'GET_CONFIG',
  SET_CONFIG = 'SET_CONFIG',
  GET_PROFILES = 'GET_PROFILES',
  OPEN_DIALOG = 'OPEN_DIALOG',
  SAVE_DIALOG = 'SAVE_DIALOG'
};

export interface GetConfigRequest {
  key: string;
}

export interface GetConfigResponse {
  error?: Error;
  data: string;
}

export type GetConfigHandler = RequestHandler<GetConfigRequest, GetConfigResponse>;
export type GetConfigInvoker = RequestInvoker<GetConfigRequest, GetConfigResponse>;

export interface SetConfigRequest {
  key: string;
  value: string;
}

export interface SetConfigResponse {
  error?: Error;
  data: boolean;
}

export type SetConfigHandler = RequestHandler<SetConfigRequest, SetConfigResponse>;
export type SetConfigInvoker = RequestInvoker<SetConfigRequest, SetConfigResponse>;

export interface GetProfilesRequest {
}

export interface GetProfilesResponse {
  error?: Error;
  data: string[];
}

export type GetProfilesHandler = RequestHandler<GetProfilesRequest, GetProfilesResponse>;
export type GetProfilesInvoker = RequestInvoker<GetProfilesRequest, GetProfilesResponse>;

export type OpenDialogHandler = RequestHandler<OpenDialogOptions, OpenDialogReturnValue>;
export type OpenDialogInvoker = RequestInvoker<OpenDialogOptions, OpenDialogReturnValue>;

export type SaveDialogHandler = RequestHandler<SaveDialogOptions, SaveDialogReturnValue>;
export type SaveDialogInvoker = RequestInvoker<SaveDialogOptions, SaveDialogReturnValue>;