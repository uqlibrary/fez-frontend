import {
    APP_ALERT_SHOW,
    RECORD_DOI_UPDATE_REQUESTING,
    RECORD_DOI_UPDATE_SUCCEEDED,
    RECORD_DOI_UPDATE_FAILED,
} from './actionTypes';
import { updateDoi } from 'actions/doi';
import { EXISTING_RECORD_API } from 'repositories/routes';

describe('DOI actions', () => {
    const record = {
        rek_pid: 'UQ:1234567',
    };
    const escapeRegExp = input => input.replace('.\\*', '.*').replace(/[\-\[\]\{\}\(\)\+\?\\\^\$\|]/g, '\\$&');

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should dispatch actions for successful update', async () => {
        mockApi.onPut(new RegExp(escapeRegExp(EXISTING_RECORD_API({ pid: '.*' }).apiUrl))).reply(200, { data: record });

        const expectedActions = [RECORD_DOI_UPDATE_REQUESTING, RECORD_DOI_UPDATE_SUCCEEDED];

        await mockActionsStore.dispatch(updateDoi(record));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch actions for failed update', async () => {
        mockApi.onPut(new RegExp(escapeRegExp(EXISTING_RECORD_API({ pid: '.*' }).apiUrl))).reply(500, {});

        const expectedActions = [RECORD_DOI_UPDATE_REQUESTING, APP_ALERT_SHOW, RECORD_DOI_UPDATE_FAILED];

        try {
            await mockActionsStore.dispatch(updateDoi(record));
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });
});
