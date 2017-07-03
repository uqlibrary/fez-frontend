// TODO: fix this test later - added loadingSearch to state
import publicationSearchReducer, {initialState} from './reducer';
import {DOI_SEARCH_COMPLETED, PUBMED_SEARCH_COMPLETED, TITLE_SEARCH_COMPLETED} from './actions';
import Immutable from 'immutable';

import {externalDoiSearchResultList, externalPubMedSearchResultsList, externalTitleSearchResultsList} from 'mock/data/publicationSearch';

describe.skip('Publication search form reducer', () => {
    it('should return the initial state', () => {
        expect(
            publicationSearchReducer(undefined, {})
        ).toEqual(
            initialState
        );
    });

    it('should handle DOI_SEARCH_COMPLETED', () => {
        expect(
            publicationSearchReducer(initialState, {
                type: DOI_SEARCH_COMPLETED,
                payload: externalDoiSearchResultList
            })
        ).toEqual(
            Immutable.fromJS({
                searchResultsList: externalDoiSearchResultList
            })
        );
    });

    it('should handle PUBMED_SEARCH_COMPLETED', () => {
        expect(
            publicationSearchReducer(initialState, {
                type: PUBMED_SEARCH_COMPLETED,
                payload: externalPubMedSearchResultsList
            })
        ).toEqual(
            Immutable.fromJS({
                searchResultsList: externalPubMedSearchResultsList
            })
        );
    });

    it('should handle TITLE_SEARCH_COMPLETED', () => {
        expect(
            publicationSearchReducer(initialState, {
                type: TITLE_SEARCH_COMPLETED,
                payload: externalTitleSearchResultsList
            })
        ).toEqual(
            Immutable.fromJS({
                searchResultsList: externalTitleSearchResultsList
            })
        );
    });
});
