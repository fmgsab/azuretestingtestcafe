import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';

import * as allEnvVars from '../../../src/remote-services/env-utils';
import * as allServices from '../../../src/remote-services/fmg-services';

describe('fmg-services interceptors', () => {
  const intUrl = 'https://devapi.npfmgservices.co.nz';
  const crmUrl = 'https://testb.npfmgconnect.co.nz';
  beforeEach(() => {
    vi.spyOn(allEnvVars, 'getIntBaseUrl').mockReturnValue(intUrl);
    vi.spyOn(allEnvVars, 'getCrmBaseUrl').mockReturnValue(crmUrl);
  });

  it.each`
    url                    | service                          | params
    ${'leads'}             | ${allServices.getLeads}          | ${{ employeeId: '1' }}
    ${'vehicle/info/test'} | ${allServices.lookupVehicleInfo} | ${{ searchFor: 'test' }}
  `('should correctly set request headers for $url', async ({ url, service, params }) => {
    vi.spyOn(allServices, 'getContextFromUrl').mockReturnValue('INT');
    const mock = new MockAdapter(axios);

    // Mock the Axios request and specify the response
    mock.onGet(`${intUrl}/${url}`).reply((config: AxiosRequestConfig) => {
      expect(config.headers?.['Authorization']).toBeDefined();
      return [200, { data: 'mocked-data' }];
    });

    const response = await service(params);

    expect(response.data).toEqual('mocked-data');
  });

  it.each`
    url                    | service
    ${'oauth2/v2.0/token'} | ${allServices.getAccessTokenInt}
    ${'oauth2/token'}      | ${allServices.getAccessTokenCrm}
  `('should use correct url $url', async ({ url, service }) => {
    vi.spyOn(allServices, 'getContextFromUrl').mockReturnValue('INT');
    const mock = new MockAdapter(axios);

    // Mock the Axios request and specify the response
    mock.onAny().reply((config: AxiosRequestConfig) => {
      expect(config.url).toEqual(expect.stringContaining(url));
      return [200, { access_token: 'access_token' }];
    });

    const response = await service();

    expect(response).toEqual('access_token');
  });

  it.each`
    url                              | service                         | params                   | key
    ${'ws/rest/Address/Suggestions'} | ${allServices.lookupAddresses}  | ${{ searchFor: 'test' }} | ${'addressSuggestion'}
    ${'ws/rest/Address/Detail'}      | ${allServices.getAddressDetail} | ${{ adr: 'test' }}       | ${'addressDetails'}
  `('should correctly set request headers for $url', async ({ url, service, params, key }) => {
    vi.spyOn(allServices, 'getContextFromUrl').mockReturnValue('INT');
    const mock = new MockAdapter(axios);

    // Mock the Axios request and specify the response
    mock.onGet(`${crmUrl}/${url}`).reply((config: AxiosRequestConfig) => {
      expect(config.headers?.['x-wss-access-token']).toBeDefined();
      expect(config.headers?.['x-wss-token-source']).toBeDefined();
      return [200, { [key]: 'mocked-data' }];
    });

    const response = await service(params);

    expect(response).toEqual('mocked-data');
  });

  it('should modify the response', async () => {
    // Create an Axios Mock Adapter
    const mock = new MockAdapter(axios);

    mock.onGet('https://devapi.npfmgservices.co.nz/leads').reply(200, { data: 'modified-data' });

    const response = await allServices.getLeads({ employeeId: 'a67958d7-9daa-ea11-a812-000d3ad1f9f4' });
    expect(response.data).toEqual('modified-data');
  });

  it.each`
    code   | error
    ${401} | ${'Login required'}
    ${403} | ${'Permission denied'}
    ${404} | ${'Invalid request'}
    ${500} | ${'Server error'}
    ${300} | ${'Unknown error occurred'}
  `('should handle an error $code in the interceptor', async ({ code, error }) => {
    // Create an Axios Mock Adapter
    const mock = new MockAdapter(axios);

    // Mock the Axios request and specify the response
    mock.onGet('https://devapi.npfmgservices.co.nz/leads').reply(code, { error });

    try {
      await allServices.getLeads({ employeeId: 'a67958d7-9daa-ea11-a812-000d3ad1f9f4' });
    } catch (err) {
      const error = err as AxiosError;
      expect(error.response?.status).toBe(code);
      expect(error.response?.data).toEqual({ error });
    }
  });

  it('should handle an non axios error', async () => {
    // Create an Axios Mock Adapter
    const mock = new MockAdapter(axios);
    const error = new Error('Non Axios Error');

    // Mock the Axios request and specify the response
    mock.onGet('https://devapi.npfmgservices.co.nz/leads').reply(() => {
      throw error;
    });

    try {
      await allServices.getLeads({ employeeId: 'a67958d7-9daa-ea11-a812-000d3ad1f9f4' });
    } catch (err) {
      expect(err).toBeInstanceOf(error);
    }
  });

  it('should handle an non axios response', async () => {
    // Create an Axios Mock Adapter
    const mock = new MockAdapter(axios);

    // Mock the Axios request and specify the response
    mock.onGet('https://devapi.npfmgservices.co.nz/leads').reply(() => {
      throw new AxiosError();
    });

    try {
      await allServices.getLeads({ employeeId: 'a67958d7-9daa-ea11-a812-000d3ad1f9f4' });
    } catch (err) {
      const error = err as AxiosError;
      expect(error.response).toBeNull();
    }
  });
});
