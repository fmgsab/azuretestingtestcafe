import { z } from 'zod';
import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import * as context from '@fmg/ui/src/context/ModelContext';

import { Modifications } from './Modifications';

describe('fieldsets/Modifications', () => {
  const useModelContextSpy = vi.spyOn(context, 'useModelContext');
  useModelContextSpy.mockReturnValue({ schema: z.object({}), uid: 0 });

  it('should render correctly', async () => {
    render(<Modifications />, {
      wrapper: withFormWrapper({ defaultValues: { hasModification: 'true', viModifications: [{}] } }),
    });
    expect(screen.queryByText('Type')).toBeInTheDocument();
    expect(screen.queryByText('Sum Insured')).toBeInTheDocument();
    expect(screen.queryByText('Description')).toBeInTheDocument();
  });

  it('should handle reference', async () => {
    render(<Modifications reference={{ key: 'itemSubtype', condition: (i) => ['abc'].includes(`${i}`) }} />, {
      wrapper: withFormWrapper({ defaultValues: { itemSubtype: 'abc', hasModification: 'true', viModifications: [{}] } }),
    });
    expect(screen.queryByText('Type')).toBeInTheDocument();
    expect(screen.queryByText('Sum Insured')).toBeInTheDocument();
    expect(screen.queryByText('Description')).toBeInTheDocument();
  });
});
