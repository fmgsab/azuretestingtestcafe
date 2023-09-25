import { concat } from './concat';
import { pickOne } from './pick';

describe('array', () => {
  describe('concat', () => {
    it('should return concatenated string', async () => {
      expect(concat(['string1', 'string2', 'string3'])).toEqual('string1, string2, string3');
      expect(concat(['string1', 'string2', 'string3'], '|')).toEqual('string1|string2|string3');
    });
  });

  describe('pickOne', () => {
    it('should return an element from the array', () => {
      const testArray = [1, 2, 3, 4, 5];
      const result = pickOne(testArray);

      // The result should be one of the elements from the testArray
      expect(testArray).toContain(result);
    });

    it('should return undefined for an empty array', () => {
      const emptyArray: unknown[] = [];
      const result = pickOne(emptyArray);

      expect(result).toBeUndefined();
    });
  });
});
