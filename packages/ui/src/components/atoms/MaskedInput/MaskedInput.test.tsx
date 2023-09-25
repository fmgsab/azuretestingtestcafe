import React from 'react';
import * as stories from './MaskedInput.stories';
import { composeStories, render, screen, userEvent, withFormWrapper } from '../../../test/test-utils';

const { Default, Mobile, Work, Home } = composeStories(stories);

describe('atoms/MaskedInput', () => {
  it.each`
    Component  | expected
    ${Default} | ${'01-234-5678'}
    ${Home}    | ${'01-234-5678'}
    ${Work}    | ${'01-234-5678 x91011'}
    ${Mobile}  | ${'012-345-67891'}
  `('should mask input correctly for $Component.storyName type', async ({ Component, expected }) => {
    const user = userEvent.setup({ delay: 20 });
    render(<Component />);
    const input = screen.getByTestId('text-input-undefined');
    await user.type(input, '01234567891011121314');

    expect(input).toHaveValue(expected);
  });

  it('should use correct phone type', async () => {
    const user = userEvent.setup({ delay: 20 });
    render(<Default />, { wrapper: withFormWrapper({ defaultValues: { phone: { type: 'home' } } }) });
    const input = screen.getByTestId('text-input-undefined');
    await user.type(input, '01234567891011121314');

    expect(input).toHaveValue('01-234-5678');
  });
});
