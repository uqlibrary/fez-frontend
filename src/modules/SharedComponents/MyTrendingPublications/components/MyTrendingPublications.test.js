import React from 'react';
import { trendingPublications, trendingPublicationsWithNoSources } from 'mock/data/testing/trendingPublications';
import { MyTrendingPublications } from './MyTrendingPublications';
import { transformTrendingPublicationsMetricsData } from 'actions/academicDataTransformers';
import { render, WithReduxStore, WithRouter } from 'test-utils';
import * as actions from 'actions';

jest.mock('actions', () => ({
    ...jest.requireActual('actions'),
    searchTrendingPublications: jest.fn(),
}));

function setup(testState = {}) {
    const state = {
        myTrendingPublicationsReducer: {
            trendingPublicationsList: transformTrendingPublicationsMetricsData(trendingPublications),
        },
        accountReducer: {},
        ...testState,
    };

    return render(
        <WithReduxStore initialState={state}>
            <WithRouter>
                <MyTrendingPublications />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Component MyTrendingPublications', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render trending publications', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should not render trending publications when there are no matching source counts in the api response', () => {
        const { container } = setup({
            myTrendingPublicationsReducer: {
                trendingPublicationsList: transformTrendingPublicationsMetricsData(trendingPublicationsWithNoSources),
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render loading indicator', () => {
        const { container } = setup({ myTrendingPublicationsReducer: { loadingTrendingPublications: true } });
        expect(container).toMatchSnapshot();
    });

    it('should fetch data if account author details are loaded', () => {
        setup({
            accountReducer: {
                author: {},
            },
        });
        expect(actions.searchTrendingPublications).toHaveBeenCalled();
    });

    it('should not fetch data if account author details is still loading', () => {
        setup();
        expect(actions.searchTrendingPublications).not.toHaveBeenCalled();
    });
});
