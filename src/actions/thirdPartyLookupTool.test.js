import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as thirdPartyLookupTool from './thirdPartyLookupTool';

const mockLookupResult = {
    "data": [{
        "IS_INTERNATIONAL_COLLAB": "0",
        "ARTICLE_TYPE": "M",
        "JOURNAL_EXPECTED_CITATIONS": "0.053763",
        "IMPACT_FACTOR": "4.688",
        "JOURNAL_ACT_EXP_CITATIONS": "0.0",
        "IS_INDUSTRY_COLLAB": "0",
        "AVG_EXPECTED_RATE": "0.168",
        "PERCENTILE": "100",
        "OA_FLAG": "0",
        "IS_INSTITUTION_COLLAB": "1",
        "HOT_PAPER": "0",
        "NCI": "0",
        "ISI_LOC": "000202967300002",
        "ESI_MOST_CITED_ARTICLE": "0",
        "TOT_CITES": "0"
    }]
};

describe('Lookup action creators', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should dispatch 2 actions on successful fetch of lookup data', async () => {
        mockApi
            .onAny()
            .reply(200, mockLookupResult);

        const expectedActions = [
            actions.THIRD_PARTY_LOOKUP_TOOL_LOADING,
            actions.THIRD_PARTY_LOOKUP_TOOL_SUCCESS
        ];

        await mockActionsStore.dispatch(thirdPartyLookupTool.loadThirdPartyLookup('incites', 'dummyUT'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch 2 actions on receiving an empty result', async () => {
        mockApi
            .onAny()
            .reply(200, {"data": [{}]});

        const expectedActions = [
            actions.THIRD_PARTY_LOOKUP_TOOL_LOADING,
            actions.THIRD_PARTY_LOOKUP_TOOL_SUCCESS
        ];

        await mockActionsStore.dispatch(thirdPartyLookupTool.loadThirdPartyLookup('incites', 'missing UTs'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch 2 actions on error 403 while fetching a lookup', async () => {
        mockApi
            .onAny()
            .reply(403, {});

        const expectedActions = [
            actions.THIRD_PARTY_LOOKUP_TOOL_LOADING,
            actions.THIRD_PARTY_LOOKUP_TOOL_LOAD_FAILED
        ];

        await mockActionsStore.dispatch(thirdPartyLookupTool.loadThirdPartyLookup('incites', 'dummyUT'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch 2 actions on non-403 error', async () => {
        mockApi
            .onAny()
            .reply(500, {});

        const expectedActions = [
            actions.THIRD_PARTY_LOOKUP_TOOL_LOADING,
            actions.THIRD_PARTY_LOOKUP_TOOL_LOAD_FAILED
        ];

        await mockActionsStore.dispatch(thirdPartyLookupTool.loadThirdPartyLookup('incites', 'dummyUT'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
