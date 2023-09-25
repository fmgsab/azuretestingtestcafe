import { composeStories, render, screen } from '../../../test/test-utils';
import * as stories from './AffixInput.stories';
import { act } from '@testing-library/react';

const { Text, Numeric, ErrorIcon, NoErrorIcon } = composeStories(stories);

describe('form-widgets/Affix Input', () => {
  it('should use the native input when isNumeric is false', async () => {
    await act(() => render(<Text />));
    expect(screen.getByTestId('native-input')).toBeInTheDocument();
  });

  it('should use the numeric input when isNumeric is true', async () => {
    await act(() => render(<Numeric />));
    expect(screen.getByTestId('numeric-input')).toBeInTheDocument();
  });

  it('should show Error icon', async () => {
    await act(() => render(<ErrorIcon />));
    expect(screen.getByTestId('invalid-icon')).toBeInTheDocument();
  });

  it('should show not Error icon', async () => {
    await act(() => render(<NoErrorIcon />));
    expect(screen.queryByTestId('invalid-icon')).not.toBeInTheDocument();
  });
});
