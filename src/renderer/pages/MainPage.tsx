import * as React from 'react';
import * as moment from 'moment';
import { FileBrowser } from '@renderer/components/FileBrowser';
import { ConfigKey } from '@common/types';
import { isDefined } from '@common/helpers';
import { useConfig } from '@renderer/effects/config';
import { usePromise } from '@renderer/effects/promise';
import { default as api } from '@renderer/api-instance';
import { useCountdown } from '@renderer/effects/countdown';

export const MainPage = () => {
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

  const [
    tokenExpires,
    getTokenExpires,
  ] = usePromise(() => api.tokenExpires());

  React.useEffect(() => {
    getConfigPath();
    getCredentialsPath();
    getAwsProfile();
    getListAwsProfiles();
    getTokenExpires();
  }, [configPath]);

  const tokenExpiresIn = useCountdown(tokenExpires);

  if (!configPath || !credentialsPath || !awsProfile || !listAwsProfiles || !tokenExpires) {
    return null;
  }

  const tokenExpiresString = moment()
    .startOf('day')
    .seconds(tokenExpiresIn)
    .format('HH:mm:ss');

  const onConfigPathChange = (filePaths: string[]) => {
    const file = filePaths[0];

    if (isDefined(file)) {
      setConfigPath(file);
    }
  }

  const onCredentialsPathChange = (filePaths: string[]) => {
    const file = filePaths[0];

    if (isDefined(file)) {
      setCredentialsPath(file);
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
            <FileBrowser className="browse" onChange={onConfigPathChange} />
          </td>
        </tr>
        <tr className="row">
          <td className="key">Credentials file:</td>
          <td className="value">{credentialsPath}</td>
          <td className="modify">
            <FileBrowser className="browse" onChange={onCredentialsPathChange} />
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
          <td className="key">Token expires:</td>
          <td className="value" colSpan={2}>{tokenExpiresString}</td>
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