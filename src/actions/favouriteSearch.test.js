import {
    addFavouriteSearch,
    checkForExistingFavouriteSearchAlias,
    deleteFavouriteSearchListItem,
    getFavouriteSearchAlias,
    loadFavouriteSearchList,
    updateFavouriteSearchListItem,
} from './favouriteSearch';
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

            await expect(mockActionsStore.dispatch(loadFavouriteSearchList())).rejects.toMatchObject({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('updateFavouriteSearchListItem action', () => {
        it('should dispatch correct number of actions on favourite search list item successfully updated', async () => {
            mockApi
                .onPut(repositories.routes.FAVOURITE_SEARCH_LIST_API({ id: 1 }).apiUrl)
                .reply(200, { data: { ...mockData.favouriteSearchListItem } });

            const expectedActions = [
                actions.FAVOURITE_SEARCH_ITEM_UPDATING,
                actions.FAVOURITE_SEARCH_ITEM_UPDATE_SUCCESS,
            ];

            await mockActionsStore.dispatch(updateFavouriteSearchListItem({ fvs_id: 1 }, { fvs_id: 1 }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on favourite search list item update failed', async () => {
            mockApi.onPut(repositories.routes.FAVOURITE_SEARCH_LIST_API({ id: 1 }).apiUrl).reply(500);

            const expectedActions = [
                actions.FAVOURITE_SEARCH_ITEM_UPDATING,
                actions.APP_ALERT_SHOW,
                actions.FAVOURITE_SEARCH_ITEM_UPDATE_FAILED,
            ];

            await expect(
                mockActionsStore.dispatch(updateFavouriteSearchListItem({ fvs_id: 1 }, { fvs_id: 1 })),
            ).rejects.toMatchObject({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct of number of actions for existing alias not found while updating', async () => {
            mockApi
                .onGet(repositories.routes.FAVOURITE_SEARCH_LIST_API({ id: 'test' }).apiUrl)
                .reply(404, { data: 'Not found' })
                .onPut(repositories.routes.FAVOURITE_SEARCH_LIST_API({ id: 1 }).apiUrl)
                .reply(200, { data: { ...mockData.favouriteSearchListItem } });

            const expectedActions = [
                actions.EXISTING_ALIAS_CHECK_IN_PROGRESS,
                actions.EXISTING_ALIAS_NOT_FOUND,
                actions.FAVOURITE_SEARCH_ITEM_UPDATING,
                actions.FAVOURITE_SEARCH_ITEM_UPDATE_SUCCESS,
            ];

            await mockActionsStore.dispatch(
                updateFavouriteSearchListItem({ fvs_id: 1, fvs_alias: 'test' }, { fvs_id: 1, fvs_alias: 'testing' }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct of number of actions for existing alias found while updating', async () => {
            mockApi
                .onGet(repositories.routes.FAVOURITE_SEARCH_LIST_API({ id: 'test' }).apiUrl)
                .reply(200, { data: { fvs_id: 1, fvs_alias: 'test', fvs_description: 'test' } });

            const expectedActions = [actions.EXISTING_ALIAS_CHECK_IN_PROGRESS, actions.EXISTING_ALIAS_FOUND];

            await expect(
                mockActionsStore.dispatch(
                    updateFavouriteSearchListItem(
                        { fvs_id: 1, fvs_alias: 'test' },
                        { fvs_id: 1, fvs_alias: 'testing' },
                    ),
                ),
            ).rejects.toEqual(new Error('Alias found'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('deleteFavouriteSearchListItem action', () => {
        it('should dispatch correct number of actions on favourite search list item successfully deleted', async () => {
            mockApi
                .onDelete(repositories.routes.FAVOURITE_SEARCH_LIST_API({ id: 1 }).apiUrl)
                .reply(200, { data: { ...mockData.favouriteSearchListItem } });

            const expectedActions = [
                actions.FAVOURITE_SEARCH_ITEM_DELETING,
                actions.FAVOURITE_SEARCH_ITEM_DELETE_SUCCESS,
            ];

            await mockActionsStore.dispatch(deleteFavouriteSearchListItem({ fvs_id: 1 }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on favourite search list item delete failed', async () => {
            mockApi.onDelete(repositories.routes.FAVOURITE_SEARCH_LIST_API({ id: 1 }).apiUrl).reply(500);

            const expectedActions = [
                actions.FAVOURITE_SEARCH_ITEM_DELETING,
                actions.APP_ALERT_SHOW,
                actions.FAVOURITE_SEARCH_ITEM_DELETE_FAILED,
            ];

            await expect(mockActionsStore.dispatch(deleteFavouriteSearchListItem({ fvs_id: 1 }))).rejects.toMatchObject(
                {
                    status: 500,
                    message:
                        'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
                },
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('checkForExistingFavouriteSearchAlias', () => {
        it('should dispatch correct number of actions for not finding existing alias', async () => {
            mockApi
                .onGet(repositories.routes.FAVOURITE_SEARCH_LIST_API({ id: 'test' }).apiUrl)
                .reply(404, { data: 'Not found' });

            const expectedActions = [actions.EXISTING_ALIAS_CHECK_IN_PROGRESS, actions.EXISTING_ALIAS_NOT_FOUND];

            await mockActionsStore.dispatch(checkForExistingFavouriteSearchAlias({ fvs_id: 1, fvs_alias: 'test' }));

            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions for finding existing alias', async () => {
            mockApi
                .onGet(repositories.routes.FAVOURITE_SEARCH_LIST_API({ id: 'test' }).apiUrl)
                .reply(200, { data: { fvs_id: 1, fvs_alias: 'test', fvs_description: 'test' } });

            const expectedActions = [actions.EXISTING_ALIAS_CHECK_IN_PROGRESS, actions.EXISTING_ALIAS_FOUND];

            await expect(
                mockActionsStore.dispatch(checkForExistingFavouriteSearchAlias({ fvs_id: 1, fvs_alias: 'test' })),
            ).rejects.toEqual(new Error('Alias found'));

            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions for failing existing alias check', async () => {
            mockApi.onGet(repositories.routes.FAVOURITE_SEARCH_LIST_API({ id: 'test' }).apiUrl).reply(500);
            const expectedActions = [
                actions.EXISTING_ALIAS_CHECK_IN_PROGRESS,
                actions.APP_ALERT_SHOW,
                actions.EXISTING_ALIAS_CHECK_FAILED,
            ];

            await expect(
                mockActionsStore.dispatch(checkForExistingFavouriteSearchAlias({ fvs_id: 1, fvs_alias: 'test' })),
            ).rejects.toMatchObject({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });

            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('addFavouriteSearch action', () => {
        it('should dispatch correct number of actions on favourite search successfully added', async () => {
            mockApi
                .onPost(repositories.routes.FAVOURITE_SEARCH_LIST_API().apiUrl)
                .reply(200, { data: { ...mockData.favouriteSearchListItem } });

            const expectedActions = [actions.FAVOURITE_SEARCH_ADDING, actions.FAVOURITE_SEARCH_ADD_SUCCESS];

            await mockActionsStore.dispatch(
                addFavouriteSearch({ fvs_description: 'test', fvs_search_parameters: 'test', fvs_username: 'uqtest' }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on favourite search add failed', async () => {
            mockApi.onPost(repositories.routes.FAVOURITE_SEARCH_LIST_API().apiUrl).reply(500);

            const expectedActions = [
                actions.FAVOURITE_SEARCH_ADDING,
                actions.APP_ALERT_SHOW,
                actions.FAVOURITE_SEARCH_ADD_FAILED,
            ];

            await mockActionsStore.dispatch(
                addFavouriteSearch({
                    fvs_description: 'test',
                    fvs_search_parameters: 'test',
                    fvs_username: 'uqtest',
                }),
            );

            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('getFavouriteSearchAlias action', () => {
        it('should dispatch correct number of actions for not finding existing alias', async () => {
            mockApi
                .onGet(repositories.routes.FAVOURITE_SEARCH_LIST_API({ id: 'test' }).apiUrl)
                .reply(404, { data: 'Not found' });

            const expectedActions = [actions.EXISTING_ALIAS_CHECK_IN_PROGRESS, actions.EXISTING_ALIAS_NOT_FOUND];

            await mockActionsStore.dispatch(getFavouriteSearchAlias({ fvs_id: 1, fvs_alias: 'test' }));

            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions for finding existing alias', async () => {
            mockApi
                .onGet(repositories.routes.FAVOURITE_SEARCH_LIST_API({ id: 'test' }).apiUrl)
                .reply(200, { data: { fvs_id: 1, fvs_alias: 'test', fvs_description: 'test' } });

            const expectedActions = [actions.EXISTING_ALIAS_CHECK_IN_PROGRESS, actions.EXISTING_ALIAS_FOUND];

            await mockActionsStore.dispatch(getFavouriteSearchAlias({ fvs_id: 1, fvs_alias: 'test' }));

            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
