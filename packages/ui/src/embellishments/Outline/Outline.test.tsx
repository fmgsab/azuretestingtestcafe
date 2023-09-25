import React from 'react';
import { render } from '../../test/test-utils';

import { Outline } from './Outline';

describe('decorators/Outline', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  it.each`
    as
    ${'section'}
    ${'div'}
  `('should render $as', async ({ as }) => {
    const { container } = render(<Outline as={as}>Hello</Outline>);
    const element = container.querySelector(as);
    expect(element).toBeInTheDocument();
  });
});
