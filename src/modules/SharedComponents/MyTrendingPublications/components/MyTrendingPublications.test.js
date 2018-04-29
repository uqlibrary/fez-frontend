import {trendingPublications} from 'mock/data/testing/trendingPublications';
import MyTrendingPublications from "./MyTrendingPublications";
import {transformTrendingPublicationsMetricsData} from 'middleware/trendingPublicationsMiddleware';

function setup(testProps, isShallow = true){
    const props = {
        account: {id: 1},
        actions: {
            searchTrendingPublications: jest.fn()
        },
        ...testProps
    };
    return getElement(MyTrendingPublications, props, isShallow);
}

describe('Component MyTrendingPublications', () => {
    let myTrendingPublications;
    beforeEach(() => {
        myTrendingPublications = transformTrendingPublicationsMetricsData(trendingPublications);
    });

    it('should render loading spinner', () => {
        const wrapper = setup({loadingTrendingPublications: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render trending publications', () => {
        const wrapper = setup({trendingPublicationsList: myTrendingPublications});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});