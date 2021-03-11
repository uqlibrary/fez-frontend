import { deleteAuthorListItem, loadAuthorList, updateAuthorListItem, addAuthor } from './authorsList';
import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as mockData from 'mock/data/testing/authorsList';

describe('author list actions', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('loadAuthorList action', () => {
        it('should dispatch correct number of actions on loading author list', async () => {
            mockApi
                .onGet(`${repositories.routes.AUTHORS_SEARCH_API().apiUrl}?sort=updated_date&order_by=desc`)
                .reply(200, { data: { ...mockData.authorList } });

            const expectedActions = [actions.AUTHOR_LIST_LOADING, actions.AUTHOR_LIST_LOADED];

            await mockActionsStore.dispatch(loadAuthorList());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on failed to load author list', async () => {
            mockApi
                .onGet(`${repositories.routes.AUTHORS_SEARCH_API().apiUrl}?sort=updated_date&order_by=desc`)
                .reply(500);

            const expectedActions = [actions.AUTHOR_LIST_LOADING, actions.APP_ALERT_SHOW, actions.AUTHOR_LIST_FAILED];

            await expect(mockActionsStore.dispatch(loadAuthorList())).rejects.toEqual({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('updateAuthorListItem action', () => {
        it('should dispatch correct number of actions on author list item successfully updated', async () => {
            mockApi
                .onPut(repositories.routes.AUTHOR_API({ authorId: 1 }).apiUrl)
                .reply(200, { data: { ...mockData.authorListItem } });

            const expectedActions = [actions.AUTHOR_ITEM_UPDATING, actions.AUTHOR_ITEM_UPDATE_SUCCESS];

            await mockActionsStore.dispatch(updateAuthorListItem({ aut_id: 1 }, { aut_id: 1 }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on author list item update failed', async () => {
            mockApi.onPut(repositories.routes.AUTHOR_API({ authorId: 1 }).apiUrl).reply(500);

            const expectedActions = [
                actions.AUTHOR_ITEM_UPDATING,
                actions.APP_ALERT_SHOW,
                actions.AUTHOR_ITEM_UPDATE_FAILED,
            ];

            await expect(mockActionsStore.dispatch(updateAuthorListItem({ aut_id: 1 }, { aut_id: 1 }))).rejects.toEqual(
                {
                    status: 500,
                    message:
                        'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
                },
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct of number of actions for existing alias not found while updating', async () => {
            mockApi
                .onPut(repositories.routes.AUTHOR_API({ authorId: 1 }).apiUrl)
                .reply(200, { data: { ...mockData.authorListItem } });

            const expectedActions = [actions.AUTHOR_ITEM_UPDATING, actions.AUTHOR_ITEM_UPDATE_SUCCESS];

            await mockActionsStore.dispatch(
                updateAuthorListItem(
                    { aut_id: 1, aut_org_username: 'test' },
                    { aut_id: 1, aut_org_username: 'testing' },
                ),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('deleteAuthorListItem action', () => {
        it('should dispatch correct number of actions on author list item successfully deleted', async () => {
            mockApi
                .onDelete(repositories.routes.AUTHOR_API({ authorId: 1 }).apiUrl)
                .reply(200, { data: { ...mockData.authorListItem } });

            const expectedActions = [actions.AUTHOR_ITEM_DELETING, actions.AUTHOR_ITEM_DELETE_SUCCESS];

            await mockActionsStore.dispatch(deleteAuthorListItem({ aut_id: 1 }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on author list item delete failed', async () => {
            mockApi.onDelete(repositories.routes.AUTHOR_API({ authorId: 1 }).apiUrl).reply(500);

            const expectedActions = [
                actions.AUTHOR_ITEM_DELETING,
                actions.APP_ALERT_SHOW,
                actions.AUTHOR_ITEM_DELETE_FAILED,
            ];

            await expect(mockActionsStore.dispatch(deleteAuthorListItem({ aut_id: 1 }))).rejects.toEqual({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('addAuthor action', () => {
        it('should dispatch correct number of actions on author successfully added', async () => {
            mockApi
                .onPost(repositories.routes.AUTHOR_API().apiUrl)
                .reply(200, { data: { ...mockData.authorListItem } });

            const expectedActions = [actions.AUTHOR_ADDING, actions.AUTHOR_ADD_SUCCESS];

            await mockActionsStore.dispatch(
                addAuthor({
                    aut_student_username: 'test',
                    aut_org_staff_id: '1234',
                    aut_org_username: 'test',
                    aut_fname: 'Test',
                }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on author add failed', async () => {
            mockApi.onPost(repositories.routes.AUTHOR_API().apiUrl).reply(500);

            const expectedActions = [actions.AUTHOR_ADDING, actions.APP_ALERT_SHOW, actions.AUTHOR_ADD_FAILED];

            await expect(
                mockActionsStore.dispatch(
                    addAuthor({
                        aut_student_username: 'test',
                        aut_org_staff_id: '1234',
                        aut_org_username: 'test',
                        aut_fname: 'Test',
                    }),
                ),
            ).rejects.toEqual({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });

            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
