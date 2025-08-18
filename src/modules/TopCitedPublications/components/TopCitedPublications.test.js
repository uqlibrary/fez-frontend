import React from 'react';
import { useWidth } from 'hooks';
import { trendingPublications } from 'mock/data/testing/trendingPublications';
import { default as TopCitedPublications } from './TopCitedPublications';
import { transformTrendingPublicationsMetricsData } from 'actions/academicDataTransformers';
import { rtlRender, WithReduxStore, WithRouter, fireEvent } from 'test-utils';

jest.mock('../../../hooks', () => ({
    ...jest.requireActual('../../../hooks'),
    useWidth: jest.fn(() => 'xs'),
}));

function setup(testProps = {}, testState = {}) {
    const props = {
        ...testProps,
    };
    const state = {
        topCitedPublicationsReducer: {
            topCitedPublicationsList: [],
            loadingTopCitedPublications: false,
            loadedTopCitedPublications: true,
            ...testState,
        },
    };

    return rtlRender(
        <WithReduxStore initialState={state}>
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
        const { container } = setup(
            {},
            {
                topCitedPublicationsList: transformTrendingPublicationsMetricsData(trendingPublications),
            },
        );
        expect(container).toMatchSnapshot();
    });

    it('should render tabs larger than xs width properly', () => {
        useWidth.mockImplementation(() => 'sm');
        const { container } = setup(
            {},
            {
                topCitedPublicationsList: transformTrendingPublicationsMetricsData(trendingPublications),
            },
        );
        expect(container).toMatchSnapshot();
    });

    it('should render loading indicator', () => {
        const { container } = setup({}, { loadingTopCitedPublications: true });
        expect(container).toMatchSnapshot();
    });

    it('should render top cited publications module with not available message', () => {
        const { container } = setup(
            {},
            {
                topCitedPublicationsList: [],
            },
        );

        expect(container).toMatchSnapshot();
    });

    it('should set state on tab change', () => {
        const { getByText, queryByText, getByRole } = setup(
            {},
            {
                topCitedPublicationsList: transformTrendingPublicationsMetricsData(trendingPublications),
            },
        );
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
        const { getByRole } = setup(
            {},
            {
                topCitedPublicationsList: [{ key: 'scopus', values: [{ rek_title: 'pub', metricData: {} }], order: 1 }],
            },
        );
        expect(getByRole('tab', { selected: true })).toHaveTextContent('Scopus');
    });
});
