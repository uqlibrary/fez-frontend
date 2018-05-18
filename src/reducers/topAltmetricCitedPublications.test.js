import * as actions from '../actions/actionTypes';
import topAltmetricCitedPublicationsReducer from './topAltmetricCitedPublications';
import {trendingPublications} from 'mock/data/testing/trendingPublications';

const initialState = {
    topCitedPublicationsList: [],
    loadingTopCitedPublications: false,
};

describe('Top altmetric cited publications reducer', () => {
    it('returns the correct state while top cited publications are loading', () => {
        const test = topAltmetricCitedPublicationsReducer(initialState, {type: actions.TOP_ALTMETRIC_CITED_PUBLICATIONS_LOADING});
        expect(test.topCitedPublicationsList).toEqual([]);
        expect(test.loadingTopCitedPublications).toBeTruthy();
    });

    it('returns the correct state when top altmetric cited publications are loaded', () => {
        const test = topAltmetricCitedPublicationsReducer(initialState, {
            type: actions.TOP_ALTMETRIC_CITED_PUBLICATIONS_LOADED,
            payload: trendingPublications
        });
        expect(test.topCitedPublicationsList).toEqual(trendingPublications.data);
        expect(test.loadingTopCitedPublications).toBeFalsy();
    });

    it('returns the correct state when top altmetric cited publications are loaded but 0 publications found', () => {
        const test = topAltmetricCitedPublicationsReducer(initialState, {
            type: actions.TOP_ALTMETRIC_CITED_PUBLICATIONS_LOADED,
            payload: {total: 0, data: []}
        });
        expect(test.topCitedPublicationsList.length).toEqual(0);
        expect(test.loadingTopCitedPublications).toBeFalsy();
    });

    it('returns the correct state when top altmetric cited publications fail to load', () => {
        const test = topAltmetricCitedPublicationsReducer(initialState, {type: actions.TOP_ALTMETRIC_CITED_PUBLICATIONS_FAILED});
        expect(test.topCitedPublicationsList).toEqual([]);
        expect(test.loadingTopCitedPublications).toBeFalsy();
    });
});
