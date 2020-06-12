import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as newsFeedActions from './newsFeed';
import * as newsFeedData from 'mock/data/newsFeed';

describe('NewsFeed actions', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should call loading/loaded actions on successful load', async () => {
        mockApi.onGet(repositories.routes.GET_NEWS_API().apiUrl).reply(200, newsFeedData);

        const expectedActions = [actions.NEWS_LOADING, actions.NEWS_LOADED];

        await mockActionsStore.dispatch(newsFeedActions.loadNewsFeed());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call loading/load failed actions on failed load', async () => {
        mockApi.onAny().reply(404);

        const expectedActions = [actions.NEWS_LOADING, actions.NEWS_LOAD_FAILED];

        await mockActionsStore.dispatch(newsFeedActions.loadNewsFeed());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
