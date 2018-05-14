import {trendingPublications} from 'mock/data/testing/trendingPublications';
import TopCitedPublications from './TopCitedPublications';

function setup(testProps, isShallow = true){
    const props = {
        actions: {
            searchTopCitedPublications: jest.fn()
        },
        ...testProps
    };
    return getElement(TopCitedPublications, props, isShallow);
}

describe('Component TopCitedPublications', () => {
    it('should render top cited publications', () => {
        const testFn = jest.fn();
        const wrapper = setup({topCitedPublicationsList: trendingPublications.data, actions: {searchTopCitedPublications: testFn}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading indicator', () => {
        const wrapper = setup({loadingTopCitedPublications: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
