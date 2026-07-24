import React from 'react';
import AuthorStatisticsView from './AuthorStatisticsView';
import { render, WithReduxStore } from 'test-utils';
import * as actions from 'actions';

jest.mock('actions', () => ({
    ...jest.requireActual('actions'),
    loadAuthorStatsByAuthorId: jest.fn(() => jest.fn()),
}));

const authorStatsData = {
    authorStatsByYear: {
        series: [{ name: 'Journal Article', data: [5, 10, 8] }],
        categories: [2020, 2021, 2022],
    },
    authorStatsPerType: [
        ['Journal Article', 100],
        ['Conference Paper', 50],
    ],
    authorStats: {
        thomson_citation_count_i: {
            count: 80,
            hindex: 15,
            avg: 10.5,
            sum: 840,
            years: '2010 - 2022',
        },
        scopus_citation_count_i: {
            count: 100,
            hindex: 18,
            avg: 12.3,
            sum: 1230,
            years: '2010 - 2022',
        },
    },
};

const setup = (props = {}, stateOverrides = {}) => {
    const initialState = {
        authorStatisticsReducer: {
            loadingAuthorStats: false,
            authorStatsByYear: null,
            authorStatsPerType: null,
            authorStats: null,
            ...stateOverrides,
        },
    };
    return render(
        <WithReduxStore initialState={initialState}>
            <AuthorStatisticsView authorId="193" {...props} />
        </WithReduxStore>,
    );
};

describe('AuthorStatisticsView', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('dispatches loadAuthorStatsByAuthorId with authorId on mount', () => {
        setup();
        expect(actions.loadAuthorStatsByAuthorId).toHaveBeenCalledWith('193');
    });

    it('does not dispatch when authorId is not provided', () => {
        setup({ authorId: null });
        expect(actions.loadAuthorStatsByAuthorId).not.toHaveBeenCalled();
    });

    it('shows a loader while stats are loading', () => {
        const { getByTestId } = setup({}, { loadingAuthorStats: true });
        expect(getByTestId('author-stats-loading')).toBeInTheDocument();
    });

    it('renders the three stat sections when data is loaded', () => {
        const { getByText } = setup({}, authorStatsData);
        expect(getByText('UQ eSpace works per year')).toBeInTheDocument();
        expect(getByText('Work types overview')).toBeInTheDocument();
    });

    it('does not render stats table when citation counts are zero', () => {
        const { queryByText } = setup(
            {},
            {
                ...authorStatsData,
                authorStats: {
                    thomson_citation_count_i: { count: 0 },
                    scopus_citation_count_i: { count: 0 },
                },
            },
        );
        expect(queryByText('Web of science')).not.toBeInTheDocument();
    });

    it('renders nothing when there is no stats data', () => {
        const { queryByText } = setup();
        expect(queryByText('UQ eSpace works per year')).not.toBeInTheDocument();
        expect(queryByText('Work types overview')).not.toBeInTheDocument();
    });

    it('does not render the types chart when authorStatsPerType is empty', () => {
        const { queryByText } = setup(
            {},
            {
                ...authorStatsData,
                authorStatsPerType: [],
            },
        );
        expect(queryByText('Work types overview')).not.toBeInTheDocument();
    });
});
