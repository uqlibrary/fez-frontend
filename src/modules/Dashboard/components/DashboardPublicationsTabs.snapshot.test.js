jest.dontMock('./DashboardPublicationsTabs');

import DashboardPublicationsTabs from './DashboardPublicationsTabs';
import * as mock from 'mock/data';
import {trendingPublications} from 'mock/data/testing/trendingPublications';
import {transformTrendingPublicationsMetricsData} from 'middleware/trendingPublicationsEnhancer';

function setup(testProps, isShallow = true) {
    const props = {
        account: mock.accounts.uqresearcher,
        actions: {
            searchLatestPublications: jest.fn(),
            searchTrendingPublications: jest.fn()
        },
        ...testProps
    };
    return getElement(DashboardPublicationsTabs, props, isShallow);
}

describe('Dashboard publication tabs', () => {
    it('should not render any tab by default', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render my latest publications tab', () => {
        const wrapper = setup({
            latestPublicationsList: [mock.record],
            totalPublicationsCount: 1
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render my trending publications tab', () => {
        const wrapper = setup({
            trendingPublicationsList: transformTrendingPublicationsMetricsData(trendingPublications)
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render two tabs for latest publications and trending publications', () => {
        const wrapper = setup({
            trendingPublicationsList: transformTrendingPublicationsMetricsData(trendingPublications),
            latestPublicationsList: [mock.record],
            totalPublicationsCount: 1
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
