import { loadFavouriteSearchList } from './favouriteSearch';
import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as mockData from 'mock/data/testing/favouriteSearch';

describe('favouriteSearch actions', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('loadFavouriteSearchList action', () => {
        it('should dispatch correct number of actions on loading favourite search list', async () => {
            mockApi
                .onGet(repositories.routes.FAVOURITE_SEARCH_LIST_API().apiUrl)
                .reply(200, { data: { ...mockData.favouriteSearchList } });

            const expectedActions = [actions.FAVOURITE_SEARCH_LIST_LOADING, actions.FAVOURITE_SEARCH_LIST_LOADED];

            await mockActionsStore.dispatch(loadFavouriteSearchList());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on failed to load favourite search list', async () => {
            mockApi.onGet(repositories.routes.FAVOURITE_SEARCH_LIST_API().apiUrl).reply(500);

            const expectedActions = [
                actions.FAVOURITE_SEARCH_LIST_LOADING,
                actions.APP_ALERT_SHOW,
                actions.FAVOURITE_SEARCH_LIST_FAILED,
            ];

            await expect(mockActionsStore.dispatch(loadFavouriteSearchList())).rejects.toEqual({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
