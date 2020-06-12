import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as thirdPartyLookupTool from './thirdPartyLookupTool';

const mockLookupResult = {
    data: [
        {
            IS_INTERNATIONAL_COLLAB: '0',
            ARTICLE_TYPE: 'M',
            JOURNAL_EXPECTED_CITATIONS: '0.053763',
            IMPACT_FACTOR: '4.688',
            JOURNAL_ACT_EXP_CITATIONS: '0.0',
            IS_INDUSTRY_COLLAB: '0',
            AVG_EXPECTED_RATE: '0.168',
            PERCENTILE: '100',
            OA_FLAG: '0',
            IS_INSTITUTION_COLLAB: '1',
            HOT_PAPER: '0',
            NCI: '0',
            ISI_LOC: '000202967300002',
            ESI_MOST_CITED_ARTICLE: '0',
            TOT_CITES: '0',
        },
    ],
};

describe('Lookup action creators', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should dispatch 2 actions on successful fetch of lookup data', async () => {
        mockApi.onAny().reply(200, mockLookupResult);

        const expectedActions = [actions.THIRD_PARTY_LOOKUP_TOOL_LOADING, actions.THIRD_PARTY_LOOKUP_TOOL_SUCCESS];

        await mockActionsStore.dispatch(thirdPartyLookupTool.loadThirdPartyResults('incites', 'dummyUT'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch 2 actions on receiving an empty result', async () => {
        mockApi.onAny().reply(200, { data: [] });

        const expectedActions = [actions.THIRD_PARTY_LOOKUP_TOOL_LOADING, actions.THIRD_PARTY_LOOKUP_TOOL_LOAD_FAILED];

        await mockActionsStore.dispatch(thirdPartyLookupTool.loadThirdPartyResults('incites', 'missing UTs'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch 2 actions on error 403 while fetching a lookup', async () => {
        mockApi
            .onGet(repositories.routes.THIRD_PARTY_LOOKUP_API_1FIELD({ type: 'incites', field1: 'dummyUT' }).apiUrl)
            .reply(403, { data: '[I006] The API Key was invalid. Please use a different key.' });

        const expectedActions = [actions.THIRD_PARTY_LOOKUP_TOOL_LOADING, actions.THIRD_PARTY_LOOKUP_TOOL_LOAD_FAILED];

        await mockActionsStore.dispatch(thirdPartyLookupTool.loadThirdPartyResults('incites', 'dummyUT'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch 2 actions on non-403 error', async () => {
        mockApi
            .onGet(repositories.routes.THIRD_PARTY_LOOKUP_API_1FIELD({ type: 'incites', field1: 'dummyUT' }).apiUrl)
            .reply(500, { data: '[I008] Incites is not currently available. Support have been advised.' });

        const expectedActions = [actions.THIRD_PARTY_LOOKUP_TOOL_LOADING, actions.THIRD_PARTY_LOOKUP_TOOL_LOAD_FAILED];

        await mockActionsStore.dispatch(thirdPartyLookupTool.loadThirdPartyResults('incites', 'dummyUT'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch 2 actions on unexpected error', async () => {
        mockApi
            .onGet(repositories.routes.THIRD_PARTY_LOOKUP_API_1FIELD({ type: 'incites', field1: 'dummyUT' }).apiUrl)
            .reply(500, 'unformatted response was received from Incites');

        const expectedActions = [actions.THIRD_PARTY_LOOKUP_TOOL_LOADING, actions.THIRD_PARTY_LOOKUP_TOOL_LOAD_FAILED];

        await mockActionsStore.dispatch(thirdPartyLookupTool.loadThirdPartyResults('incites', 'dummyUT'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch 2 actions on missing error message', async () => {
        mockApi
            .onGet(repositories.routes.THIRD_PARTY_LOOKUP_API_1FIELD({ type: 'incites', field1: 'dummuUT' }).apiUrl)
            .reply(500);

        const expectedActions = [actions.THIRD_PARTY_LOOKUP_TOOL_LOADING, actions.THIRD_PARTY_LOOKUP_TOOL_LOAD_FAILED];

        await mockActionsStore.dispatch(thirdPartyLookupTool.loadThirdPartyResults('incites', 'dummyUT'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch 2 actions on successful fetch of lookup data for a 2-field call', async () => {
        mockApi.onAny().reply(200, mockLookupResult);

        const expectedActions = [actions.THIRD_PARTY_LOOKUP_TOOL_LOADING, actions.THIRD_PARTY_LOOKUP_TOOL_SUCCESS];

        await mockActionsStore.dispatch(
            thirdPartyLookupTool.loadThirdPartyResults('incites', 'dummyUT', 'key123456789'),
        );
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch clear action on clear', async () => {
        mockApi.onAny().reply(200, {}, {});

        const expectedActions = [actions.THIRD_PARTY_LOOKUP_TOOL_CLEAR];

        await mockActionsStore.dispatch(thirdPartyLookupTool.clearThirdPartyLookup());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
