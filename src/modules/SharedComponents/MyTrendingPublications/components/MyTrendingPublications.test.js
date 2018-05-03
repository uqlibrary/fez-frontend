import {trendingPublications} from 'mock/data/testing/trendingPublications';
import MyTrendingPublications from './MyTrendingPublications';
import {transformTrendingPublicationsMetricsData} from 'middleware/trendingPublicationsEnhancer';

function setup(testProps, isShallow = true){
    const props = {
        actions: {
            searchTrendingPublications: jest.fn()
        },
        ...testProps
    };
    return getElement(MyTrendingPublications, props, isShallow);
}

describe('Component MyTrendingPublications', () => {
    it('should render trending publications', () => {
        const wrapper = setup({trendingPublicationsList: transformTrendingPublicationsMetricsData(trendingPublications)});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading indicator', () => {
        const wrapper = setup({loadingTrendingPublications: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
