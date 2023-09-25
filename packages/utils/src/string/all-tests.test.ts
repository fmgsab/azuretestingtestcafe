import { stringToKebab } from './kebab';
import { toNumber } from './to-number';
import { date, now, toFormattedDate } from './to-formatted-date';
import { camelize } from './camelize';

describe('string', () => {
  describe('kebab', () => {
    it('should return kebab case string', async () => {
      expect(stringToKebab('HiThere')).toEqual('hi-there');
    });
  });

  describe('to-number', () => {
    it('should return a number', async () => {
      expect(toNumber(12345.01)).toEqual(12345.01);
      expect(toNumber('12,345.01')).toEqual(12345.01);
    });

    it('should return zero', async () => {
      expect(toNumber('not a number')).toEqual(0);
      expect(toNumber({ value: 'not a number' })).toEqual(0);
    });
  });

  describe('to-formatted-date', () => {
    const mockedDate = '2023-09-29T12:00:00+12:00';
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(mockedDate));
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.clearAllMocks();
    });

    it('should correctly format to date format string', async () => {
      expect(toFormattedDate('2023-10-04T06:32:06.660Z', 'D MMMM YYYY')).toEqual('4 October 2023');
      expect(toFormattedDate('2023-10-04T16:44:18+13:00', 'D MMMM YYYY')).toEqual('4 October 2023');
      expect(toFormattedDate('2023-10-05T04:44:18+13:00', 'D MMMM YYYY')).toEqual('5 October 2023');
      expect(toFormattedDate('2023-10-05T16:44:18+13:00', 'D MMMM YYYY')).toEqual('5 October 2023');
    });

    it('should return empty string', async () => {
      expect(toFormattedDate('202310-04T06:32:06.660Z', 'D MMMM YYYY')).toEqual('');
    });

    it('should return original string', async () => {
      expect(toFormattedDate('2023-10-04T06:32:06.660Z')).toEqual('2023-10-04T19:32:06+13:00');
      expect(toFormattedDate('2023-10-04T06:32:06.660')).toEqual('2023-10-04T06:32:06+13:00');
    });

    it("should return today's date", async () => {
      expect(toFormattedDate()).toEqual('2023-09-29T13:00:00+13:00');
    });

    it('should return given date & time', async () => {
      expect(date('2023-08-08T16:44:18.00')).toEqual('2023-08-08T16:44:18+12:00');
      expect(date('2023-08-08T16:44:18.00Z')).toEqual('2023-08-09T04:44:18+12:00');
      expect(date('2023-08-08T16:44:18+12:00')).toEqual('2023-08-08T16:44:18+12:00');
    });

    it('should return current date & time', async () => {
      expect(now()).toMatch(/2023-09-29T/);
    });
  });

  describe('camelize', () => {
    const snakeCase = {
      first_name: 'John',
      last_name: 'Doe',
      cc_rating: '1000',
      glw: '1',
      ppe_type: '',
      address_details: {
        street_name: '123 Main St',
        city_name: 'New York',
      },
    };

    const kebabCase = {
      'first-name': 'John',
      'last-name': 'Doe',
      'cc-rating': '1000',
      glw: '1',
      'ppe-type': '',
      'address-details': {
        'street-name': '123 Main St',
        'city-name': 'New York',
      },
    };

    const pascalCase = {
      FirstName: 'John',
      LastName: 'Doe',
      CCRating: '1000',
      GLW: '1',
      PPEType: '',
      AddressDetails: {
        StreetName: '123 Main St',
        CityName: 'New York',
      },
    };

    it.each`
      caseName        | origCase
      ${'snake_case'} | ${snakeCase}
      ${'kebab-case'} | ${kebabCase}
      ${'PascalCase'} | ${pascalCase}
    `('should convert keys of an object from $caseName to camelCase', ({ origCase }) => {
      const camelCase = camelize(origCase);

      expect(camelCase).toEqual(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          addressDetails: {
            streetName: '123 Main St',
            cityName: 'New York',
          },
          ccRating: '1000',
          glw: '1',
          ppeType: '',
        })
      );
    });

    it('should handle arrays correctly', () => {
      const arrayObject = [
        { first_name: 'John', last_name: 'Doe' },
        { first_name: 'Jane', last_name: 'Smith' },
      ];

      const camelCaseArray = camelize(arrayObject);

      expect(camelCaseArray).toEqual([
        { firstName: 'John', lastName: 'Doe' },
        { firstName: 'Jane', lastName: 'Smith' },
      ]);
    });

    it('should handle null and non-object values', () => {
      expect(camelize(null)).toBeNull();
      expect(camelize('hello')).toBe('hello');
      expect(camelize(42)).toBe(42);
      expect(camelize(true)).toBe(true);
    });
  });
});
