import axios from 'axios';
import { MockedFunction } from 'vitest';
import * as allEnvVars from '../../../src/remote-services/env-utils';
import * as allServices from '../../../src/remote-services/fmg-services';

vi.mock('axios');

describe('fmg-services', () => {
  const intUrl = 'https://devapi.npfmgservices.co.nz';
  const crmUrl = 'https://testb.npfmgconnect.co.nz';
  beforeEach(() => {
    vi.spyOn(allEnvVars, 'getIntBaseUrl').mockReturnValue(intUrl);
    vi.spyOn(allEnvVars, 'getCrmBaseUrl').mockReturnValue(crmUrl);
  });

  const interceptors = {
    request: { eject: vi.fn(), use: vi.fn() },
    response: { eject: vi.fn(), use: vi.fn() },
  };
  const axiosMock = axios.create as MockedFunction<typeof axios.create>;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it.each`
    service                          | url
    ${allServices.getAccessTokenInt} | ${'oauth2/v2.0/token'}
    ${allServices.getAccessTokenCrm} | ${'oauth2/token'}
  `('$service should return an access token', async ({ service, url }) => {
    // Mock the axios.get call for getToken
    const response = {
      data: {
        access_token: 'mocked-access-token',
      },
      status: 200,
    };
    (axios.get as MockedFunction<typeof axios.get>).mockResolvedValue(response);

    const accessToken = await service();
    expect(accessToken).toBe('mocked-access-token');
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(url), expect.any(Object));
  });

  it.each`
    service                          | url
    ${allServices.getAccessTokenInt} | ${'oauth2/v2.0/token'}
    ${allServices.getAccessTokenCrm} | ${'oauth2/token'}
  `('$service should handle status greater than or equal to 400', async ({ service, url }) => {
    // Mock the axios.get call for getToken with a response having status >= 400
    (axios.get as MockedFunction<typeof axios.get>).mockRejectedValue(new Error('Mocked Error'));

    const accessToken = await service();
    expect(accessToken).toBeNull();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(url), expect.any(Object));
  });

  it.each`
    service                          | url
    ${allServices.getAccessTokenInt} | ${'oauth2/v2.0/token'}
    ${allServices.getAccessTokenCrm} | ${'oauth2/token'}
  `('$service should handle error', async ({ service, url }) => {
    // Mock the axios.get call for getToken with a response having status >= 400
    const response = {
      status: 400,
    };
    (axios.get as MockedFunction<typeof axios.get>).mockResolvedValue(response);

    const accessToken = await service();
    expect(accessToken).toBeNull();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(url), expect.any(Object));
  });

  it.each`
    service                         | param                    | data                                                    | expectedResult                   | url
    ${allServices.lookupAddresses}  | ${{ searchFor: 'test' }} | ${{ addressSuggestion: [{ suggestion: 'Address 1' }] }} | ${[{ suggestion: 'Address 1' }]} | ${'/Address/Suggestions'}
    ${allServices.getAddressDetail} | ${{ adr: 'address' }}    | ${{ addressDetails: { detail: 'Address details' } }}    | ${{ detail: 'Address details' }} | ${'/Address/Detail'}
  `('$service should return $expectedResult', async ({ service, param, data, expectedResult, url }) => {
    // Mock the axios.get call for lookupAddresses
    const response = { data, status: 200 };
    const get = vi.fn().mockResolvedValue(response);
    // eslint-disable-next-line
    // @ts-ignore
    axiosMock.mockReturnValue({ get, interceptors });
    const result = await service(param);

    expect(result).toEqual(expectedResult);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(expect.stringContaining(url), expect.any(Object));
    expect(get).toHaveReturnedWith(response);
  });

  it.each`
    service                          | param                    | data                 | expectedResult       | url
    ${allServices.lookupVehicleInfo} | ${{ searchFor: 'test' }} | ${{ vehicle: {} }}   | ${{ vehicle: {} }}   | ${'vehicle/info'}
    ${allServices.getLeads}          | ${{ employeeId: '1' }}   | ${[{ leadId: '1' }]} | ${[{ leadId: '1' }]} | ${'leads'}
  `('INT $service should return $expectedResult', async ({ service, param, data, expectedResult, url }) => {
    // Mock the axios.get call for lookupAddresses
    const response = { data, status: 200 };
    const get = vi.fn().mockResolvedValue(response);
    // eslint-disable-next-line
    // @ts-ignore
    axiosMock.mockReturnValue({ get, interceptors });
    const result = await service(param);

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('oauth2/v2.0/token'), expect.any(Object));
    expect(result).toEqual(expectedResult);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(expect.stringContaining(url), expect.any(Object));
    expect(get).toHaveReturnedWith(response);
  });

  it.each`
    service                         | param                    | url
    ${allServices.lookupAddresses}  | ${{ searchFor: 'test' }} | ${'/Address/Suggestions'}
    ${allServices.getAddressDetail} | ${{ adr: 'address' }}    | ${'/Address/Detail'}
  `('$service should handle status greater than or equal to 400', async ({ service, param, url }) => {
    // Mock the axios.get call for lookupAddresses
    const response = { status: 500 };
    const get = vi.fn().mockResolvedValue(response);
    // eslint-disable-next-line
    // @ts-ignore
    axiosMock.mockReturnValue({ get, interceptors });
    const result = await service(param);

    expect(result).toBeUndefined();
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(expect.stringContaining(url), expect.any(Object));
    expect(get).toHaveReturnedWith(response);
  });

  it.each`
    service                          | param                    | url
    ${allServices.lookupVehicleInfo} | ${{ searchFor: 'test' }} | ${'vehicle/info'}
    ${allServices.getLeads}          | ${{ employeeId: '1' }}   | ${'leads'}
  `('INT $service should handle status greater than or equal to 400', async ({ service, param, url }) => {
    // Mock the axios.get call for lookupAddresses
    const response = { status: 500 };
    const get = vi.fn().mockResolvedValue(response);
    // eslint-disable-next-line
    // @ts-ignore
    axiosMock.mockReturnValue({ get, interceptors });
    const result = await service(url, param);

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('oauth2/v2.0/token'), expect.any(Object));
    expect(result).toBeUndefined();
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(expect.stringContaining(url), expect.any(Object));
    expect(get).toHaveReturnedWith(response);
  });

  it.each`
    service                         | param                    | url
    ${allServices.lookupAddresses}  | ${{ searchFor: 'test' }} | ${'/Address/Suggestions'}
    ${allServices.getAddressDetail} | ${{ adr: 'address' }}    | ${'/Address/Detail'}
  `('$service should handle error', async ({ service, param, url }) => {
    // Mock the axios.get call for lookupAddresses
    const get = vi.fn().mockRejectedValue(new Error('Mocked Error'));
    // eslint-disable-next-line
    // @ts-ignore
    axiosMock.mockReturnValue({ get, interceptors });
    const result = await service(param);

    expect(result).toBeUndefined();
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(expect.stringContaining(url), expect.any(Object));
  });

  it.each`
    service                          | param                    | url
    ${allServices.lookupVehicleInfo} | ${{ searchFor: 'test' }} | ${'vehicle/info'}
    ${allServices.getLeads}          | ${{ employeeId: '1' }}   | ${'leads'}
  `('INT $service should handle error', async ({ service, param, url }) => {
    // Mock the axios.get call for lookupAddresses
    const error = new Error('Mocked Error');
    const get = vi.fn().mockRejectedValue(error);
    // eslint-disable-next-line
    // @ts-ignore
    axiosMock.mockReturnValue({ get, interceptors });
    const result = await service(param);

    expect(result).toEqual(error);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(expect.stringContaining(url), expect.any(Object));
  });
});
