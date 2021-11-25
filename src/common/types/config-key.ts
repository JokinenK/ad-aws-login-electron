export enum ConfigKey {
  NODE_ENV = "NODE_ENV",
  AWS_CONFIG_PATH = "AWS_CONFIG_PATH",
  AWS_CREDENTIALS_PATH = "AWS_CREDENTIALS_PATH",
  AWS_PROFILE = "AWS_PROFILE",
  ROLE_ARN = "ROLE_ARN",
  TOKEN_DURATION = "TOKEN_DURATION",
  TOKEN_EXPIRES = "TOKEN_EXPIRES",
};

export const isConfigKey = (input: string): input is ConfigKey => {
  return input in ConfigKey;
};
