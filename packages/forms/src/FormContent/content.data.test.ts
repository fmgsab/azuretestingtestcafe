import lookupData from 'models/src/data-dictionary/lookup-data.json';
import { describe } from 'vitest';
import { getAllItemTypes } from '../utils/utils';

describe('content lookup-data snapshot', () => {
  const itemTypes = getAllItemTypes(lookupData, 'content');
  it(`should match snapshot`, () => {
    expect(itemTypes).toMatchSnapshot();
  });
});
