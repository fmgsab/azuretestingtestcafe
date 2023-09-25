import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';

import { PairInput } from './PairInput';

describe('fields/SumInsured', () => {
  it('should render correctly', async () => {
    render(<PairInput />, { wrapper: withFormWrapper({}) });
    expect(screen.queryAllByRole('textbox')).toHaveLength(2);
  });
});
