import {
    APP_ALERT_SHOW,
    RECORD_DOI_UPDATE_REQUESTING,
    RECORD_DOI_UPDATE_SUCCEEDED,
    RECORD_DOI_UPDATE_FAILED,
} from './actionTypes';
import { updateDoi } from 'actions/doi';
import { DOI_API } from 'repositories/routes';

describe('DOI actions', () => {
    const pid = 'UQ:1234567';

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should dispatch actions for successful update', async () => {
        mockApi.onGet(DOI_API({ pid }).apiUrl).reply(200, {});

        const expectedActions = [RECORD_DOI_UPDATE_REQUESTING, RECORD_DOI_UPDATE_SUCCEEDED];

        await mockActionsStore.dispatch(updateDoi(pid));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch actions for failed update', async () => {
        mockApi.onGet(DOI_API({ pid }).apiUrl).reply(500, {});

        const expectedActions = [RECORD_DOI_UPDATE_REQUESTING, APP_ALERT_SHOW, RECORD_DOI_UPDATE_FAILED];

        try {
            await mockActionsStore.dispatch(updateDoi(pid));
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });
});
