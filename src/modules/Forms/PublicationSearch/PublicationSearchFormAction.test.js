import {claimPublicationsReducer, initialState} from '../ClaimPublication';
import {DOI_SEARCH_COMPLETED, PUBMED_SEARCH_COMPLETED, TITLE_SEARCH_COMPLETED} from './actions';
import Immutable from 'immutable';

import {externalDoiSearchResultList, externalPubMedSearchResultsList, externalTitleSearchResultsList} from '../../../../src/mock/data/publicationSearch';

describe('Publication search form reducer', () => {
    it('should return the initial state', () => {
        expect(
            claimPublicationsReducer(undefined, {})
        ).toEqual(
            initialState
        );
    });

    it('should handle DOI_SEARCH_COMPLETED', () => {
        expect(
            claimPublicationsReducer(initialState, {
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
            claimPublicationsReducer(initialState, {
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
            claimPublicationsReducer(initialState, {
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
