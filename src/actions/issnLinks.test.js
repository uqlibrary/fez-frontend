import { ISSN_SHERPA_LOADING, ISSN_SHERPA_LOADED, ISSN_SHERPA_LOAD_FAILED } from './actionTypes';
import { ISSN_LINKS_API } from 'repositories/routes';
import { sherpaRomeo } from 'mock/data/sherpaRomeo';
import { getSherpaFromIssn } from 'actions/issnLinks';

describe('NewsFeed actions', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should call loading/loaded actions on successful load', async() => {
        mockApi.onPost(ISSN_LINKS_API({ type: 'sherpa' }).apiUrl).reply(200, sherpaRomeo);

        const expectedActions = [ISSN_SHERPA_LOADING, ISSN_SHERPA_LOADED];

        await mockActionsStore.dispatch(getSherpaFromIssn());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call loading/load failed actions on failed load', async() => {
        mockApi.onPost(ISSN_LINKS_API({ type: 'sherpa' }).apiUrl).reply(500);

        const expectedActions = [ISSN_SHERPA_LOADING, ISSN_SHERPA_LOAD_FAILED];

        await mockActionsStore.dispatch(getSherpaFromIssn());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
