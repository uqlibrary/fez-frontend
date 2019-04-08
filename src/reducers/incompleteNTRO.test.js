import * as actions from 'actions/actionTypes';
import incompleteNTROReducer from './incompleteNTRO';
import {initialState} from './incompleteNTRO';

describe('incompleteNTROReducer ', () => {

    it('current lookup loading', () => {
        const state = incompleteNTROReducer(initialState, {type: actions.INCOMPLETE_NTRO_LOADING});
        expect(state).toEqual({"loadingIncompleteNTROList": true, "incompleteNTROList": []});
    });

    it('current lookup loaded', () => {
        const oldState = {...initialState, loadingIncompleteNTROList: true};
        const payload = {data: [{rek_pid: 'UQ:1'},{rek_pid: 'UQ:2'}]};
        const state = incompleteNTROReducer(oldState, {type: actions.INCOMPLETE_NTRO_LOADED, payload: payload});
        expect(state).toEqual({"loadingIncompleteNTROList": false, "incompleteNTROList": [{rek_pid: 'UQ:1'},{rek_pid: 'UQ:2'}]});
    });

    it('current lookup failed', () => {
        const oldState = {...initialState, loadingIncompleteNTROList: true};
        const state = incompleteNTROReducer(oldState, {type: actions.INCOMPLETE_NTRO_FAILED});
        expect(state).toEqual({"loadingIncompleteNTROList": false, "incompleteNTROList": []});
    });
});
