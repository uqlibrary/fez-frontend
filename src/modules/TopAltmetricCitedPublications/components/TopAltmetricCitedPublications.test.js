import {trendingPublications} from 'mock/data/testing/trendingPublications';
import TopAltmetricCitedPublications from './TopAltmetricCitedPublications';

function setup(testProps, isShallow = true){
    const props = {
        actions: {
            searchTopAltmetricCitedPublications: jest.fn()
        },
        ...testProps
    };
    return getElement(TopAltmetricCitedPublications, props, isShallow);
}

describe('Component TopCitedPublications', () => {
    it('should render top cited publications', () => {
        const testFn = jest.fn();
        const wrapper = setup({topCitedPublicationsList: trendingPublications.data, actions: {searchTopAltmetricCitedPublications: testFn}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading indicator', () => {
        const wrapper = setup({loadingTopCitedPublications: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
