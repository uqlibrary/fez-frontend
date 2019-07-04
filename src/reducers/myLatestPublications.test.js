import * as actions from 'actions/actionTypes';
import myLatestPublicationsReducer from './myLatestPublications';
import { latestPubsPayload } from 'mock/data/testing/latestPublications';

const initialState = {
    latestPublicationsList: [],
    loadingLatestPublications: true,
    totalPublicationsCount: null,
};

describe('My latest publications reducer', () => {
    it('returns the correct state while latest publications are loading', () => {
        const test = myLatestPublicationsReducer(initialState, { type: actions.LATEST_PUBLICATIONS_LOADING });
        expect(test.latestPublicationsList).toEqual([]);
        expect(test.loadingLatestPublications).toBeTruthy();
    });

    it('returns the correct state when latest publications are loaded', () => {
        const test = myLatestPublicationsReducer(initialState, {
            type: actions.LATEST_PUBLICATIONS_LOADED,
            payload: latestPubsPayload,
        });
        expect(test.latestPublicationsList).toEqual(latestPubsPayload.data);
        expect(test.loadingLatestPublications).toBeFalsy();
    });

    it('returns the correct state when latest publications are loaded but 0 publications found', () => {
        const test = myLatestPublicationsReducer(initialState, {
            type: actions.LATEST_PUBLICATIONS_LOADED,
            payload: { total: 0, data: [] },
        });
        expect(test.latestPublicationsList.length).toEqual(0);
        expect(test.loadingLatestPublications).toBeFalsy();
    });

    it('returns the correct state when latest publications fail to load', () => {
        const test = myLatestPublicationsReducer(initialState, { type: actions.LATEST_PUBLICATIONS_FAILED });
        expect(test.latestPublicationsList).toEqual([]);
        expect(test.loadingLatestPublications).toBeFalsy();
    });
});
