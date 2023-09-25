import React from 'react';
import { composeStories, render, screen } from '../../../test/test-utils';

import * as stories from './Appointment.stories';

const { Default, Loading } = composeStories(stories);

describe('cards/Appointment', () => {
  it('should render correctly', async () => {
    render(<Default />);
    expect(screen.getByText('Kent Bailey')).toBeInTheDocument();
    expect(screen.getByText('12 December 2022')).toBeInTheDocument();
    expect(screen.getByText('12:45pm')).toBeInTheDocument();
    expect(screen.getByText('448 Pa Valley Road')).toBeInTheDocument();
    expect(screen.getByText('Eketāhuna, 4993')).toBeInTheDocument();
    expect(screen.getByText('+ New Application')).toBeInTheDocument();
  });

  it('should render Loading correctly', async () => {
    render(<Loading />);
    expect(screen.queryByText('Kent Bailey')).not.toBeInTheDocument();
    expect(screen.queryByText('12 December 2022')).not.toBeInTheDocument();
    expect(screen.queryByText('12:45pm')).not.toBeInTheDocument();
    expect(screen.queryByText('448 Pa Valley Road')).not.toBeInTheDocument();
    expect(screen.queryByText('Eketāhuna, 4993')).not.toBeInTheDocument();
    expect(screen.queryByText('+ New Application')).not.toBeInTheDocument();
  });
});
