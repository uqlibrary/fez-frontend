import {latestPubsPayload} from 'mock/data/testing/latestPublications';
import MyLatestPublications from './MyLatestPublications';

function setup(testProps, isShallow = true){
    const props = {
        actions: {
            searchLatestPublications: jest.fn()
        },
        ...testProps
    };
    return getElement(MyLatestPublications, props, isShallow);
}

describe('Component MyLatestPublications', () => {
    it('should render latest publications', () => {
        const wrapper = setup({latestPublicationsList: latestPubsPayload.data, totalPublicationsCount: latestPubsPayload.total});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading indicator', () => {
        const wrapper = setup({loadingLatestPublications: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
