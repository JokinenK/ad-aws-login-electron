import * as fs from 'fs';
import * as STS from 'aws-sdk/clients/sts';

export const parseProfiles = (configFile: string): string[] => {
  const regExp = new RegExp('\\[profile (.*)\\]');

  if (!fs.existsSync(configFile)) {
    return [];
  }

  return fs
    .readFileSync(configFile)
    .toString()
    .split(/\r?\n/)
    .filter(it => regExp.test(it))
    .map(it => it.replace(regExp, '$1'));
}

export const updateCredentials = (credentialsFile: string, profile: string, credentials: STS.Credentials) => {
  const regExp = new RegExp(`\\[${profile}\\]\\r?\\n([^\\[]+)`);
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