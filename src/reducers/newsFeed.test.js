import * as actions from 'actions/actionTypes';
import newsFeedReducer, { initialState } from './newsFeed';
import * as newsFeedData from 'mock/data/newsFeed';

describe('NewsFeed reducer', () => {
    it('should return loading state', () => {
        const incomingState = {
            ...initialState,
            newsFeedList: [{}, {}],
        };

        const expectedState = {
            ...initialState,
        };

        const outgoingState = newsFeedReducer(incomingState, { type: actions.NEWS_LOADING });
        expect(outgoingState).toEqual(expectedState);
    });

    it('should return loaded state', () => {
        const incomingState = {
            ...initialState,
        };

        const expectedState = {
            newsFeedList: newsFeedData,
            loadingNewsFeedList: false,
        };

        const outgoingState = newsFeedReducer(incomingState, { type: actions.NEWS_LOADED, payload: newsFeedData });
        expect(outgoingState).toEqual(expectedState);
    });

    it('should return failed loading state', () => {
        const incomingState = {
            newsFeedList: newsFeedData,
            loadingNewsFeedList: false,
        };

        const expectedState = {
            ...initialState,
            loadingNewsFeedList: false,
        };

        const outgoingState = newsFeedReducer(incomingState, { type: actions.NEWS_LOAD_FAILED, payload: {} });
        expect(outgoingState).toEqual(expectedState);
    });
});
