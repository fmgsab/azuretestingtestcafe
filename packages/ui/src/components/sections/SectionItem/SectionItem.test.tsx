import React from 'react';
import { composeStories, render, screen, userEvent } from '../../../test/test-utils';

import * as stories from './SectionItem.stories';

const { ItemType, ItemTypeActive, SubItem, SubItemDisabled, SubItemActive } = composeStories(stories);

describe('sections/SectionItem', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.clearAllTimers();
  });

  it.each`
    Story
    ${ItemType}
    ${SubItem}
  `('should render $Story.storyName correctly', async ({ Story }) => {
    const { container } = render(<Story title="Section Item" />);
    expect(container.children.item(0)?.className).toContain('hover:');
    expect(container.children.item(0)?.className).toContain('active:');
    expect(container.children.item(0)?.className).toContain('group-focus-visible:bg');
    expect(container.children.item(0)?.className).toContain(' focus-visible:bg');
  });

  it.each`
    Story
    ${ItemType}
    ${SubItem}
  `('should render $Story.storyName correctly without focusing', async ({ Story }) => {
    const { container, rerender } = render(<Story isDisabled />);
    expect(container.children.item(0)?.className).not.toContain('group-focus-visible:bg');
    expect(container.children.item(0)?.className).not.toContain(' focus-visible:bg');

    rerender(<Story isFocusDisabled />);
    expect(container.children.item(0)?.className).toContain('group-focus-visible:bg');
    expect(container.children.item(0)?.className).not.toContain(' focus-visible:bg');
  });

  it.each`
    Story
    ${ItemTypeActive}
    ${SubItemDisabled}
    ${SubItemActive}
  `('should render $Story.storyName correctly', async ({ Story }) => {
    const { container } = render(<Story />);
    expect(container.children.item(0)?.className).not.toContain('hover:');
    expect(container.children.item(0)?.className).not.toContain('active:');
  });

  it.each`
    Story              | testId
    ${ItemType}        | ${'add-action'}
    ${SubItemDisabled} | ${'remove-action'}
  `('should not render action item of $Story.storyName', async ({ Story, testId }) => {
    render(<Story />);
    expect(screen.queryByTestId(testId)).not.toBeVisible();
  });

  it.each`
    Story             | testId
    ${ItemTypeActive} | ${'add-action'}
    ${SubItemActive}  | ${'remove-action'}
  `('should render action item $Story.storyName correctly', async ({ Story, testId }) => {
    render(<Story />);
    vi.advanceTimersByTime(500);
    expect(screen.getByTestId(testId)).toBeVisible();
  });

  it.each`
    Story              | isFocusDisabled | fnCalledTimes
    ${SubItemDisabled} | ${true}         | ${0}
    ${SubItemDisabled} | ${false}        | ${0}
    ${ItemTypeActive}  | ${true}         | ${0}
    ${SubItemActive}   | ${true}         | ${0}
    ${ItemTypeActive}  | ${false}        | ${1}
    ${SubItemActive}   | ${false}        | ${1}
  `(
    'should fire enter event $fnCalledTimes times correctly for $Story.storyName when focus disabled=$isFocusDisabled',
    async ({ Story, isFocusDisabled, fnCalledTimes }) => {
      const user = userEvent.setup();
      vi.useRealTimers();
      const onClickFn = vi.fn();
      render(<Story onClick={onClickFn} isFocusDisabled={isFocusDisabled} />);
      await user.tab();
      await user.keyboard('{shift}');
      expect(onClickFn).toHaveBeenCalledTimes(0);
      await user.keyboard('{enter}');
      expect(onClickFn).toHaveBeenCalledTimes(fnCalledTimes);
    }
  );
});
