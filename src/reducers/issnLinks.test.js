import { ISSN_SHERPA_LOADING, ISSN_SHERPA_LOADED, ISSN_SHERPA_LOAD_FAILED } from 'actions/actionTypes';

import issnLinksReducer from './issnLinks';

const initialState = {
    loadingSherpaFromIssn: false,
    sherpaLoadFromIssnError: false,
    sherpaRomeo: [],
};

describe('issnLinksReducer reducer', () => {
    it('sets loading state', () => {
        const previousState = {
            ...initialState,
            sherpaRomeo: ['test1'],
        };
        const expected = { ...previousState, loadingSherpaFromIssn: true };
        const test = issnLinksReducer(previousState, { type: ISSN_SHERPA_LOADING });
        expect(test).toEqual(expected);
    });

    it('sets loaded state on first load', () => {
        const previousState = {
            ...initialState,
        };
        const expected = { ...previousState, sherpaRomeo: [{ test: 'test1' }] };
        const test = issnLinksReducer(previousState, {
            type: ISSN_SHERPA_LOADED,
            payload: [{ test: 'test1' }],
        });
        expect(test).toEqual(expected);
    });

    it('sets loaded state on subsequent load', () => {
        const previousState = {
            ...initialState,
            sherpaRomeo: [{ test: 'test1' }],
        };
        const expected = { ...previousState, sherpaRomeo: [{ test: 'test1' }, { test: 'test2' }] };
        const test = issnLinksReducer(previousState, {
            type: ISSN_SHERPA_LOADED,
            payload: [{ test: 'test2' }],
        });
        expect(test).toEqual(expected);
    });

    it('sets load failed state', () => {
        const previousState = {
            ...initialState,
        };
        const expected = { ...previousState, sherpaLoadFromIssnError: 'error' };
        const test = issnLinksReducer(previousState, {
            type: ISSN_SHERPA_LOAD_FAILED,
            payload: 'error',
        });
        expect(test).toEqual(expected);
    });
});
