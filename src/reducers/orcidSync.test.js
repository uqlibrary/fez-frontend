import * as actions from 'actions/actionTypes';
import orcidSyncReducer, { initialState } from './orcidSync';
import * as orcidData from 'mock/data/orcid';

describe('OrcidSync status check reducers', () => {
    it('should return loading state', () => {
        const previousState = {
            test: 'test1',
        };
        const expectedState = {
            test: 'test1',
            ...initialState,
            loadingOrcidSyncStatus: true,
        };

        const actualState = orcidSyncReducer(previousState, { type: actions.ORCID_SYNC_STATUS_LOADING });
        expect(actualState).toEqual(expectedState);
    });

    it('should return loaded state', () => {
        const previousState = {
            ...initialState,
        };
        const expectedState = {
            ...initialState,
            orcidSyncStatus: orcidData.orcidSyncStatus.data,
            loadingOrcidSyncStatus: false,
        };

        const actualState = orcidSyncReducer(previousState, {
            type: actions.ORCID_SYNC_STATUS_LOADED,
            payload: orcidData.orcidSyncStatus.data,
        });
        expect(actualState).toEqual(expectedState);
    });

    it('should return error state', () => {
        const previousState = {
            ...initialState,
        };
        const expectedState = {
            ...initialState,
            loadingOrcidSyncStatus: false,
            orcidSyncStatus: {},
        };

        const actualState = orcidSyncReducer(previousState, {
            type: actions.ORCID_SYNC_STATUS_LOAD_FAILED,
        });
        expect(actualState).toEqual(expectedState);
    });
});

describe('OrcidSync request reducers', () => {
    it('should return loading state', () => {
        const previousState = {
            ...initialState,
        };
        const expectedState = {
            ...initialState,
            requestingOrcidSync: true,
        };

        const actualState = orcidSyncReducer(previousState, { type: actions.ORCID_SYNC_REQUESTING });
        expect(actualState).toEqual(expectedState);
    });

    it('should return loaded state', () => {
        const previousState = {
            ...initialState,
            requestingOrcidSync: true,
        };
        const expectedState = {
            ...initialState,
            orcidSyncResponse: orcidData.orcidSyncResponse.data,
        };

        const actualState = orcidSyncReducer(previousState, {
            type: actions.ORCID_SYNC_SUCCESS,
            payload: orcidData.orcidSyncResponse.data,
        });
        expect(actualState).toEqual(expectedState);
    });

    it('should return error state', () => {
        const previousState = {
            ...initialState,
            requestingOrcidSync: true,
        };
        const expectedState = {
            ...initialState,
            requestingOrcidSync: false,
            orcidSyncResponse: null,
        };

        const actualState = orcidSyncReducer(previousState, {
            type: actions.ORCID_SYNC_FAILED,
        });
        expect(actualState).toEqual(expectedState);
    });
});
