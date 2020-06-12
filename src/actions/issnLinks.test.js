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

    it('should call sherpa loading/loaded actions on successful load when issn findable in db cache', async () => {
        const issn = '1535-4970';
        mockApi
            .onGet(ISSN_LINKS_API({ type: 'sherpa-romeo', issn: issn }).apiUrl)
            .reply(200, { data: [sherpaRomeo[0]] });

        const expectedActions = [ISSN_SHERPA_LOADING, ISSN_SHERPA_LOADED];

        await mockActionsStore.dispatch(getSherpaFromIssn(issn));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call sherpa loading/loaded actions on successful load when issn not in db cache', async () => {
        const unknownIssn = '9999-9988';
        mockApi.onGet(ISSN_LINKS_API({ type: 'sherpa-romeo', issn: unknownIssn }).apiUrl).reply(200, { data: [] });

        const expectedActions = [ISSN_SHERPA_LOADING, ISSN_SHERPA_LOADED];

        await mockActionsStore.dispatch(getSherpaFromIssn(unknownIssn));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call sherpa loading/load failed actions on failed load', async () => {
        mockApi.onGet(ISSN_LINKS_API({ type: 'sherpa-romeo', issn: '9999-9988' }).apiUrl).reply(500);

        const expectedActions = [ISSN_SHERPA_LOADING, ISSN_SHERPA_LOAD_FAILED];

        await mockActionsStore.dispatch(getSherpaFromIssn());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call ulrichs loading/loaded actions on successful load when issn findable in db cache', async () => {
        const issn = '1611-3349';
        mockApi.onGet(ISSN_LINKS_API({ type: 'ulrichs', issn: issn }).apiUrl).reply(200, { data: [ulrichs[0]] });

        const expectedActions = [ISSN_ULRICHS_LOADING, ISSN_ULRICHS_LOADED];

        await mockActionsStore.dispatch(getUlrichsFromIssn(issn));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call ulrichs loading/loaded actions on successful load when issn not in db cache', async () => {
        const unknownIssn = '9999-9988';
        mockApi.onGet(ISSN_LINKS_API({ type: 'ulrichs', issn: unknownIssn }).apiUrl).reply(200, { data: [] });

        const expectedActions = [ISSN_ULRICHS_LOADING, ISSN_ULRICHS_LOADED];

        await mockActionsStore.dispatch(getUlrichsFromIssn(unknownIssn));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call ulrichs loading/load failed actions on failed load', async () => {
        mockApi.onGet(ISSN_LINKS_API({ type: 'ulrichs', issn: '1611-3349' }).apiUrl).reply(500);

        const expectedActions = [ISSN_ULRICHS_LOADING, ISSN_ULRICHS_LOAD_FAILED];

        await mockActionsStore.dispatch(getUlrichsFromIssn());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
