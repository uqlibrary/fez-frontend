import React from 'react';
import { formattedData } from 'mock/data/testing/publicationStats';
import { PublicationStats } from './PublicationStats';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        classes: {},
        ...testProps,
    };
    return rtlRender(<PublicationStats {...props} />);
}

describe('PublicationStats component', () => {
    it('should render statistics with table and data', () => {
        const { container } = setup({ publicationsStats: formattedData });
        expect(container).toMatchSnapshot();
    });

    it('should render an empty component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render the h-index help link to the UQ guide when enabled', () => {
        const { getByTestId } = setup({ publicationsStats: formattedData, showHindexHelpLink: true });
        const link = getByTestId('hindex-help-link');
        expect(link).toHaveAttribute(
            'href',
            'https://guides.library.uq.edu.au/research-and-teaching-staff/calculate-h-index',
        );
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('aria-label', 'Learn more about the h-index (opens in a new tab)');
    });

    it('should not render the h-index help link by default', () => {
        const { queryByTestId } = setup({ publicationsStats: formattedData });
        expect(queryByTestId('hindex-help-link')).not.toBeInTheDocument();
    });

    it('should render 1 for hindex because they round up to 1', () => {
        const fakeData = {
            thomson_citation_count_i: {
                count: 301,
                avg: 24.498338870432,
                sum: 7374,
                hindex: 0.9, // from GET/hindex response.hindex_incites
                years: '1992-2017',
            },
            scopus_citation_count_i: {
                count: 210,
                avg: 25.22380952381,
                sum: 5297,
                hindex: 0.51, // from GET/hindex response.hindex_scopus
                years: '1992-2017',
            },
        };
        const { container } = setup({ publicationsStats: fakeData });
        expect(container).toMatchSnapshot();
    });

    it('should render N/A for hindex because they equal zero', () => {
        const fakeData = {
            thomson_citation_count_i: {
                count: 301,
                avg: 24.498338870432,
                sum: 7374,
                hindex: 0.499, // from GET/hindex response.hindex_incites
                years: '1992-2017',
            },
            scopus_citation_count_i: {
                count: 210,
                avg: 25.22380952381,
                sum: 5297,
                hindex: 0.001, // from GET/hindex response.hindex_scopus
                years: '1992-2017',
            },
        };
        const { container } = setup({ publicationsStats: fakeData });
        expect(container).toMatchSnapshot();
    });

    it('should render N/A for hindex because it is null', () => {
        const fakeData = {
            thomson_citation_count_i: {
                count: 301,
                avg: 24.498338870432,
                sum: 7374,
                hindex: null, // from GET/hindex response.hindex_incites
                years: '1992-2017',
            },
            scopus_citation_count_i: {
                count: 210,
                avg: 25.22380952381,
                sum: 5297,
                hindex: null, // from GET/hindex response.hindex_scopus
                years: '1992-2017',
            },
        };
        const { container } = setup({ publicationsStats: fakeData });
        expect(container).toMatchSnapshot();
    });

    it('should render N/A for hindex because it is undefined', () => {
        const fakeData = {
            thomson_citation_count_i: {
                count: 301,
                avg: 24.498338870432,
                sum: 7374,
                hindex: undefined, // from GET/hindex response.hindex_incites
                years: '1992-2017',
            },
            scopus_citation_count_i: {
                count: 210,
                avg: 25.22380952381,
                sum: 5297,
                hindex: undefined, // from GET/hindex response.hindex_scopus
                years: '1992-2017',
            },
        };
        const { container } = setup({ publicationsStats: fakeData });
        expect(container).toMatchSnapshot();
    });
});
