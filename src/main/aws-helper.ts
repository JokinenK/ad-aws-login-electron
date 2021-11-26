import * as fs from 'fs';
import * as STS from 'aws-sdk/clients/sts';
import * as moment from 'moment';
import { parseIni } from '@common/helpers';

const emptyDate = moment(0).toISOString();
const extractProfilesRegExp = new RegExp('\\[profile (.*)\\]');
const createExtractCredentialsRegExp = (profile: string) => new RegExp(`\\[${profile}\\]\\r?\\n([^\\[]+)`);

export const parseProfiles = (configFile: string): string[] => {
  if (!fs.existsSync(configFile)) {
    return [];
  }

  return fs
    .readFileSync(configFile)
    .toString()
    .split(/\r?\n/)
    .filter(it => extractProfilesRegExp.test(it))
    .map(it => it.replace(extractProfilesRegExp, '$1'));
}

export const parseCredentials = (credentialsFile: string, profile: string): Partial<STS.Credentials> | undefined => {
  const regExp = createExtractCredentialsRegExp(profile);
  
  if (!fs.existsSync(credentialsFile)) {
    return undefined;
  }

  const contents = fs.readFileSync(credentialsFile).toString();
  const matches = contents.match(regExp);

  if (matches) {
    const config = parseIni(matches[1]);
    const credentials: Partial<STS.Credentials> = {
      AccessKeyId: config['aws_access_key_id'],
      SecretAccessKey: config['aws_secret_access_key'],
      SessionToken: config['aws_session_token'],
      Expiration: new Date(config['aws_session_expiration']),
    }

    return credentials;
  }

  return undefined;
}

export const parseTokenExpiration = (credentialsFile: string, profile: string): string => {
  const credentials = parseCredentials(credentialsFile, profile);

  if (credentials && credentials.Expiration) {
    return moment(credentials.Expiration).toISOString();
  }

  return emptyDate;
}

export const updateCredentials = (credentialsFile: string, profile: string, credentials: STS.Credentials) => {
  const regExp = createExtractCredentialsRegExp(profile);
  const fileExists = fs.existsSync(credentialsFile);

  const contents = fileExists
    ? fs.readFileSync(credentialsFile).toString()
    : '';

  const newSection = [
    `[${profile}]`,
    `aws_access_key_id=${credentials.AccessKeyId}`,
    `aws_secret_access_key=${credentials.SecretAccessKey}`,
    `aws_session_token=${credentials.SessionToken}`,
    `aws_session_expiration=${credentials.Expiration.toJSON()}`,
  ].join('\n');

  const newContents = regExp.test(contents)
    ? `${contents.replace(regExp, newSection)}\n`
    : `${contents}\n${newSection}`;

  if (fileExists) {
    fs.renameSync(credentialsFile, `${credentialsFile}.bak`);
  }

  fs.writeFileSync(credentialsFile, newContents);
}