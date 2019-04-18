import * as actions from 'actions/actionTypes';
import incompleteRecordReducer from './incompleteRecord';
import {initialState} from './incompleteRecord';

describe('incompleteRecordReducer ', () => {

    it('current lookup loading', () => {
        const state = incompleteRecordReducer(initialState, {type: actions.AUTHOR_INCOMPLETEPUBLICATIONS_LOADING});
        expect(state).toEqual({"loadingIncompleteRecordList": true, "incompleteRecordList": []});
    });

    it('current lookup loaded', () => {
        const oldState = {...initialState, loadingIncompleteRecordList: true};
        const payload = {data: [{rek_pid: 'UQ:1'},{rek_pid: 'UQ:2'}]};
        const state = incompleteRecordReducer(oldState, {type: actions.AUTHOR_INCOMPLETEPUBLICATIONS_LOADED, payload: payload});
        expect(state).toEqual({"loadingIncompleteRecordList": false, "incompleteRecordList": [{rek_pid: 'UQ:1'},{rek_pid: 'UQ:2'}]});
    });

    it('current lookup failed', () => {
        const oldState = {...initialState, loadingIncompleteRecordList: true};
        const state = incompleteRecordReducer(oldState, {type: actions.AUTHOR_INCOMPLETEPUBLICATIONS_FAILED});
        expect(state).toEqual({"loadingIncompleteRecordList": false, "incompleteRecordList": []});
    });
});
