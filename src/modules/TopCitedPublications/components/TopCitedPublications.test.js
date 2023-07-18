import React from 'react';
import { useWidth } from 'hooks';
import { trendingPublications } from 'mock/data/testing/trendingPublications';
import { default as TopCitedPublications } from './TopCitedPublications';
import { transformTrendingPublicationsMetricsData } from 'actions/academicDataTransformers';
import { render, WithReduxStore, WithRouter, fireEvent } from 'test-utils';

jest.mock('../../../hooks', () => ({
    useWidth: jest.fn(() => 'xs'),
    useRecordsSelector: jest.requireActual('../../../hooks').useRecordsSelector,
}));
function setup(testProps) {
    const props = {
        classes: {},
        theme: {},
        actions: {
            searchTopCitedPublications: jest.fn(),
        },
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <WithRouter>
                <TopCitedPublications {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Component TopCitedPublications', () => {
    beforeEach(() => {
        useWidth.mockImplementation(() => 'xs');
    });

    it('should render top cited publications with default width xs', () => {
        const { container } = setup({
            topCitedPublicationsList: transformTrendingPublicationsMetricsData(trendingPublications),
        });
        expect(container).toMatchSnapshot();
    });

    it('should render tabs larger than xs width properly', () => {
        useWidth.mockImplementation(() => 'sm');
        const { container } = setup({
            topCitedPublicationsList: transformTrendingPublicationsMetricsData(trendingPublications),
            width: 'sm',
        });
        expect(container).toMatchSnapshot();
    });

    it('should render loading indicator', () => {
        const { container } = setup({ loadingTopCitedPublications: true });
        expect(container).toMatchSnapshot();
    });

    it('should render top cited publications module with not available message', () => {
        const testFn = jest.fn();
        const { container } = setup({
            topCitedPublicationsList: [],
            loadingTopCitedPublications: false,
            actions: { searchTopCitedPublications: testFn },
        });

        expect(container).toMatchSnapshot();
    });

    it('should set state on tab change', () => {
        const { getByText, queryByText, getByRole } = setup({
            topCitedPublicationsList: transformTrendingPublicationsMetricsData(trendingPublications),
        });
        const title1 = 'Development and implementation of papillomavirus prophylactic vaccines';
        const title2 = 'Prophylactic HPV vaccines: Underlying mechanisms';

        expect(getByRole('tab', { selected: true })).toHaveTextContent('Trending');
        expect(getByText(title1)).toBeInTheDocument();
        expect(queryByText(title2)).not.toBeInTheDocument();

        fireEvent.click(getByRole('tab', { name: 'WOS' }));

        expect(getByRole('tab', { selected: true })).toHaveTextContent('WOS');
        expect(queryByText(title1)).not.toBeInTheDocument();
        expect(getByText(title2)).toBeInTheDocument();
    });

    it('should select first loaded tab as default if preferred has not loaded', () => {
        const { getByRole } = setup({
            topCitedPublicationsList: [{ key: 'scopus', values: [{ rek_title: 'pub', metricData: {} }], order: 1 }],
        });
        expect(getByRole('tab', { selected: true })).toHaveTextContent('Scopus');
    });
});
