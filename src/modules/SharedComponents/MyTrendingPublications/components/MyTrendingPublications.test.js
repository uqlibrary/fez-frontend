import React from 'react';
import { trendingPublications, trendingPublicationsWithNoSources } from 'mock/data/testing/trendingPublications';
import { MyTrendingPublications } from './MyTrendingPublications';
import { transformTrendingPublicationsMetricsData } from 'actions/academicDataTransformers';
import mui1theme from 'config';
import { render, WithReduxStore, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        classes: {},
        theme: mui1theme,
        actions: {
            searchTrendingPublications: jest.fn(),
        },
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <WithRouter>
                <MyTrendingPublications {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Component MyTrendingPublications', () => {
    it('should render trending publications', () => {
        const { container } = setup({
            trendingPublicationsList: transformTrendingPublicationsMetricsData(trendingPublications),
        });
        expect(container).toMatchSnapshot();
    });

    it('should not render trending publications when there are no matching source counts in the api response', () => {
        const { container } = setup({
            trendingPublicationsList: transformTrendingPublicationsMetricsData(trendingPublicationsWithNoSources),
        });
        expect(container).toMatchSnapshot();
    });

    it('should render loading indicator', () => {
        const { container } = setup({ loadingTrendingPublications: true });
        expect(container).toMatchSnapshot();
    });

    it('should fetch data if account author details is loaded', () => {
        const testFn = jest.fn();
        setup({ accountAuthorDetailsLoading: false, actions: { searchTrendingPublications: testFn } });
        expect(testFn).toHaveBeenCalled();
    });

    it('should not fetch data if account author details is still loading', () => {
        const testFn = jest.fn();
        setup({ accountAuthorDetailsLoading: true, actions: { searchTrendingPublications: testFn } });
        expect(testFn).not.toBeCalled();
    });
});
