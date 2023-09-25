import React from 'react';
import { composeStories, render, screen, fireEvent, userEvent } from '../../../test/test-utils';
import * as stories from './Modal.stories';
import { Modal } from './Modal';

const { Delete } = composeStories(stories);

describe('overlays/Modal', () => {
  it('Modal should render correctly and buttons open and close as expected', async () => {
    render(<Delete />);
    const openButton = screen.getByRole('button');
    fireEvent.click(openButton);
    const buttonError = screen.getByText('Delete');
    const buttonSecondary = screen.getByText('Cancel');
    const modal = screen.getByLabelText('Modal');
    expect(modal).toContainHTML('aria-hidden="false"');
    expect(buttonSecondary).toHaveClass('btn-block btn-secondary');
    expect(buttonError).toHaveClass('btn-block btn-error');

    //Test secondary button click
    fireEvent.click(buttonSecondary);
    expect(modal).toContainHTML('aria-hidden="true"');

    //Test primary button click
    fireEvent.click(openButton);
    fireEvent.click(buttonError);
    expect(modal).toContainHTML('aria-hidden="true"');

    //Test background click
    fireEvent.click(openButton);
    fireEvent.click(modal);
    expect(modal).toContainHTML('aria-hidden="true"');
  });

  it('should handle primary click and render nothing when no secondaryButton passed', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(
      <Modal
        isOpen={true}
        mainButtonOnClick={handler}
        mainButtonLabel="Main Label"
        heading="Main Heading"
        toggleVisible={() => {
          return;
        }}
      />
    );

    const mainButton = screen.getByText('Main Label');
    expect(mainButton).toBeInTheDocument();

    await user.click(mainButton);
    expect(handler).toHaveBeenCalled();
  });
});
