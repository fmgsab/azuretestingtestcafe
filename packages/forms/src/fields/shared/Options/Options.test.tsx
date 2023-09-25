import { z } from 'zod';
import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import * as context from '@fmg/ui/src/context/ModelContext';
import * as conditions from '../../../hooks/useConditionalCriteria';

import { Options } from './Options';

describe('fields/shared/Options', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });
  const useModelContextSpy = vi.spyOn(context, 'useModelContext');
  useModelContextSpy.mockReturnValue({ schema: z.object({}), uid: 0 });
  const useConditionalSpy = vi.spyOn(conditions, 'useConditionalCriteria');

  useConditionalSpy.mockReturnValue({
    defaultValue: undefined,
    fieldValues: [undefined, undefined, undefined, undefined],
    fields: ['itemType', 'itemSubtype', 'usage', 'coverage'],
    options: ['Comprehensive'],
    result: ['Comprehensive'],
    extraFieldValues: [],
  });
  it.each`
    fields
    ${['anotherField']}
    ${undefined}
  `('should render correctly', async ({ fields }) => {
    render(<Options lookupKey="titles" fields={fields} />, { wrapper: withFormWrapper({ defaultValues: {} }) });
    expect(screen.queryAllByRole('radio')[0]).toBeInTheDocument();
  });

  it('should render correctly', async () => {
    // TODO: should really call hook if no lookup key
    render(<Options lookupKey="" />, { wrapper: withFormWrapper({ defaultValues: {} }) });
    // default yes, no options
    expect(screen.queryAllByRole('radio')).toHaveLength(2);
  });

  it.each`
    hideIfEmpty | scope                                     | len
    ${true}     | ${{ source: 'source', condition: true }}  | ${0}
    ${true}     | ${{ source: 'source', condition: false }} | ${0}
    ${false}    | ${{ source: 'source', condition: true }}  | ${1}
    ${false}    | ${undefined}                              | ${1}
  `('should hide=$hideIfEmpty if no options & $scope', async ({ hideIfEmpty, scope, len }) => {
    useConditionalSpy.mockReturnValue({
      defaultValue: undefined,
      fieldValues: [undefined, undefined, undefined, undefined],
      fields: ['itemType', 'itemSubtype', 'usage', 'coverage'],
      options: [],
      result: [],
      extraFieldValues: [],
    });
    render(<Options as="list" lookupKey="titles" question="Titles" hideIfEmpty={hideIfEmpty} scope={scope} />, {
      wrapper: withFormWrapper({ defaultValues: { source: true } }),
    });

    expect(screen.queryAllByText('Titles')).toHaveLength(len);
  });
});
