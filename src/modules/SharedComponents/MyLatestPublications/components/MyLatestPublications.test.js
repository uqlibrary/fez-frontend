import {latestPubsPayload} from 'mock/data/testing/latestPublications';
import {MyLatestPublications} from './MyLatestPublications';

function setup(testProps, isShallow = true){
    const props = {
        history: {},
        actions: {
            searchLatestPublications: jest.fn()
        },
        classes: {blueButton: 'blueButton'},
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

    it('should fetch data if account author details is loaded', () => {
        const testFn = jest.fn();
        setup({accountAuthorDetailsLoading: false, actions: {searchLatestPublications: testFn}});
        expect(testFn).toHaveBeenCalled();
    });

    it('should not fetch data if account author details is still loading', () => {
        const testFn = jest.fn();
        setup({accountAuthorDetailsLoading: true, actions: {searchLatestPublications: testFn}});
        expect(testFn).toHaveBeenCalledTimes(0);
    });

    it('_viewMyResearch method', () => {
        const testFn = jest.fn();
        const wrapper = setup({history: {push: testFn}});
        wrapper.instance()._viewMyResearch();
        expect(testFn).toHaveBeenCalledWith('/records/mine');
    });

    describe('FileName component', () => {
        it('should get styles for full render', () => {
            const wrapper = setup({}, false);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});
