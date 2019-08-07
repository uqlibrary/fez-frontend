import { trendingPublications, trendingPublicationsWithNoSources } from 'mock/data/testing/trendingPublications';
import { MyTrendingPublications } from './MyTrendingPublications';
import { transformTrendingPublicationsMetricsData } from 'actions/academicDataTransformers';
import mui1theme from 'config';

function setup(testProps = {}) {
    const props = {
        classes: {},
        theme: mui1theme,
        actions: {
            searchTrendingPublications: jest.fn(),
        },
        ...testProps,
    };
    return getElement(MyTrendingPublications, props);
}

describe('Component MyTrendingPublications', () => {
    it('should render trending publications', () => {
        const wrapper = setup({
            trendingPublicationsList: transformTrendingPublicationsMetricsData(trendingPublications),
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render trending publications when there are no matching source counts in the api response', () => {
        const wrapper = setup({
            trendingPublicationsList: transformTrendingPublicationsMetricsData(trendingPublicationsWithNoSources),
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading indicator', () => {
        const wrapper = setup({ loadingTrendingPublications: true });
        expect(toJson(wrapper)).toMatchSnapshot();
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
