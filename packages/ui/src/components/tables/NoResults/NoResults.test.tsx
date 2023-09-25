import React from 'react';
import { composeStories, render, screen } from '../../../test/test-utils';
import Search from '../../../assets/icons/18x18/search.svg';

import * as stories from './NoResults.stories';

const { NoSearchResults } = composeStories(stories);

describe('tables/NoResults', () => {
  it('should render correctly', async () => {
    const title = 'No results for "sphie"';
    const description = ['There are no matching search results.', 'Try using different keywords or checking for typos.'];

    render(<NoSearchResults title={title} description={description} Icon={Search} />);

    expect(screen.queryByTestId('search')).toBeInTheDocument();
    expect(screen.queryByText(title)).toBeInTheDocument();
    expect(screen.queryByText(description[0])).toBeInTheDocument();
    expect(screen.queryByText(description[1])).toBeInTheDocument();
  });
});
