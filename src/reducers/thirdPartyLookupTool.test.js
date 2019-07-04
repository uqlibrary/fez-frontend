import * as actions from 'actions/actionTypes';
import thirdPartyLookupToolReducer from './thirdPartyLookupTool';
import { initialState } from './thirdPartyLookupTool';

describe('thirdPartyLookupTool ', () => {
    it('current lookup loading', () => {
        const state = thirdPartyLookupToolReducer(initialState, { type: actions.THIRD_PARTY_LOOKUP_TOOL_LOADING });
        expect(state).toEqual({ loadingResults: true, lookupResults: [] });
    });

    it('current lookup loaded', () => {
        const oldState = { ...initialState, loadingResults: true };
        const payload = [{ IS_INTERNATIONAL_COLLAB: '0' }, { IS_INTERNATIONAL_COLLAB: 'B' }];
        const state = thirdPartyLookupToolReducer(oldState, {
            type: actions.THIRD_PARTY_LOOKUP_TOOL_SUCCESS,
            payload: payload,
        });
        expect(state.loadingResults).toBeFalsy();
        expect(state.lookupResults.length).toBe(2);
        expect(state).toEqual(expect.objectContaining({ lookupResults: payload }));
    });

    it('current lookup failed', () => {
        const oldState = { ...initialState, loadingResults: true };
        const state = thirdPartyLookupToolReducer(oldState, { type: actions.THIRD_PARTY_LOOKUP_TOOL_LOAD_FAILED });
        expect(state.loadingResults).toBeFalsy();
        expect(state.lookupResults).toBeFalsy();
    });

    it('returns just the initialState after clearing the record', () => {
        const test = thirdPartyLookupToolReducer(initialState, { type: actions.THIRD_PARTY_LOOKUP_TOOL_CLEAR });
        expect(test).toEqual(initialState);
    });
});
