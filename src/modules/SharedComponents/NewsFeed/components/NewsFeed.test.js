import {newsFeed} from 'mock/data/testing/NewsFeed';
import NewsFeed from './NewsFeed';

function setup(testProps, isShallow = true){
    const props = {
        actions: {
            loadNewsFeed: jest.fn()
        },
        ...testProps
    };
    return getElement(NewsFeed, props, isShallow);
}

describe('Component NewsFeed', () => {
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
});
