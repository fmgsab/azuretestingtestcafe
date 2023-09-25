import React from 'react';
import { render } from '../../../../test/test-utils';

import { Currency } from './Currency';

describe('atoms/intl/Currency', () => {
  it('should format number type correctly', async () => {
    const { container } = render(<Currency value={12345} />);
    expect(container).toHaveTextContent('$12,345');
  });

  it('should render integer correctly', async () => {
    const { container } = render(<Currency value="12345" />);
    expect(container).toHaveTextContent('$12,345');
  });

  it('should render already formatted currency correctly', async () => {
    const { container } = render(<Currency value="12,345.00" />);
    expect(container).toHaveTextContent('$12,345');
  });

  it('should trim correctly', async () => {
    const { container } = render(<Currency value="12345.00" />);
    expect(container).toHaveTextContent('$12,345');
  });

  it('should add decimal places correctly', async () => {
    const { container } = render(<Currency value="12345.1" />);
    expect(container).toHaveTextContent('$12,345.10');
  });

  it('should render double correctly', async () => {
    const { container } = render(<Currency value="12345.12" />);
    expect(container).toHaveTextContent('$12,345.12');
  });

  it('should round correctly', async () => {
    const { container } = render(<Currency value="12345.126" />);
    expect(container).toHaveTextContent('$12,345.13');
  });

  it('should render NaN correctly', async () => {
    const { container } = render(<Currency value="non number" />);
    expect(container).toHaveTextContent('');
  });

  it('should render fallback correctly', async () => {
    const { container } = render(<Currency value="non number" fallback="-" />);
    expect(container).toHaveTextContent('-');
  });

  it('should override props correctly', async () => {
    const props = {
      minimumFractionDigits: 2,
    };
    const { container } = render(<Currency value="12345.00" fallback="-" {...props} />);
    expect(container).toHaveTextContent('$12,345.00');
  });
});
