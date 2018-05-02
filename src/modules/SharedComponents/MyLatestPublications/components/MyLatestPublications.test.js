import {latestPubsPayload} from 'mock/data/testing/latestPublications';
import MyLatestPublications from './MyLatestPublications';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps
    };
    return getElement(MyLatestPublications, props, isShallow);
}

describe('Component MyLatestPublications', () => {
    it('should render latest publications', () => {
        const wrapper = setup({latestPublicationsList: latestPubsPayload.data, totalPublicationsCount: latestPubsPayload.total});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
