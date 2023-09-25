import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';

import { SumInsured } from './SumInsured';

describe('fields/SumInsured', () => {
  it('should render correctly', async () => {
    render(<SumInsured />, { wrapper: withFormWrapper({}) });
    expect(screen.queryAllByRole('textbox')).toHaveLength(2);
  });
});
