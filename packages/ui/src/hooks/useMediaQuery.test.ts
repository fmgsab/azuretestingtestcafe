import { renderHook } from '../test/test-utils';

import { mediaQueries } from '../../config/constants';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  afterAll(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it.each`
    matches
    ${true}
    ${false}
  `(`should return $matches`, async ({ matches }) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { result } = renderHook(() => useMediaQuery(mediaQueries.md));
    expect(result.current).toBe(matches);
  });
});
