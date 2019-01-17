import * as actions from 'actions/actionTypes';
import adminLookupToolReducer from './adminLookupTool';
import {initialState} from './adminLookupTool';
import academicStatsReducer from "./academic";
import fixRecordReducer from "./fixRecord";

describe('adminLookupTool ', () => {

    it('current lookup loading', () => {
        const state = adminLookupToolReducer(initialState, {type: actions.ADMIN_LOOKUP_TOOL_LOADING});
        expect(state).toEqual({"loadingResults": true, "lookupResults": []});
    });

    it('current lookup loaded', () => {
        const oldState = {...initialState, loadingResults: true};
        const payload = [{"IS_INTERNATIONAL_COLLAB":"0"},{"IS_INTERNATIONAL_COLLAB":"B"}];
        const state = adminLookupToolReducer(oldState, {type: actions.ADMIN_LOOKUP_TOOL_SUCCESS, payload: payload});
        expect(state.loadingResults).toBeFalsy();
        expect(state.lookupResults.length).toBe(2);
        expect(state).toEqual(expect.objectContaining({lookupResults: payload}));
    });

    it('current lookup failed', () => {
        const oldState = {...initialState, loadingResults: true};
        const state = adminLookupToolReducer(oldState, {type: actions.ADMIN_LOOKUP_TOOL_LOAD_FAILED});
        expect(state.loadingResults).toBeFalsy();
        expect(state.lookupResults).toBeFalsy();
    });

    it('returns just the initialState after clearing the record', () => {
        const test = adminLookupToolReducer(initialState, {type: actions.ADMIN_LOOKUP_TOOL_CLEAR});
        expect(test).toEqual(initialState);
    });
});
