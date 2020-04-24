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
    sherpaLoadFromIssnError: false,
    sherpaRomeo: {},
    ulrichs: {},
    ulrichsLoadFromIssnError: false,
};

describe('issnLinksReducer reducer', () => {
    it('sets sherpa loading state', () => {
        const previousState = {
            ...initialState,
        };
        const expected = {
            ...previousState,
            sherpaRomeo: {
                test1: {},
            },
        };
        const test = issnLinksReducer(previousState, { type: ISSN_SHERPA_LOADING, payload: 'test1' });
        expect(test).toEqual(expected);
    });

    it('sets sherpa loaded state on first load', () => {
        const previousState = {
            ...initialState,
            sherpaRomeo: {
                test1: {},
            },
        };
        const expected = {
            ...previousState,
            sherpaRomeo: { test1: { srm_issn: 'test1', srm_journal_link: 'https://example.com/1' } },
        };
        const test = issnLinksReducer(previousState, {
            type: ISSN_SHERPA_LOADED,
            payload: [{ srm_issn: 'test1', srm_journal_link: 'https://example.com/1' }],
        });
        expect(test).toEqual(expected);
    });

    it('sets sherpa loaded state on subsequent load', () => {
        const previousState = {
            ...initialState,
            sherpaRomeo: {
                test1: { srm_issn: 'test1', srm_journal_link: 'https://example.com/1' },
                test2: {},
            },
        };
        const expected = {
            ...previousState,
            sherpaRomeo: {
                ...previousState.sherpaRomeo,
                test2: { srm_issn: 'test2', srm_journal_link: 'https://example.com/2' },
            },
        };
        const test = issnLinksReducer(previousState, {
            type: ISSN_SHERPA_LOADED,
            payload: [{ srm_issn: 'test2', srm_journal_link: 'https://example.com/2' }],
        });
        expect(test).toEqual(expected);
    });

    it('sets sherpa load failed state', () => {
        const previousState = {
            ...initialState,
        };
        const expected = {
            ...previousState,
            sherpaLoadFromIssnError: {
                test1: 'error',
            },
        };
        const test = issnLinksReducer(previousState, {
            type: ISSN_SHERPA_LOAD_FAILED,
            payload: {
                message: 'error',
                issn: 'test1',
            },
        });
        expect(test).toEqual(expected);
    });

    it('sets ulrichs loading state', () => {
        const previousState = {
            ...initialState,
        };
        const expected = { ...previousState, ulrichs: { test1: {} } };
        const test = issnLinksReducer(previousState, { type: ISSN_ULRICHS_LOADING, payload: 'test1' });
        expect(test).toEqual(expected);
    });

    it('sets ulrichs loaded state on first load', () => {
        const previousState = {
            ...initialState,
            ulrichs: { test1: {} },
        };
        const expected = { ...previousState, ulrichs: { test1: { ulr_issn: 'test1', ulr_title_id: '1' } } };
        const test = issnLinksReducer(previousState, {
            type: ISSN_ULRICHS_LOADED,
            payload: [{ ulr_issn: 'test1', ulr_title_id: '1' }],
        });
        expect(test).toEqual(expected);
    });

    it('sets ulrichs loaded state on subsequent load', () => {
        const previousState = {
            ...initialState,
            ulrichs: { test1: { ulr_issn: 'test1', ulr_title_id: '1' }, test2: {} },
        };
        const expected = {
            ...previousState,
            ulrichs: { ...previousState.ulrichs, test2: { ulr_issn: 'test2', ulr_title_id: '2' } },
        };
        const test = issnLinksReducer(previousState, {
            type: ISSN_ULRICHS_LOADED,
            payload: [{ ulr_issn: 'test2', ulr_title_id: '2' }],
        });
        expect(test).toEqual(expected);
    });

    it('sets ulrichs load failed state', () => {
        const previousState = {
            ...initialState,
            ulrichs: { test1: {} },
        };
        const expected = {
            ...previousState,
            ulrichsLoadFromIssnError: {
                test1: 'error',
            },
        };
        const test = issnLinksReducer(previousState, {
            type: ISSN_ULRICHS_LOAD_FAILED,
            payload: {
                issn: 'test1',
                message: 'error',
            },
        });
        expect(test).toEqual(expected);
    });
});
