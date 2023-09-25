import { checkSizeIfSet } from './set';

describe('set', () => {
  describe('checkSetSize', () => {
    it('should return true for a Set with size greater than 0', async () => {
      expect(checkSizeIfSet(new Set(['One']))).toBeTruthy();
      expect(checkSizeIfSet(new Set('One'))).toBeTruthy();
      expect(checkSizeIfSet(new Set('One'))).toBeTruthy();
      expect(checkSizeIfSet(new Set([null]))).toBeTruthy();
      expect(checkSizeIfSet(new Set(null))).toBeFalsy();
      expect(checkSizeIfSet(new Set())).toBeFalsy();
      expect(checkSizeIfSet(new Date())).toBeTruthy();
      expect(checkSizeIfSet(/something/g)).toBeTruthy();
      expect(checkSizeIfSet('Hello')).toBeTruthy();
      expect(checkSizeIfSet(['Hello'])).toBeTruthy();
      expect(checkSizeIfSet([])).toBeTruthy();
      expect(checkSizeIfSet({ size: 1 })).toBeTruthy();
    });
  });
});
