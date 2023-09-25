import React from 'react';
import { render, screen } from '../../../test/test-utils';

import { DataCell } from './DataCell';

describe('tables/item-summary/DataCell', () => {
  it('should render content correctly', async () => {
    const content = 'Cell content';
    const { rerender } = render(<DataCell content={content} />);
    const textContent = screen.getByText('Cell content');
    expect(textContent).toHaveClass('truncate');

    rerender(<DataCell content={content} keepContent />);
    expect(textContent).not.toHaveClass('truncate');
  });

  it('should set role correctly', async () => {
    const content = 'Cell content';
    const { container } = render(<DataCell content={content} onClick={(e) => e} />);

    expect(container.children[0]).toHaveAttribute('role');
  });
});
