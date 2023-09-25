import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';

import { GLW } from './GLW';

describe('fields/GLW', () => {
  it('should render correctly', async () => {
    render(<GLW />, {
      wrapper: withFormWrapper({ defaultValues: { itemSubtype: 'tractor' } }),
    });
    const textbox = screen.queryByRole('textbox');
    expect(textbox).toBeInTheDocument();
  });
});
