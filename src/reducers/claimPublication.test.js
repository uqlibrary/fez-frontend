import * as actions from 'actions/actionTypes';
import claimPublicationReducer from './claimPublication';

describe('claimPublication reducer', () => {
    const initialState = {
        publicationToClaim: null,
        publicationToClaimFileUploadingError: false,
        possibleCounts: 0,
        possiblePublicationsPagingData: {},
        possiblePublicationsList: [],
        possiblePublicationsFacets: {},
        loadingPossiblePublicationsList: true,
        loadingPossibleCounts: true,
        publicationsClaimedInProgress: [],
        hidePublicationLoading: true,
        hidePublicationFailed: false,
        hidePublicationFailedErrorMessage: null,
    };

    const publicationData = {
        rek_pid: 'UQ:12345',
        rek_title: 'This is a title',
        rek_description: 'This is a description.',
    };

    const mockRecord = {
        pid: 'UQ:12345',
        data: publicationData,
        total: 3,
        current_page: 1,
        from: 1,
        to: 3,
        per_page: 20,
    };

    it('returns that we are loading the data', () => {
        const test = claimPublicationReducer(initialState, { type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING });
        expect(test).toEqual({
            ...initialState,
            loadingPossiblePublicationsList: true,
            possiblePublicationsList: [],
            possiblePublicationsFacets: {},
            possiblePublicationsPagingData: {},
        });
    });

    it('returns the record we are setting to claim', () => {
        const test = claimPublicationReducer(initialState, {
            type: actions.PUBLICATION_TO_CLAIM_SET,
            payload: { rek_pid: publicationData.rek_pid },
        });
        expect(test).toEqual({
            ...initialState,
            publicationToClaimFileUploadingError: false,
            publicationToClaim: { rek_pid: publicationData.rek_pid },
            fullPublicationToClaim: null,
        });
    });

    it('clears the record we set to claim', () => {
        const test = claimPublicationReducer(initialState, { type: actions.PUBLICATION_TO_CLAIM_CLEAR });
        expect(test).toEqual({
            ...initialState,
            publicationToClaimFileUploadingError: false,
            publicationToClaim: null,
            fullPublicationToClaim: null,
        });
    });

    it('returns the records which are possibly yours', () => {
        const test = claimPublicationReducer(initialState, {
            type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADED,
            payload: mockRecord,
        });
        expect(test).toEqual({
            ...initialState,
            loadingPossiblePublicationsList: false,
            loadingPossibleCounts: false,
            possiblePublicationsList: mockRecord.data,
            possibleCounts: 3,
            possiblePublicationsPagingData: {
                total: mockRecord.total,
                current_page: mockRecord.current_page,
                from: mockRecord.from,
                to: mockRecord.to,
                per_page: mockRecord.per_page,
            },
        });
    });

    it('returns the facets for the possible records', () => {
        const facetData = {
            'Scopus document type': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [] },
            'Display type': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 0,
                buckets: [{ key: 130, doc_count: 10 }],
            },
            Keywords: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 8,
                buckets: [
                    { key: 'CARDIAC & CARDIOVASCULAR SYSTEMS', doc_count: 2 },
                    { key: 'Cardiac & Cardiovascular Systems', doc_count: 2 },
                    { key: 'Cardiovascular System & Cardiology', doc_count: 2 },
                    { key: 'Respiratory System', doc_count: 2 },
                    { key: 'ENDOCRINOLOGY & METABOLISM', doc_count: 1 },
                ],
            },
        };
        const test = claimPublicationReducer(initialState, {
            type: actions.POSSIBLY_YOUR_PUBLICATIONS_FACETS_LOADED,
            payload: facetData,
        });
        expect(test).toEqual({
            ...initialState,
            possiblePublicationsFacets: facetData,
        });
    });

    it('returns that the possibly publications load failed', () => {
        const test = claimPublicationReducer(initialState, { type: actions.POSSIBLY_YOUR_PUBLICATIONS_FAILED });
        expect(test).toEqual({
            ...initialState,
            loadingPossiblePublicationsList: false,
            possiblePublicationsList: [],
            loadingPossibleCounts: false,
            possibleCounts: 0,
            possiblePublicationsPagingData: {},
        });
    });

    it('returns that the record count is loading', () => {
        const test = claimPublicationReducer(initialState, { type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING });
        expect(test).toEqual({
            ...initialState,
            loadingPossibleCounts: true,
            possibleCounts: 0,
        });
    });

    it('returns that the record count failed to load', () => {
        const test = claimPublicationReducer(initialState, { type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED });
        expect(test).toEqual({
            ...initialState,
            loadingPossibleCounts: false,
            possibleCounts: 0,
        });
    });

    it('returns that the record count has loaded with the data', () => {
        const test = claimPublicationReducer(initialState, {
            type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADED,
            payload: mockRecord,
        });
        expect(test).toEqual({
            ...initialState,
            loadingPossibleCounts: false,
            possibleCounts: mockRecord.total,
        });
    });

    it('returns list of publications hidden/unclaimed', () => {
        const test = claimPublicationReducer(initialState, {
            type: actions.HIDE_PUBLICATIONS_LOADED,
            payload: mockRecord,
        });
        expect(test).toEqual({
            ...initialState,
            publicationsClaimedInProgress: [...initialState.publicationsClaimedInProgress, mockRecord.pid],
        });
    });

    it('returns list of publications currently in claiming progress and if there was an error uploading files', () => {
        const test = claimPublicationReducer(initialState, {
            type: actions.CLAIM_PUBLICATION_CREATE_COMPLETED,
            payload: mockRecord,
        });
        expect(test).toEqual({
            ...initialState,
            publicationToClaimFileUploadingError: !!mockRecord.fileUploadFailed,
            publicationsClaimedInProgress: [...initialState.publicationsClaimedInProgress, mockRecord.pid],
        });
    });

    it('sets error message if hiding of publications has failed', () => {
        const testMessage = 'Test message';
        const test = claimPublicationReducer(initialState, {
            type: 'HIDE_PUBLICATIONS_FAILED',
            payload: testMessage,
        });
        expect(test.hidePublicationLoading).toBe(false);
        expect(test.hidePublicationFailed).toBe(true);
        expect(test.hidePublicationFailedErrorMessage).toEqual(testMessage);
        expect(test).toEqual({
            ...initialState,
            hidePublicationLoading: false,
            hidePublicationFailed: true,
            hidePublicationFailedErrorMessage: testMessage,
        });
    });

    it('resets the error about failing to hide publications', () => {
        const erroredState = {
            ...initialState,
            hidePublicationFailed: true,
            hidePublicationFailedErrorMessage: 'Example message',
        };
        const test = claimPublicationReducer(erroredState, {
            type: actions.HIDE_PUBLICATIONS_FAILED_RESET,
        });
        expect(test.hidePublicationFailed).toBe(false);
        expect(test.hidePublicationFailedErrorMessage).toBeNull;
        expect(test).toEqual(initialState);
    });

    it('returns the initialState if an invalid action type is supplied', () => {
        const test = claimPublicationReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });

    it('returns the that the publication is loading', () => {
        const test = claimPublicationReducer(initialState, { type: 'PUBLICATION_TO_CLAIM_LOADING' });
        expect(test).toEqual({
            fullPublicationToClaim: null,
            fullPublicationToClaimLoading: true,
            fullPublicationToClaimLoadingFailed: false,
            hidePublicationFailed: false,
            hidePublicationFailedErrorMessage: null,
            hidePublicationLoading: true,
            loadingPossibleCounts: true,
            loadingPossiblePublicationsList: true,
            possibleCounts: 0,
            possiblePublicationsFacets: {},
            possiblePublicationsList: [],
            possiblePublicationsPagingData: {},
            publicationToClaim: null,
            publicationToClaimFileUploadingError: false,
            publicationsClaimedInProgress: [],
        });
    });

    it('returns the full publication when loaded', () => {
        const test = claimPublicationReducer(initialState, {
            type: 'PUBLICATION_TO_CLAIM_LOADED',
            payload: publicationData,
        });
        expect(test).toEqual({
            fullPublicationToClaim: publicationData,
            fullPublicationToClaimLoading: false,
            fullPublicationToClaimLoadingFailed: false,
            hidePublicationFailed: false,
            hidePublicationFailedErrorMessage: null,
            hidePublicationLoading: true,
            loadingPossibleCounts: true,
            loadingPossiblePublicationsList: true,
            possibleCounts: 0,
            possiblePublicationsFacets: {},
            possiblePublicationsList: [],
            possiblePublicationsPagingData: {},
            publicationToClaim: null,
            publicationToClaimFileUploadingError: false,
            publicationsClaimedInProgress: [],
        });
    });

    it('returns the expected values when fails', () => {
        const test = claimPublicationReducer(initialState, {
            type: 'PUBLICATION_TO_CLAIM_FAILED',
            payload: 'There was an error',
        });
        expect(test).toEqual({
            fullPublicationToClaim: null,
            fullPublicationToClaimLoading: false,
            fullPublicationToClaimLoadingFailed: 'There was an error',
            hidePublicationFailed: false,
            hidePublicationFailedErrorMessage: null,
            hidePublicationLoading: true,
            loadingPossibleCounts: true,
            loadingPossiblePublicationsList: true,
            possibleCounts: 0,
            possiblePublicationsFacets: {},
            possiblePublicationsList: [],
            possiblePublicationsPagingData: {},
            publicationToClaim: null,
            publicationToClaimFileUploadingError: false,
            publicationsClaimedInProgress: [],
        });
    });
});
