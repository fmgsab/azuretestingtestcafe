import { composeStories, render, screen } from '../../../test/test-utils';
import * as stories from './NumericInput.stories';

const { Default, Currency, SumInsured, Suffix } = composeStories(stories);

describe('form-widgets/Affix Input', () => {
  it('should render $Default.storyName', async () => {
    render(<Default />);
    expect(screen.getByTestId('numeric-input')).toBeInTheDocument();
  });

  it('should render $Currency.storyName', async () => {
    render(<Currency />);
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('should render $Currency.storyName', async () => {
    render(<Suffix />);
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it.each`
    placeholder             | expected
    ${undefined}            | ${'Sum Insured'}
    ${'Custom placeholder'} | ${'Custom placeholder'}
  `('should render $SumInsured.storyName with $expected placeholder text', async ({ placeholder, expected }) => {
    render(<SumInsured placeholder={placeholder} />);
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(expected)).toBeInTheDocument();
  });
});
