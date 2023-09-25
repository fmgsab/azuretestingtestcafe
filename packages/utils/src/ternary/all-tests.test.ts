import { ternary } from './ternary';

describe('ternary', () => {
  describe('ternary', () => {
    it('ternary function returns as expected', () => {
      expect(ternary(true, 100, 500)).toBe(100);
      expect(ternary(false, 100, 500)).toBe(500);
    });
  });
});
