import {
    ISSN_SHERPA_LOADING,
    ISSN_SHERPA_LOADED,
    ISSN_SHERPA_LOAD_FAILED,
    ISSN_ULRICHS_LOADING,
    ISSN_ULRICHS_LOADED,
    ISSN_ULRICHS_LOAD_FAILED,
} from 'actions/actionTypes';

import issnLinksReducer from './issnLinks';

const initialState = {
    loadingSherpaFromIssn: false,
    loadingUlrichsFromIssn: false,
    sherpaLoadFromIssnError: false,
    sherpaRomeo: {},
    ulrichs: {},
    ulrichsLoadFromIssnError: false,
};

describe('issnLinksReducer reducer', () => {
    it('sets sherpa loading state', () => {
        const previousState = {
            ...initialState,
            sherpaRomeo: { test1: { srm_issn: 'test1' } },
        };
        const expected = { ...previousState, loadingSherpaFromIssn: true };
        const test = issnLinksReducer(previousState, { type: ISSN_SHERPA_LOADING });
        expect(test).toEqual(expected);
    });

    it('sets sherpa loaded state on first load', () => {
        const previousState = {
            ...initialState,
        };
        const expected = { ...previousState, sherpaRomeo: { test1: { srm_issn: 'test1' } } };
        const test = issnLinksReducer(previousState, {
            type: ISSN_SHERPA_LOADED,
            payload: [{ srm_issn: 'test1' }],
        });
        expect(test).toEqual(expected);
    });

    it('sets sherpa loaded state on subsequent load', () => {
        const previousState = {
            ...initialState,
            sherpaRomeo: { test1: { srm_issn: 'test1' } },
        };
        const expected = {
            ...previousState,
            sherpaRomeo: { test1: { srm_issn: 'test1' }, test2: { srm_issn: 'test2' } },
        };
        const test = issnLinksReducer(previousState, {
            type: ISSN_SHERPA_LOADED,
            payload: [{ srm_issn: 'test2' }],
        });
        expect(test).toEqual(expected);
    });

    it('sets sherpa load failed state', () => {
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

    it('sets ulrichs loading state', () => {
        const previousState = {
            ...initialState,
            ulrichs: { test1: { ulr_issn: 'test1' } },
        };
        const expected = { ...previousState, loadingUlrichsFromIssn: true };
        const test = issnLinksReducer(previousState, { type: ISSN_ULRICHS_LOADING });
        expect(test).toEqual(expected);
    });

    it('sets ulrichs loaded state on first load', () => {
        const previousState = {
            ...initialState,
        };
        const expected = { ...previousState, ulrichs: { test1: { ulr_issn: 'test1' } } };
        const test = issnLinksReducer(previousState, {
            type: ISSN_ULRICHS_LOADED,
            payload: [{ ulr_issn: 'test1' }],
        });
        expect(test).toEqual(expected);
    });

    it('sets ulrichs loaded state on subsequent load', () => {
        const previousState = {
            ...initialState,
            ulrichs: { test1: { ulr_issn: 'test1' } },
        };
        const expected = {
            ...previousState,
            ulrichs: { test1: { ulr_issn: 'test1' }, test2: { ulr_issn: 'test2' } },
        };
        const test = issnLinksReducer(previousState, {
            type: ISSN_ULRICHS_LOADED,
            payload: [{ ulr_issn: 'test2' }],
        });
        expect(test).toEqual(expected);
    });

    it('sets ulrichs load failed state', () => {
        const previousState = {
            ...initialState,
        };
        const expected = { ...previousState, ulrichsLoadFromIssnError: 'error' };
        const test = issnLinksReducer(previousState, {
            type: ISSN_ULRICHS_LOAD_FAILED,
            payload: 'error',
        });
        expect(test).toEqual(expected);
    });
});
