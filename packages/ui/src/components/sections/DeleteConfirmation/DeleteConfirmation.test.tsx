import { render, screen, userEvent } from '../../../test/test-utils';
import * as ctx from '../../../context/NavContext';

import { DeleteConfirmation } from './DeleteConfirmation';

describe('sections/DeleteConfirmation', () => {
  it('should render correctly', async () => {
    const confirmFn = vi.fn();
    vi.spyOn(ctx, 'useNavContext').mockReturnValue({
      onConfirm: confirmFn,
      push: vi.fn(),
      replace: vi.fn(),
      shouldConfirm: true,
      openConfirmation: vi.fn(),
    });

    render(<DeleteConfirmation isOpen={true} toggleVisible={vi.fn()} />);

    const deleteBtn = screen.queryByText('Delete');
    expect(deleteBtn).toBeInTheDocument();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await userEvent.click(deleteBtn!);

    expect(confirmFn).toHaveBeenCalled();
  });
});
