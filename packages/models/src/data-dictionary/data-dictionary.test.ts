vi.mock('./lookup-data.json', () => ({
  default: {
    excesses: [
      {
        list: ['1% Sum Insured ($500 Min)', '1,000', '2,000', '5,000', '10,000'],
        itemType: ['vehicle'],
        usage: ['Commercial'],
      },
      {
        effectiveDate: '2018-11-01T00:00:00',
        expirationDate: '2019-11-01T00:00:00',
        list: ['500', '750', '1,000', '2,000', '3,000', '5,000', '10,000'],
        itemType: ['vehicle'],
        itemSubtype: [
          'Car, Van or Ute',
          'Trailer',
          'All terrain vehicle / quad bike',
          'Truck',
          'Off road utility task vehicle',
          'Motorbike',
        ],
        usage: ['Private'],
      },
      {
        effectiveDate: '2019-11-01T00:00:00',
        list: ['500', '750', '1,000', '2,000', '3,000', '5,000', '10,000'],
        itemType: ['vehicle'],
        itemSubtype: [
          'Car, Van or Ute',
          'Trailer',
          'All terrain vehicle / quad bike',
          'Truck',
          'Off road utility task vehicle',
          'Motorbike',
        ],
        usage: ['Private'],
        max: ['sumInsured.gstExclusive', 99999.99],
      },
      {
        list: ['1% Sum Insured ($500 Min)'],
        itemType: ['vehicle'],
        itemSubtype: [
          'Car, Van or Ute',
          'Trailer',
          'All terrain vehicle / quad bike',
          'Truck',
          'Off road utility task vehicle',
          'Motorbike',
        ],
        usage: ['Private'],
        min: ['sumInsured.gstExclusive', 100000],
      },
    ],
    'has.driver': [
      {
        itemSubtype: ['Car, Van or Ute', 'motorhome', 'caravan'],
        usage: ['Personal'],
      },
    ],
    models: {
      hyundai: ['Santa Fe', 'Tucson'],
      toyota: ['Corolla', 'Hilux', 'Prius'],
    },
  },
}));

import { getValidLookups, isEffective, isMatchingCriteria, DataDictionary, contains } from './data-dictionary';

describe('data-dictionary', () => {
  const baseDate = '2023-08-23T00:00:00';
  describe('isEffective', () => {
    it.each`
      effectiveDate            | expirationDate           | expected
      ${'2023-08-23T00:00:00'} | ${undefined}             | ${true}
      ${'2023-08-24T00:00:00'} | ${undefined}             | ${false}
      ${undefined}             | ${undefined}             | ${true}
      ${undefined}             | ${'2023-08-22T00:00:00'} | ${false}
      ${'2022-08-23T00:00:00'} | ${'2023-05-16T00:00:00'} | ${false}
    `('tests if effective when $effectiveDate + $expirationDate', ({ effectiveDate, expirationDate, expected }) => {
      let actual = isEffective({ effectiveDate, expirationDate }, baseDate);
      expect(actual).toEqual(expected);
      actual = isEffective({ effectiveDate, expirationDate }, new Date(baseDate));
      expect(actual).toEqual(expected);
    });
  });

  describe('getValidLookups', () => {
    it('should return valid lookup results ', async () => {
      const models = {
        hyundai: ['Santa Fe', 'Tucson'],
        toyota: ['Corolla', 'Hilux', 'Prius'],
      };

      const other = {
        expirationDate: '2019-11-01T00:00:00',
        list: ['other1', 'other2'],
      };

      expect(getValidLookups({ ...models, other }, baseDate)).toEqual(models);
    });

    it('should return valid lookup results for when return type is list', async () => {
      const excesses = [
        {
          effectiveDate: '2018-11-01T00:00:00',
          expirationDate: '2019-11-01T00:00:00',
          list: ['300', '500', '750', '1,000'],
          itemType: ['vehicle'],
          coverType: ['Comprehensive', 'Third Party, Fire & Theft', 'Fire & Theft', 'Fire Only'],
        },
        {
          effectiveDate: '2019-11-01T00:00:00',
          list: ['500', '750', '1,000', '2,000', '3,000', '5,000', '10,000'],
          itemType: ['vehicle'],
          coverType: ['Comprehensive', 'Third Party, Fire & Theft', 'Fire & Theft', 'Fire Only'],
        },
      ];

      expect(getValidLookups(excesses, baseDate)).toEqual(excesses.slice(1));
    });
  });

  describe('contains', () => {
    it('should return correct comparison results', async () => {
      expect(contains(['1', '2', '3'], '1')).toBe(true);
      expect(contains(['Trailer', 'Tractor'], 'tractor')).toBe(true);
      expect(contains(['trailer', 'tractor'], 'Tractor')).toBe(true);
      expect(contains(['trailer', 'tractor'], ['trailer', 'tractor'])).toBe(false);
    });
  });

  describe('isMatchingCriteria', () => {
    const excess = {
      list: ['300', '500', '750', '1,000'],
      itemType: ['vehicle'],
      coverType: ['Comprehensive', 'Third Party, Fire & Theft', 'Fire & Theft', 'Fire Only'],
    };

    it.each`
      testCase                      | itemType      | coverType          | expected
      ${'meeting all criteria'}     | ${'vehicle'}  | ${'Comprehensive'} | ${true}
      ${'meeting one of criteria'}  | ${'building'} | ${'Comprehensive'} | ${false}
      ${'meeting none of criteria'} | ${'building'} | ${''}              | ${false}
    `('should return $expected for when $testCase', async ({ itemType, coverType, expected }) => {
      expect(isMatchingCriteria({ itemType, coverType })(excess)).toBe(expected);
    });
  });

  describe('DataDictionary', () => {
    const mockedDate = '2023-05-29T00:00:00.000Z';
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(mockedDate));
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.clearAllMocks();
    });

    it('should instantiate correctly', async () => {
      let dd = DataDictionary.get();
      // TODO: investigate why
      expect(dd.baseDate).toEqual('2023-05-28T12:00:00.000Z');

      const givenDate = '2023-05-10T00:00:00.000Z';
      dd = DataDictionary.get(givenDate);
      expect(dd.baseDate).toEqual(givenDate);
      expect(dd.data).toEqual({
        excesses: [
          {
            list: ['1% Sum Insured ($500 Min)', '1,000', '2,000', '5,000', '10,000'],
            itemType: ['vehicle'],
            usage: ['Commercial'],
          },
          {
            effectiveDate: '2019-11-01T00:00:00',
            list: ['500', '750', '1,000', '2,000', '3,000', '5,000', '10,000'],
            itemType: ['vehicle'],
            itemSubtype: [
              'Car, Van or Ute',
              'Trailer',
              'All terrain vehicle / quad bike',
              'Truck',
              'Off road utility task vehicle',
              'Motorbike',
            ],
            usage: ['Private'],
            max: ['sumInsured.gstExclusive', 99999.99],
          },
          {
            list: ['1% Sum Insured ($500 Min)'],
            itemType: ['vehicle'],
            itemSubtype: [
              'Car, Van or Ute',
              'Trailer',
              'All terrain vehicle / quad bike',
              'Truck',
              'Off road utility task vehicle',
              'Motorbike',
            ],
            usage: ['Private'],
            min: ['sumInsured.gstExclusive', 100000],
          },
        ],
        'has.driver': [{ itemSubtype: ['Car, Van or Ute', 'motorhome', 'caravan'], usage: ['Personal'] }],
        models: { hyundai: ['Santa Fe', 'Tucson'], toyota: ['Corolla', 'Hilux', 'Prius'] },
      });

      expect(dd.get('excesses')(['vehicle', 'Truck', 'Private', '', '7000'])).toEqual([
        '500',
        '750',
        '1,000',
        '2,000',
        '3,000',
        '5,000',
        '10,000',
      ]);
      expect(dd.get('excesses')(['vehicle', 'Truck', 'Private', '', '100000'])).toEqual(['1% Sum Insured ($500 Min)']);
      // because na returns -1
      expect(dd.get('excesses')(['vehicle', 'Truck', 'Private', '', 'na'])).toEqual([
        '500',
        '750',
        '1,000',
        '2,000',
        '3,000',
        '5,000',
        '10,000',
      ]);
      expect(dd.get('excesses')(['vehicle', 'Truck', 'Private', '', ''])).toEqual([]);
      expect(dd.get('has.driver')(['vehicle', 'motorhome', 'Personal', 'Comprehensive'])).toEqual([
        { itemSubtype: ['Car, Van or Ute', 'motorhome', 'caravan'], usage: ['Personal'] },
      ]);
      expect(dd.has('driver')(['vehicle', 'Car, Van or Ute', 'Personal', 'Comprehensive'])).toBe(true);
      expect(dd.get('models')()).toEqual({ hyundai: ['Santa Fe', 'Tucson'], toyota: ['Corolla', 'Hilux', 'Prius'] });
    });
  });
});
