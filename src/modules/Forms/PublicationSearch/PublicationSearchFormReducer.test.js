import publicationSearchReducer, {initialState} from './reducer';
import {DOI_SEARCH_COMPLETE, PUBMED_SEARCH_COMPLETE, TITLE_SEARCH_COMPLETE} from './actions';
import Immutable from 'immutable';

import {externalDoiSearchResult, externalPubMedSearchResults, externalTitleSearchResults} from '../../../../src/mock/data/publicationSearch';

describe('Publication search form reducer', () => {
    it('should return the initial state', () => {
        expect(
            publicationSearchReducer(undefined, {})
        ).toEqual(
            initialState
        );
    });

    it('should handle DOI_SEARCH_COMPLETE', () => {
        expect(
            publicationSearchReducer(initialState, {
                type: DOI_SEARCH_COMPLETE,
                payload: externalDoiSearchResult
            })
        ).toEqual(
            Immutable.fromJS({
                searchResults: externalDoiSearchResult
            })
        );
    });

    it('should handle PUBMED_SEARCH_COMPLETE', () => {
        expect(
            publicationSearchReducer(initialState, {
                type: PUBMED_SEARCH_COMPLETE,
                payload: externalPubMedSearchResults
            })
        ).toEqual(
            Immutable.fromJS({
                searchResults: externalPubMedSearchResults
            })
        );
    });

    it('should handle TITLE_SEARCH_COMPLETE', () => {
        expect(
            publicationSearchReducer(initialState, {
                type: TITLE_SEARCH_COMPLETE,
                payload: externalTitleSearchResults
            })
        ).toEqual(
            Immutable.fromJS({
                searchResults: externalTitleSearchResults
            })
        );
    });
});
