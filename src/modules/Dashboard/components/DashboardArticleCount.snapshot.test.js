import React from 'react';
import { DashboardArticleCount } from './DashboardArticleCount';
import { currentAuthorStats, authorDetails } from 'mock/data';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        classes: {},
        ...testProps,
    };
    return rtlRender(<DashboardArticleCount {...props} />);
}

describe('Dashboard Article Count test', () => {
    it('Render the authors article counts as expected for a UQ researcher)', () => {
        const articleCount = currentAuthorStats.total;
        const articleFirstYear = authorDetails.uqresearcher.espace.first_year;
        const articleLastYear = authorDetails.uqresearcher.espace.last_year;
        const { container } = setup({
            articleCount,
            articleFirstYear,
            articleLastYear,
        });
        expect(container).toMatchSnapshot();
    });

    it('should not render anything if any data is missing', () => {
        const articleCount = currentAuthorStats.total;
        const { container } = setup({
            articleCount,
        });
        expect(container).toMatchSnapshot();
    });
});
