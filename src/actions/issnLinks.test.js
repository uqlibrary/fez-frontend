import {
    ISSN_SHERPA_LOADING,
    ISSN_SHERPA_LOADED,
    ISSN_SHERPA_LOAD_FAILED,
    ISSN_ULRICHS_LOADING,
    ISSN_ULRICHS_LOADED,
    ISSN_ULRICHS_LOAD_FAILED,
} from './actionTypes';
import { ISSN_LINKS_API } from 'repositories/routes';
import { sherpaRomeo } from 'mock/data/sherpaRomeo';
import { ulrichs } from 'mock/data/ulrichs';
import { getSherpaFromIssn, getUlrichsFromIssn } from 'actions/issnLinks';

describe('ISSN Lookup actions', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should call sherpa loading/loaded actions on successful load', async() => {
        mockApi.onPost(ISSN_LINKS_API({ type: 'sherpa' }).apiUrl).reply(200, sherpaRomeo);

        const expectedActions = [ISSN_SHERPA_LOADING, ISSN_SHERPA_LOADED];

        await mockActionsStore.dispatch(getSherpaFromIssn());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call sherpa loading/load failed actions on failed load', async() => {
        mockApi.onPost(ISSN_LINKS_API({ type: 'sherpa' }).apiUrl).reply(500);

        const expectedActions = [ISSN_SHERPA_LOADING, ISSN_SHERPA_LOAD_FAILED];

        await mockActionsStore.dispatch(getSherpaFromIssn());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call ulrichs loading/loaded actions on successful load', async() => {
        mockApi.onPost(ISSN_LINKS_API({ type: 'ulrichs' }).apiUrl).reply(200, ulrichs);

        const expectedActions = [ISSN_ULRICHS_LOADING, ISSN_ULRICHS_LOADED];

        await mockActionsStore.dispatch(getUlrichsFromIssn());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call ulrichs loading/load failed actions on failed load', async() => {
        mockApi.onPost(ISSN_LINKS_API({ type: 'ulrichs' }).apiUrl).reply(500);

        const expectedActions = [ISSN_ULRICHS_LOADING, ISSN_ULRICHS_LOAD_FAILED];

        await mockActionsStore.dispatch(getUlrichsFromIssn());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
