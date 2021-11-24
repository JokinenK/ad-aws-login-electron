import * as React from 'react';
import { BrowseFile } from './BrowseFile';
import { ConfigKey } from '@common/types';
import { isDefined } from '@common/helpers';
import { useConfig } from '@renderer/effects/config';
import { usePromise } from '@renderer/effects/promise';
import { default as api } from '@renderer/api-instance';

export const AwsSettings = () => {
  const [
    configPath,
    getConfigPath,
    setConfigPath,
  ] = useConfig(ConfigKey.AWS_CONFIG_PATH);

  const [
    credentialsPath,
    getCredentialsPath,
    setCredentialsPath,
  ] = useConfig(ConfigKey.AWS_CREDENTIALS_PATH);

  const [
    awsProfile,
    getAwsProfile,
    setAwsProfile,
  ] = useConfig(ConfigKey.AWS_PROFILE);

  const [
    listAwsProfiles,
    getListAwsProfiles
  ] = usePromise(() => api.getProfiles());

  React.useEffect(() => {
    getConfigPath();
    getCredentialsPath();
    getAwsProfile();
    getListAwsProfiles();
  }, [configPath]);

  if (!configPath || !credentialsPath || !awsProfile || !listAwsProfiles) {
    return null;
  }

  const onConfigPathChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.item(0);

    if (isDefined(file)) {
      setConfigPath(file.path);
    }
  }

  const onCredentialsPathChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.item(0);

    if (isDefined(file)) {
      setCredentialsPath(file.path);
    }
  }

  const onProfileChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const profile = evt.target.value;
    setAwsProfile(profile);
  }

  return (
    <table className="config">
      <tbody>
        <tr className="row">
          <td className="key">Config file:</td>
          <td className="value">{configPath}</td>
          <td className="modify">
            <BrowseFile className="browse" onChange={onConfigPathChange} />
          </td>
        </tr>
        <tr className="row">
          <td className="key">Credentials file:</td>
          <td className="value">{credentialsPath}</td>
          <td className="modify">
            <BrowseFile className="browse" onChange={onCredentialsPathChange} />
          </td>
        </tr>
        <tr className="row">
          <td className="key">Profile:</td>
          <td className="modify" colSpan={2}>
            <select id="selectProfile" onChange={onProfileChange} value={awsProfile}>
              {listAwsProfiles.map(profile => <option key={profile} value={profile}>{profile}</option>)}
            </select>
          </td>
        </tr>
        <tr className="row">
          <td className="modify" colSpan={3}>
            <input type="button" onClick={() => { location.href = 'https://myapps.microsoft.com'; }} value="Login" />
          </td>
        </tr>
      </tbody>
    </table>
  )
}