import {trendingPublications} from 'mock/data/testing/trendingPublications';
import MyTrendingPublications from "./MyTrendingPublications";
import {transformTrendingPublicationsMetricsData} from 'middleware/trendingPublicationsMiddleware';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps
    };
    return getElement(MyTrendingPublications, props, isShallow);
}

describe('Component MyTrendingPublications', () => {
    it('should render trending publications', () => {
        const wrapper = setup({trendingPublicationsList: transformTrendingPublicationsMetricsData(trendingPublications)});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
