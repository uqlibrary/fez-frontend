import {trendingPublications} from 'mock/data/testing/trendingPublications';
import {TopCitedPublicationsClass} from './TopCitedPublications';
import {transformTrendingPublicationsMetricsData} from 'actions/academicDataTransformers';

function setup(testProps, isShallow = true){
    const props = {
        classes: {},
        theme: {},
        actions: {
            searchTopCitedPublications: jest.fn()
        },
        ...testProps
    };
    return getElement(TopCitedPublicationsClass, props, isShallow);
}

describe('Component TopCitedPublications', () => {
    it('should render top cited publications', () => {
        const testFn = jest.fn();
        const wrapper = setup({topCitedPublicationsList: transformTrendingPublicationsMetricsData(trendingPublications), actions: {searchTopCitedPublications: testFn}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading indicator', () => {
        const wrapper = setup({loadingTopCitedPublications: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render top cited publications module with not available message', () => {
        const testFn = jest.fn();
        const wrapper = setup({
            topCitedPublicationsList: [],
            loadingTopCitedPublications: false,
            actions: {searchTopCitedPublications: testFn}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
