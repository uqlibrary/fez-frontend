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
        };
        const expected = {
            ...previousState,
            loadingSherpaFromIssn: true,
            sherpaRomeo: {},
        };
        const test = issnLinksReducer(previousState, { type: ISSN_SHERPA_LOADING, payload: 'test1' });
        expect(test).toEqual(expected);
    });

    it('sets sherpa loaded state on first load', () => {
        const previousState = {
            ...initialState,
            loadingSherpaFromIssn: true,
            sherpaRomeo: {},
        };
        const expected = {
            ...previousState,
            loadingSherpaFromIssn: false,
            sherpaRomeo: { test1: { srm_issn: 'test1', srm_journal_link: 'https://example.com/1' } },
        };
        const test = issnLinksReducer(previousState, {
            type: ISSN_SHERPA_LOADED,
            payload: { test1: { srm_issn: 'test1', srm_journal_link: 'https://example.com/1' } },
        });
        expect(test).toEqual(expected);
    });

    it('sets sherpa loaded state on subsequent load', () => {
        const previousState = {
            ...initialState,
            loadingSherpaFromIssn: true,
            sherpaRomeo: {
                test1: { srm_issn: 'test1', srm_journal_link: 'https://example.com/1' },
            },
        };
        const expected = {
            ...previousState,
            loadingSherpaFromIssn: false,
            sherpaRomeo: {
                ...previousState.sherpaRomeo,
                test2: { srm_issn: 'test2', srm_journal_link: 'https://example.com/2' },
            },
        };
        const test = issnLinksReducer(previousState, {
            type: ISSN_SHERPA_LOADED,
            payload: { test2: { srm_issn: 'test2', srm_journal_link: 'https://example.com/2' } },
        });
        expect(test).toEqual(expected);
    });

    it('sets sherpa load failed state', () => {
        const previousState = {
            loadingSherpaFromIssn: true,
            ...initialState,
        };
        const expected = {
            ...previousState,
            loadingSherpaFromIssn: false,
            sherpaLoadFromIssnError: {
                test1: 'error',
            },
        };
        const test = issnLinksReducer(previousState, {
            type: ISSN_SHERPA_LOAD_FAILED,
            payload: {
                test1: 'error',
            },
        });
        expect(test).toEqual(expected);
    });

    it('sets ulrichs loading state', () => {
        const previousState = {
            ...initialState,
        };
        const expected = { ...previousState, loadingUlrichsFromIssn: true, ulrichs: {} };
        const test = issnLinksReducer(previousState, { type: ISSN_ULRICHS_LOADING, payload: 'test1' });
        expect(test).toEqual(expected);
    });

    it('sets ulrichs loaded state on first load', () => {
        const previousState = {
            ...initialState,
            loadingUlrichsFromIssn: true,
            ulrichs: {},
        };
        const expected = {
            ...previousState,
            loadingUlrichsFromIssn: false,
            ulrichs: { test1: { ulr_issn: 'test1', ulr_title_id: '1' } },
        };
        const test = issnLinksReducer(previousState, {
            type: ISSN_ULRICHS_LOADED,
            payload: { test1: { ulr_issn: 'test1', ulr_title_id: '1' } },
        });
        expect(test).toEqual(expected);
    });

    it('sets ulrichs loaded state on subsequent load', () => {
        const previousState = {
            ...initialState,
            loadingUlrichsFromIssn: true,
            ulrichs: { test1: { ulr_issn: 'test1', ulr_title_id: '1' } },
        };
        const expected = {
            ...previousState,
            loadingUlrichsFromIssn: false,
            ulrichs: { ...previousState.ulrichs, test2: { ulr_issn: 'test2', ulr_title_id: '2' } },
        };
        const test = issnLinksReducer(previousState, {
            type: ISSN_ULRICHS_LOADED,
            payload: { test2: { ulr_issn: 'test2', ulr_title_id: '2' } },
        });
        expect(test).toEqual(expected);
    });

    it('sets ulrichs load failed state', () => {
        const previousState = {
            ...initialState,
            loadingUlrichsFromIssn: true,

            ulrichs: {},
        };
        const expected = {
            ...previousState,
            loadingUlrichsFromIssn: false,
            ulrichsLoadFromIssnError: {
                test1: 'error',
            },
        };
        const test = issnLinksReducer(previousState, {
            type: ISSN_ULRICHS_LOAD_FAILED,
            payload: {
                test1: 'error',
            },
        });
        expect(test).toEqual(expected);
    });
});
