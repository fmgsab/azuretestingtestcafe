import lookupData from 'models/src/data-dictionary/lookup-data.json';
import { expect } from 'vitest';
import { getAllItemTypes } from '../utils/utils';

describe('otherContent lookup-data', () => {
  const itemTypes = getAllItemTypes(lookupData, 'otherContent');
  it(`should match snapshot`, () => {
    expect(itemTypes).toMatchSnapshot();
  });
});
