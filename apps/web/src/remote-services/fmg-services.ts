import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { camelize } from '@fmg/utils';
import {
  getCrmBaseUrl,
  getCrmClientId,
  getCrmClientSecret,
  getCrmGrantType,
  getCrmResourceUrl,
  getIntBaseUrl,
  getIntClientId,
  getIntClientSecret,
  getIntGrantType,
  getIntScope,
} from './env-utils';
import logger from '@fmg/logger';

export interface Fetch extends AxiosRequestConfig {
  url: string;
}

export interface LookupAddress {
  searchFor: string;
}

export interface GetLeads {
  employeeId: string;
}

export interface GetAddressDetails {
  adr: string;
}

export type Response =
  | {
      AddressSuggestion: unknown[];
      AddressDetails: unknown;
    }
  | unknown;

export const getAccessTokenInt = async () => {
  const tenantId = process.env.AZURE_AD_TENANT_ID;
  try {
    const response = await axios.get(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: { client_id: getIntClientId(), client_secret: getIntClientSecret(), grant_type: getIntGrantType(), scope: getIntScope() },
    });
    // logger.info('response.data', response.data, {
    //   resource: process.env[`AZURE_AD_${identity}_RESOURCE_URL`],
    //   grantType: process.env[`AZURE_AD_${identity}_GRANT_TYPE`],
    //   clientId: process.env[`AZURE_AD_${identity}_CLIENT_ID`],
    //   clientSecret: process.env[`AZURE_AD_${identity}_CLIENT_SECRET`],
    //   scope: process.env[`AZURE_AD_${identity}_SCOPE`],
    // });
    logger.info('response.data', response.data);
    return response.data.access_token;
  } catch (error) {
    logger.error({ error });
    return null;
  }
};

export const getAccessTokenCrm = async () => {
  const tenantId = process.env.AZURE_AD_TENANT_ID;
  try {
    const response = await axios.get(`https://login.microsoftonline.com/${tenantId}/oauth2/token`, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        client_id: getCrmClientId(),
        resource: getCrmResourceUrl(),
        client_secret: getCrmClientSecret(),
        grant_type: getCrmGrantType(),
      },
    });
    logger.info('response.data', response.data);
    return response.data.access_token;
  } catch (error) {
    logger.error({ error });
    return null;
  }
};

const INT = 'INT';
const CRM = 'CRM';

export const getContextFromUrl = (url: string) => {
  return /fmgservices\.co\.nz/i.test(url) ? INT : CRM;
};

export const onErrorResponse = (error: AxiosError | Error): Promise<AxiosError> => {
  if (axios.isAxiosError(error)) {
    // const { message } = error;
    // const { method, url } = error.config as AxiosRequestConfig;
    const { statusText, status } = (error.response as AxiosResponse) ?? {};

    // logOnDev(
    //   `🚨 [API] ${method?.toUpperCase()} ${url} | Error ${status} ${message}`
    // );

    switch (status) {
      case 401: {
        // "Login required"
        break;
      }
      case 403: {
        // "Permission denied"
        break;
      }
      case 404: {
        // "Invalid request"
        break;
      }
      case 500: {
        // "Server error"
        break;
      }
      default: {
        // "Unknown error occurred"
        break;
      }
    }
    logger.error({ status, statusText });

    //if (status === 401) {
    // Delete Token & Go To Login Page if you required.
    //sessionStorage.removeItem("token");
    //}
  } else {
    //logOnDev(`🚨 [API] | Error ${error.message}`);
  }

  return Promise.reject(error);
};

const fetch = async ({ url, ...config }: Fetch) => {
  const ctx = getContextFromUrl(url);
  const token = ctx === INT ? await getAccessTokenInt() : await getAccessTokenCrm();

  const onRequest = (iarc: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const { headers } = iarc;

    if (ctx === INT) {
      headers.Authorization = token;
    } else {
      headers['x-wss-access-token'] = token;
      headers['x-wss-token-source'] = 'crm';
    }

    return iarc;
  };
  const onResponse = (response: AxiosResponse) => {
    if (response.data) {
      response.data = camelize(response.data);
    }
    return response;
  };

  const api = axios.create();
  api.interceptors.request.use(onRequest, onErrorResponse);
  api.interceptors.response.use(onResponse, onErrorResponse);

  try {
    const response = await api.get(url, config);
    logger.info({ config, response }, response.data, response.config);
    return response.data;
  } catch (error) {
    logger.error({ error });
    return error;
  }
};

export const lookupAddresses = async ({ searchFor }: LookupAddress) => {
  const result = (await fetch({
    url: `${getCrmBaseUrl()}/ws/rest/Address/Suggestions`,
    params: { searchFor },
  })) satisfies Response;
  return result?.addressSuggestion;
};

export const getAddressDetail = async ({ adr }: GetAddressDetails) => {
  const result = (await fetch({
    url: `${getCrmBaseUrl()}/ws/rest/Address/Detail`,
    params: { adr },
  })) satisfies Response;
  return result?.addressDetails;
};

export const lookupVehicleInfo = async ({ searchFor }: LookupAddress) => {
  return (await fetch({
    url: `${getIntBaseUrl()}/vehicle/info/${searchFor}`,
  })) satisfies Response;
};

// eslint-disable-next-line
export const getLeads = async ({ employeeId = 'a67958d7-9daa-ea11-a812-000d3ad1f9f4' }: GetLeads) => {
  return (await fetch({
    url: `${getIntBaseUrl()}/leads`,
    params: { employeeId },
  })) satisfies Response;
};

const services = { lookupAddresses, getAddressDetail, lookupVehicleInfo, getLeads };
export default services;
