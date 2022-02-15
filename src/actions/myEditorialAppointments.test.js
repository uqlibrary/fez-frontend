import {
    addMyEditorialAppointments,
    clearMyEditorialAppointmentsAddStatus,
    deleteMyEditorialAppointmentsListItem,
    loadMyEditorialAppointmentsList,
    updateMyEditorialAppointmentsListItem,
} from './myEditorialAppointments';
import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as mockData from 'mock/data/testing/myEditorialAppointments';

describe('myEditorialAppointments actions', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('loadMyEditorialAppointmentsList action', () => {
        it('should dispatch correct number of actions on loading my editorial appointment list', async () => {
            mockApi
                .onGet(repositories.routes.MY_EDITORIAL_APPOINTMENT_LIST_API().apiUrl)
                .reply(200, { data: { ...mockData.myEditorialAppointmentsList } });

            const expectedActions = [
                actions.MY_EDITORIAL_APPOINTMENT_LIST_LOADING,
                actions.MY_EDITORIAL_APPOINTMENT_LIST_LOADED,
            ];

            await mockActionsStore.dispatch(loadMyEditorialAppointmentsList());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on failed to load my editorial appointment list', async () => {
            mockApi.onGet(repositories.routes.MY_EDITORIAL_APPOINTMENT_LIST_API().apiUrl).reply(500);

            const expectedActions = [
                actions.MY_EDITORIAL_APPOINTMENT_LIST_LOADING,
                actions.APP_ALERT_SHOW,
                actions.MY_EDITORIAL_APPOINTMENT_LIST_FAILED,
            ];

            await expect(mockActionsStore.dispatch(loadMyEditorialAppointmentsList())).rejects.toMatchObject({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('updateMyEditorialAppointmentsListItem action', () => {
        it('should dispatch correct number of actions on my editorial appointment list item successfully updated', async () => {
            mockApi
                .onPut(repositories.routes.MY_EDITORIAL_APPOINTMENT_LIST_API({ id: 1 }).apiUrl)
                .reply(200, { data: { ...mockData.myEditorialAppointmentsListItem } });

            const expectedActions = [
                actions.MY_EDITORIAL_APPOINTMENT_ITEM_UPDATING,
                actions.MY_EDITORIAL_APPOINTMENT_ITEM_UPDATE_SUCCESS,
            ];

            await mockActionsStore.dispatch(updateMyEditorialAppointmentsListItem({ eap_id: 1 }, { eap_id: 1 }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on my editorial appointment list item update failed', async () => {
            mockApi.onPut(repositories.routes.MY_EDITORIAL_APPOINTMENT_LIST_API({ id: 1 }).apiUrl).reply(500);

            const expectedActions = [
                actions.MY_EDITORIAL_APPOINTMENT_ITEM_UPDATING,
                actions.APP_ALERT_SHOW,
                actions.MY_EDITORIAL_APPOINTMENT_ITEM_UPDATE_FAILED,
            ];

            await expect(
                mockActionsStore.dispatch(updateMyEditorialAppointmentsListItem({ eap_id: 1 }, { eap_id: 1 })),
            ).rejects.toMatchObject({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct of number of actions for existing alias not found while updating', async () => {
            mockApi
                .onPut(repositories.routes.MY_EDITORIAL_APPOINTMENT_LIST_API({ id: 1 }).apiUrl)
                .reply(200, { data: { ...mockData.myEditorialAppointmentsListItem } });

            const expectedActions = [
                actions.MY_EDITORIAL_APPOINTMENT_ITEM_UPDATING,
                actions.MY_EDITORIAL_APPOINTMENT_ITEM_UPDATE_SUCCESS,
            ];

            await mockActionsStore.dispatch(
                updateMyEditorialAppointmentsListItem(
                    { eap_id: 1, eap_role_name: 'test' },
                    { eap_id: 1, eap_role_name: 'testing' },
                ),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('deleteMyEditorialAppointmentsListItem action', () => {
        it('should dispatch correct number of actions on my editorial appointment list item successfully deleted', async () => {
            mockApi
                .onDelete(repositories.routes.MY_EDITORIAL_APPOINTMENT_LIST_API({ id: 1 }).apiUrl)
                .reply(200, { data: { ...mockData.myEditorialAppointmentsListItem } });

            const expectedActions = [
                actions.MY_EDITORIAL_APPOINTMENT_ITEM_DELETING,
                actions.MY_EDITORIAL_APPOINTMENT_ITEM_DELETE_SUCCESS,
            ];

            await mockActionsStore.dispatch(deleteMyEditorialAppointmentsListItem({ eap_id: 1 }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on my editorial appointment list item delete failed', async () => {
            mockApi.onDelete(repositories.routes.MY_EDITORIAL_APPOINTMENT_LIST_API({ id: 1 }).apiUrl).reply(500);

            const expectedActions = [
                actions.MY_EDITORIAL_APPOINTMENT_ITEM_DELETING,
                actions.APP_ALERT_SHOW,
                actions.MY_EDITORIAL_APPOINTMENT_ITEM_DELETE_FAILED,
            ];

            await expect(
                mockActionsStore.dispatch(deleteMyEditorialAppointmentsListItem({ eap_id: 1 })),
            ).rejects.toMatchObject({
                status: 500,
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            });
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('addMyEditorialAppointments action', () => {
        it('should dispatch correct number of actions on my editorial appointment successfully added', async () => {
            mockApi
                .onPost(repositories.routes.MY_EDITORIAL_APPOINTMENT_LIST_API().apiUrl)
                .reply(200, { data: { ...mockData.myEditorialAppointmentsListItem } });

            const expectedActions = [
                actions.MY_EDITORIAL_APPOINTMENT_ADDING,
                actions.MY_EDITORIAL_APPOINTMENT_ADD_SUCCESS,
            ];

            await mockActionsStore.dispatch(
                addMyEditorialAppointments({
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_name: 'test',
                    eap_role_cvo_id: '12345',
                }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch correct number of actions on my editorial appointment add failed', async () => {
            mockApi.onPost(repositories.routes.MY_EDITORIAL_APPOINTMENT_LIST_API().apiUrl).reply(500);

            const expectedActions = [
                actions.MY_EDITORIAL_APPOINTMENT_ADDING,
                actions.APP_ALERT_SHOW,
                actions.MY_EDITORIAL_APPOINTMENT_ADD_FAILED,
            ];

            await expect(
                mockActionsStore.dispatch(
                    addMyEditorialAppointments({
                        eap_journal_name: 'test',
                        eap_jnl_id: 1234,
                        eap_role_name: 'test',
                        eap_role_cvo_id: '12345',
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

    describe('clearMyEditorialAppointmentsAddStatus action', () => {
        it('should dispatch expected actions', () => {
            const expectedActions = [actions.MY_EDITORIAL_APPOINTMENT_ADD_CLEAR];
            mockActionsStore.dispatch(clearMyEditorialAppointmentsAddStatus());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
