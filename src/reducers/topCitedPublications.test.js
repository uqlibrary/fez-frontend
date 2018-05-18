import * as actions from '../actions/actionTypes';
import topCitedPublicationsReducer from './topCitedPublications';
import {trendingPublications} from 'mock/data/testing/trendingPublications';

const initialState = {
    topCitedPublicationsList: {},
    loadingTopCitedPublications: {},
};

describe('Top cited publications reducer', () => {
    it('returns the correct state while top cited publications are loading', () => {
        const source = 'source';
        const test = topCitedPublicationsReducer(initialState, {type: `${actions.TOP_CITED_PUBLICATIONS_LOADING}@${source}`, source: source});
        expect(test.topCitedPublicationsList[source]).toEqual([]);
        expect(test.loadingTopCitedPublications[source]).toBeTruthy();
    });

    it('returns the correct state when top cited publications are loaded', () => {
        const source = 'source';
        const test = topCitedPublicationsReducer(initialState, {
            type: `${actions.TOP_CITED_PUBLICATIONS_LOADED}@${source}`,
            source: source,
            payload: trendingPublications
        });
        expect(test.topCitedPublicationsList[source]).toEqual(trendingPublications.data);
        expect(test.loadingTopCitedPublications[source]).toBeFalsy();
    });

    it('returns the correct state when top cited publications are loaded but 0 publications found', () => {
        const source = 'source';
        const test = topCitedPublicationsReducer(initialState, {
            type: `${actions.TOP_CITED_PUBLICATIONS_LOADED}@${source}`,
            source: source,
            payload: {total: 0, data: []}
        });
        expect(test.topCitedPublicationsList[source].length).toEqual(0);
        expect(test.loadingTopCitedPublications[source]).toBeFalsy();
    });

    it('returns the correct state when top cited publications fail to load', () => {
        const source = 'source';
        const test = topCitedPublicationsReducer(initialState, {type: `${actions.TOP_CITED_PUBLICATIONS_FAILED}@${source}`, source: source});
        expect(test.topCitedPublicationsList[source]).toEqual([]);
        expect(test.loadingTopCitedPublications[source]).toBeFalsy();
    });
});
