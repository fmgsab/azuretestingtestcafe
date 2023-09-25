import { renderHook } from '../../../../test/test-utils';

import * as navUtil from '../../../../context/NavContext';
import { useSectionStatus } from './useSectionStatus';

describe('util/section/hooks/useSectionStatus', () => {
  it('should return data', async () => {
    const { result } = renderHook(useSectionStatus);

    expect(result.current).toEqual({
      selectedSectionId: expect.anything(),
      setSelectedSectionId: expect.any(Function),
      jobId: expect.anything(),
      setJobId: expect.any(Function),
      form: expect.any(String),
      setForm: expect.any(Function),
    });
  });

  it.each`
    replace
    ${true}
    ${false}
  `('should invoke push or replace accordingly when replace=$replace', async ({ replace }) => {
    const pushFn = vi.fn();
    const replaceFn = vi.fn();

    vi.spyOn(navUtil, 'useNavContext').mockReturnValue({
      push: pushFn,
      replace: replaceFn,
      shouldConfirm: false,
      onConfirm: vi.fn(),
      fid: '1',
      openConfirmation: vi.fn(),
    });
    const { result } = renderHook(useSectionStatus);

    result.current.setSelectedSectionId(1, replace);

    expect(pushFn).toHaveBeenCalledTimes(Number(!replace));
    expect(replaceFn).toHaveBeenCalledTimes(Number(replace));
  });
});
