import {
    addUser,
    bulkDeleteUserListItems,
    checkForExistingUser,
    deleteUserListItem,
    loadUserList,
    updateUserListItem,
} from './manageUsers';
import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as mockData from 'mock/data/testing/usersList';

/*
"usr_id"
"usr_created_date"
"usr_status"
"usr_given_names"
"usr_family_name"
"usr_full_name"
"usr_email"
"usr_preferences"
"usr_sms_email"
"usr_username"
"usr_shib_username"
"usr_administrator"
"usr_ldap_authentication"
"usr_login_count"
"usr_shib_login_count"
"usr_last_login_date"
"usr_external_usr_id"
"usr_super_administrator"
"usr_auth_rule_groups"
"usr_real_last_login_date"
*/

describe('user list actions', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('loadUserList action', () => {
        it('should dispatch correct number of actions on loading user list', async () => {
            mockApi
                .onGet(repositories.routes.MANAGE_USERS_LIST_API({ page: 1, pageSize: 20, query: '' }).apiUrl)
                .reply(200, { data: { ...mockData.userList } });

            const expectedActions = [actions.USER_LIST_LOADING, actions.USER_LIST_LOADED];

            await mockActionsStore.dispatch(loadUserList({ page: 1, pageSize: 20, search: '' }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on failed to load user list', async () => {
            mockApi
                .onGet(`${repositories.routes.MANAGE_USERS_LIST_API({ page: 1, pageSize: 20, query: '' }).apiUrl}`)
                .reply(500);

            const expectedActions = [actions.USER_LIST_LOADING, actions.APP_ALERT_SHOW, actions.USER_LIST_FAILED];

            await expect(
                mockActionsStore.dispatch(loadUserList({ page: 1, pageSize: 20, search: '' })),
            ).rejects.toMatchObject({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('updateUserListItem action', () => {
        it('should dispatch correct number of actions on user list item successfully updated', async () => {
            mockApi
                .onPut(repositories.routes.USER_API({ userId: 1 }).apiUrl)
                .reply(200, { data: { ...mockData.userListItem } });

            const expectedActions = [actions.USER_ITEM_UPDATING, actions.USER_ITEM_UPDATE_SUCCESS];

            await mockActionsStore.dispatch(updateUserListItem({ usr_id: 1 }, { usr_id: 1 }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on user list item update failed', async () => {
            mockApi.onPut(repositories.routes.USER_API({ userId: 1 }).apiUrl).reply(500);

            const expectedActions = [
                actions.USER_ITEM_UPDATING,
                actions.APP_ALERT_SHOW,
                actions.USER_ITEM_UPDATE_FAILED,
            ];

            await expect(
                mockActionsStore.dispatch(updateUserListItem({ usr_id: 1 }, { usr_id: 1 })),
            ).rejects.toMatchObject({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct of number of actions for existing alias not found while updating', async () => {
            mockApi
                .onPut(repositories.routes.USER_API({ userId: 1 }).apiUrl)
                .reply(200, { data: { ...mockData.userListItem } });

            const expectedActions = [actions.USER_ITEM_UPDATING, actions.USER_ITEM_UPDATE_SUCCESS];

            await mockActionsStore.dispatch(
                updateUserListItem({ usr_id: 1, usr_username: 'test' }, { usr_id: 1, usr_username: 'testing' }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('deleteUserListItem action', () => {
        it('should dispatch correct number of actions on user list item successfully deleted', async () => {
            mockApi
                .onDelete(repositories.routes.USER_API({ userId: 1 }).apiUrl)
                .reply(200, { data: { ...mockData.userListItem } });

            const expectedActions = [actions.USER_ITEM_DELETING, actions.USER_ITEM_DELETE_SUCCESS];

            await mockActionsStore.dispatch(deleteUserListItem({ usr_id: 1 }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on user list item delete failed', async () => {
            mockApi.onDelete(repositories.routes.USER_API({ userId: 1 }).apiUrl).reply(500);

            const expectedActions = [
                actions.USER_ITEM_DELETING,
                actions.APP_ALERT_SHOW,
                actions.USER_ITEM_DELETE_FAILED,
            ];

            await expect(mockActionsStore.dispatch(deleteUserListItem({ usr_id: 1 }))).rejects.toMatchObject({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('bulkDeleteUserListItems action', () => {
        it('should dispatch correct number of actions on bulk user list items successfully deleted', async () => {
            mockApi.onPost('fez-users/delete-list').reply(200, { data: { 1: 'User deleted' } });

            const expectedActions = [actions.BULK_USER_ITEMS_DELETING, actions.BULK_USER_ITEMS_DELETE_SUCCESS];

            await mockActionsStore.dispatch(bulkDeleteUserListItems([{ usr_id: 1 }]));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on bulk user list item delete failed', async () => {
            mockApi.onPost('fez-users/delete-list').reply(500);

            const expectedActions = [
                actions.BULK_USER_ITEMS_DELETING,
                actions.APP_ALERT_SHOW,
                actions.BULK_USER_ITEMS_DELETE_FAILED,
            ];

            await expect(mockActionsStore.dispatch(bulkDeleteUserListItems([{ usr_id: 1 }]))).rejects.toMatchObject({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('addUser action', () => {
        it('should dispatch correct number of actions on user successfully added', async () => {
            mockApi.onPost(repositories.routes.USER_API().apiUrl).reply(200, { data: { ...mockData.userListItem } });

            const expectedActions = [actions.USER_ADDING, actions.USER_ADD_SUCCESS];

            await mockActionsStore.dispatch(
                addUser({
                    aut_student_username: 'test',
                    aut_org_staff_id: '1234',
                    usr_username: 'test',
                    aut_fname: 'Test',
                }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on user add failed', async () => {
            mockApi.onPost(repositories.routes.USER_API().apiUrl).reply(500);

            const expectedActions = [actions.USER_ADDING, actions.APP_ALERT_SHOW, actions.USER_ADD_FAILED];

            await expect(
                mockActionsStore.dispatch(
                    addUser({
                        aut_student_username: 'test',
                        aut_org_staff_id: '1234',
                        usr_username: 'test',
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

    describe('checkForExistingUser action', () => {
        it('should dispatch correct number of actions on existing user found', async () => {
            mockApi
                .onGet(repositories.routes.USERS_SEARCH_API().apiUrl)
                .reply(200, { data: [{ usr_id: 2, usr_username: 'test' }], total: 1 });

            const expectedActions = [actions.CHECKING_EXISTING_USER, actions.EXISTING_USER_FOUND];

            await expect(
                mockActionsStore.dispatch(
                    checkForExistingUser('test', 'usr_username', 1, { usr_username: 'Some error' }),
                ),
            ).rejects.toMatchObject({ usr_username: 'Some error' });
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on existing user not found', async () => {
            mockApi.onGet(repositories.routes.USERS_SEARCH_API().apiUrl).reply(200, { data: [], total: 0 });

            const expectedActions = [actions.CHECKING_EXISTING_USER, actions.EXISTING_USER_NOT_FOUND];

            await mockActionsStore.dispatch(
                checkForExistingUser('test', 'usr_username', 1, { usr_username: 'Some error' }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on checking existing user failed', async () => {
            mockApi.onGet(repositories.routes.USERS_SEARCH_API().apiUrl).reply(500);

            const expectedActions = [
                actions.CHECKING_EXISTING_USER,
                actions.APP_ALERT_SHOW,
                actions.CHECKING_EXISTING_USER_FAILED,
            ];

            await expect(
                mockActionsStore.dispatch(
                    checkForExistingUser('test', 'usr_username', 1, { usr_username: 'Some error' }),
                ),
            ).rejects.toMatchObject({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });

            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
