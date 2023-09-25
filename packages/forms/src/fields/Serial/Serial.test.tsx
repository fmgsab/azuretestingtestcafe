import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';

import { Serial } from './Serial';

describe('fields/Serial', () => {
  const itemSubtype = 'tractor';
  it('should render correctly', async () => {
    render(<Serial />, { wrapper: withFormWrapper({ defaultValues: { itemSubtype } }) });
    expect(screen.queryByRole('textbox')).toBeInTheDocument();
  });
});
