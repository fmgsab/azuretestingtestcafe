import React from 'react';
import { act, render, screen } from '../../../test/test-utils';
import { ActionItem, SubHeader } from './SubHeader';


describe('layout/SubHeaders', () => {
  it('should render sub header', async () => {
    await act(() => render(<SubHeader text="Sub Header" />));

    expect(screen.getByText('Sub Header')).toBeInTheDocument();
  });

  it('should render with actionItems', async () => {
    await act(() => render(<SubHeader text="Sub Header" actionItems={[<ActionItem />, <ActionItem />]} />));

    expect(screen.getAllByText('Dropdown Button').length).toBe(2);
  });
});
