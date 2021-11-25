import * as moment from 'moment';
import * as STS from 'aws-sdk/clients/sts';
import {
  Session,
  WebRequestFilter,
  BrowserWindow
} from 'electron';

import { ConfigKey } from '@common/types';
import { parseStringPromise } from 'xml2js';
import { getRouteUrl } from './helpers';
import { SAMPResponse } from './types';
import { updateCredentials } from './aws-helper';
import { default as config } from './config-instance';
import { URLSearchParams } from 'url';

export const interceptSamlLogin = (window: BrowserWindow, session: Session) => {
  const { webRequest } = session;
  const filter: WebRequestFilter = { urls: ['https://signin.aws.amazon.com/saml'] }

  webRequest.onBeforeRequest(filter, (details, callback) => {
    const [uploadData] = details.uploadData;

    if (details.method == 'POST' && uploadData) {
      const payload = new URLSearchParams(uploadData.bytes.toString());
      const response = payload.get('SAMLResponse')

      if (response) {
        handleSamlLogin(response);
        window.loadURL(getRouteUrl('/success'));
        return callback({ cancel: true });
      }
    }

    return callback({});
  });
}

const handleSamlLogin = (samlResponse: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const buffer = Buffer.from(samlResponse, 'base64');
    const result = await parseStringPromise(buffer.toString());
    const response = result as SAMPResponse;
    const attributeStatement = response['samlp:Response']
      ?.Assertion.pop()
      ?.AttributeStatement.pop();

    if (!attributeStatement) {
      return reject(new Error('AttributeStatement is missing'));
    }

    const roleAttributeName = "https://aws.amazon.com/SAML/Attributes/Role";
    const { Attribute } = attributeStatement;
    const listArns = Attribute
      .filter((attribute) => (attribute.$.Name == roleAttributeName))
      .map((attribute) => attribute.AttributeValue)
      .reduce((acc, val) => acc.concat(val), [])
      .map((value) => value.split(','));
    
    if (!listArns.length) {
      return reject(new Error('List of ARN\'s is missing'));
    }

    const sts = new STS();
    const roleArn = listArns[0][0];
    const principalArn = listArns[0][1];
    const duration = Number(config.get(ConfigKey.TOKEN_DURATION));

    const assumeRoleRequest: STS.AssumeRoleWithSAMLRequest = {
      RoleArn: roleArn,
      PrincipalArn: principalArn,
      SAMLAssertion: samlResponse,
      DurationSeconds: duration,
    }

    sts.assumeRoleWithSAML(assumeRoleRequest, (err, { Credentials }) => {
      if (err) {
        return reject(err);
      }

      if (!Credentials) {
        return reject(new Error('Response does not contain credentials'));
      }
      
      const credentialsFile = config.get(ConfigKey.AWS_CREDENTIALS_PATH);
      const profile = config.get(ConfigKey.AWS_PROFILE);

      updateCredentials(credentialsFile, profile, Credentials);

      return resolve();
    });
  });
}