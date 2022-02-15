import {
    addAuthor,
    bulkDeleteAuthorListItems,
    checkForExistingAuthor,
    deleteAuthorListItem,
    ingestFromScopus,
    loadAuthorList,
    updateAuthorListItem,
} from './manageAuthors';
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
                .onGet(repositories.routes.MANAGE_AUTHORS_LIST_API({ page: 1, pageSize: 20, query: '' }).apiUrl)
                .reply(200, { data: { ...mockData.authorList } });

            const expectedActions = [actions.AUTHOR_LIST_LOADING, actions.AUTHOR_LIST_LOADED];

            await mockActionsStore.dispatch(loadAuthorList({ page: 1, pageSize: 20, search: '' }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on failed to load author list', async () => {
            mockApi
                .onGet(`${repositories.routes.MANAGE_AUTHORS_LIST_API({ page: 1, pageSize: 20, query: '' }).apiUrl}`)
                .reply(500);

            const expectedActions = [actions.AUTHOR_LIST_LOADING, actions.APP_ALERT_SHOW, actions.AUTHOR_LIST_FAILED];

            await expect(
                mockActionsStore.dispatch(loadAuthorList({ page: 1, pageSize: 20, search: '' })),
            ).rejects.toMatchObject({
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

            await expect(
                mockActionsStore.dispatch(updateAuthorListItem({ aut_id: 1 }, { aut_id: 1 })),
            ).rejects.toMatchObject({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });
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

            await expect(mockActionsStore.dispatch(deleteAuthorListItem({ aut_id: 1 }))).rejects.toMatchObject({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('bulkDeleteAuthorListItems action', () => {
        it('should dispatch correct number of actions on bulk author list item successfully deleted', async () => {
            mockApi.onPost('fez-authors/delete-list').reply(200, { data: { 1: 'Author deleted' } });

            const expectedActions = [actions.BULK_AUTHOR_ITEMS_DELETING, actions.BULK_AUTHOR_ITEMS_DELETE_SUCCESS];

            await mockActionsStore.dispatch(bulkDeleteAuthorListItems([{ aut_id: 1 }]));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on bulk author list item delete failed', async () => {
            mockApi.onPost('fez-authors/delete-list').reply(500);

            const expectedActions = [
                actions.BULK_AUTHOR_ITEMS_DELETING,
                actions.APP_ALERT_SHOW,
                actions.BULK_AUTHOR_ITEMS_DELETE_FAILED,
            ];

            await expect(mockActionsStore.dispatch(bulkDeleteAuthorListItems([{ aut_id: 1 }]))).rejects.toMatchObject({
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
            ).rejects.toMatchObject({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });

            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('checkForExistingAuthor action', () => {
        it('should dispatch correct number of actions on existing author found', async () => {
            mockApi
                .onGet(repositories.routes.AUTHORS_SEARCH_API().apiUrl)
                .reply(200, { data: [{ aut_id: 2, aut_org_username: 'test' }], total: 1 });

            const expectedActions = [actions.CHECKING_EXISTING_AUTHOR, actions.EXISTING_AUTHOR_FOUND];

            await expect(
                mockActionsStore.dispatch(
                    checkForExistingAuthor('test', 'aut_org_username', 1, { aut_org_username: 'Some error' }),
                ),
            ).rejects.toMatchObject({ aut_org_username: 'Some error' });
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on existing author not found', async () => {
            mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API().apiUrl).reply(200, { data: [], total: 0 });

            const expectedActions = [actions.CHECKING_EXISTING_AUTHOR, actions.EXISTING_AUTHOR_NOT_FOUND];

            await mockActionsStore.dispatch(
                checkForExistingAuthor('test', 'aut_org_username', 1, { aut_org_username: 'Some error' }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on existing author not found keeping previous async errors as it is', async () => {
            mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API().apiUrl).reply(200, { data: [], total: 0 });

            const expectedActions = [actions.CHECKING_EXISTING_AUTHOR, actions.EXISTING_AUTHOR_NOT_FOUND];

            await expect(
                mockActionsStore.dispatch(
                    checkForExistingAuthor(
                        'test',
                        'aut_org_username',
                        1,
                        { aut_org_username: 'Some error' },
                        { aut_org_staff_id: 'Previous error' },
                    ),
                ),
            ).rejects.toMatchObject({ aut_org_staff_id: 'Previous error' });

            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on checking existing author failed', async () => {
            mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API().apiUrl).reply(500);

            const expectedActions = [
                actions.CHECKING_EXISTING_AUTHOR,
                actions.APP_ALERT_SHOW,
                actions.CHECKING_EXISTING_AUTHOR_FAILED,
            ];

            await expect(
                mockActionsStore.dispatch(
                    checkForExistingAuthor('test', 'aut_org_username', 1, { aut_org_username: 'Some error' }),
                ),
            ).rejects.toMatchObject({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });

            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('ingestFromScopus action', () => {
        it('should dispatch correct number of actions on scopus ingest triggered', async () => {
            mockApi.onPost(repositories.routes.INGEST_WORKS_API().apiUrl).reply(200, { data: 'Dispatched import' });

            const expectedActions = [actions.SCOPUS_INGEST_REQUESTING, actions.SCOPUS_INGEST_REQUEST_SUCCESS];

            await mockActionsStore.dispatch(ingestFromScopus(111));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on scopus ingest not triggered', async () => {
            mockApi.onPost(repositories.routes.INGEST_WORKS_API().apiUrl).reply(422);

            const expectedActions = [actions.SCOPUS_INGEST_REQUESTING, actions.SCOPUS_INGEST_REQUEST_FAILED];

            await expect(mockActionsStore.dispatch(ingestFromScopus(111))).rejects.toMatchObject({
                status: 422,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });

            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
