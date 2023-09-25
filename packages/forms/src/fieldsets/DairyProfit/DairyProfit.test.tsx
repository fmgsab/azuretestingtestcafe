import { z } from 'zod';
import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import { asRequiredString, asSet, asString } from 'models/src/schemas/schema';
import { itemSubtypes } from 'models';
import * as context from '@fmg/ui/src/context/ModelContext';
import * as saveFieldUtil from '@fmg/ui/src/hooks/useSaveField';
import * as resetFieldsUtil from '@fmg/ui/src/hooks/useResetFields';

import { DariyProfit, calculateDairyProfit } from './DariyProfit';

describe('fieldsets/DairyProfit', () => {
  const schema = z.object({
    hasDairyProfit: asRequiredString(),
    DairyProfit: asSet(asString()).nullish(),
  });

  const useModelContextSpy = vi.spyOn(context, 'useModelContext');
  useModelContextSpy.mockReturnValue({ schema, uid: 0 });

  it.each`
    itemSubtype                                | expected
    ${itemSubtypes.busInterruption.dairyFarm}  | ${1}
    ${itemSubtypes.busInterruption.commercial} | ${0}
  `('should render correctly for $itemSubtype', async ({ itemSubtype, expected }) => {
    render(<DariyProfit />, {
      wrapper: withFormWrapper({ defaultValues: { itemSubtype } }),
    });
    const texts = screen.queryAllByTestId('estDairyProfit');
    expect(texts.length).toBe(expected);
  });

  it('should render correctly when no itemSubtype selected', async () => {
    const saveFieldFn = vi.fn();
    vi.spyOn(saveFieldUtil, 'useSaveField').mockReturnValue(saveFieldFn);
    const resetFieldsFn = vi.fn();
    vi.spyOn(resetFieldsUtil, 'useResetFields').mockReturnValue(resetFieldsFn);

    render(<DariyProfit />, {
      wrapper: withFormWrapper({ defaultValues: {} }),
    });

    expect(saveFieldFn).not.toHaveBeenCalled();
    expect(resetFieldsFn).not.toHaveBeenCalled();
  });

  it.each`
    share    | value
    ${'80'}  | ${'80'}
    ${'100'} | ${'100'}
    ${null}  | ${'100'}
  `('should save field correctly when share=$share', async ({ share, value }) => {
    const saveFieldFn = vi.fn();
    vi.spyOn(saveFieldUtil, 'useSaveField').mockReturnValue(saveFieldFn);
    render(<DariyProfit />, {
      wrapper: withFormWrapper({ defaultValues: { itemSubtype: itemSubtypes.busInterruption.dairyFarm, share } }),
    });
    expect(saveFieldFn).toHaveBeenCalledWith({ name: 'share', value });
  });

  it('should reset fields correctly', async () => {
    const resetFieldsFn = vi.fn();
    vi.spyOn(resetFieldsUtil, 'useResetFields').mockReturnValue(resetFieldsFn);
    render(<DariyProfit />, {
      wrapper: withFormWrapper({ defaultValues: { itemSubtype: itemSubtypes.busInterruption.commercial } }),
    });
    expect(resetFieldsFn).toHaveBeenCalledWith(['numberOfMilkingCows', 'peakProduction', 'estimatedPayout', 'share']);
  });

  describe('calculateDairyProfit', () => {
    it('should calculate correctly', async () => {
      expect(calculateDairyProfit([12, 1234, 3456, 100])).toEqual(4264704);
      expect(calculateDairyProfit([undefined, 1234, 3456, undefined])).toEqual(4264704);
      expect(calculateDairyProfit([12, 1234, 3456, 98])).toEqual(4179409.92);
      expect(calculateDairyProfit([18, 1234, 3456, 80])).toEqual(5117644.8);
      expect(calculateDairyProfit([24, 1234, 3456, 70])).toEqual(5970585.599999999);
    });
  });
});
