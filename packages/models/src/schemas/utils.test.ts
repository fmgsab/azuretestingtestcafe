import { extractPathValue } from './utils';

describe('utils', () => {
  it.each`
    args                                                   | path                                    | expected
    ${{ viModifications: [{ modificationType: 'mod1' }] }} | ${'viModifications.0.modificationType'} | ${'mod1'}
    ${{ hasModification: 'true' }}                         | ${'hasModification'}                    | ${'true'}
    ${{ hasModification: 'true' }}                         | ${'viModifications.1.modificationType'} | ${''}
  `('should extract correct path value $expected', ({ args, path, expected }) => {
    expect(extractPathValue(args, path)).toEqual(expected);
  });
});
