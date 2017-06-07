import publicationSubTypeReducer, {initialState} from './reducer';
import {PUBLICATION_SUB_TYPES_LOADED, AUTHORS_LOADED} from './actions';
import Immutable from 'immutable';

import {publicationSubTypeList} from 'mock/data/publicationSubTypes';
import {authors} from 'mock/data/authors';

describe('Publication type reducer', () => {
    it('should return the initial state', () => {
        expect(
            publicationSubTypeReducer(undefined, {})
        ).toEqual(
            initialState
        );
    });

    it('should handle PUBLICATION_SUB_TYPES_LOADED', () => {
        expect(
            publicationSubTypeReducer(initialState, {
                type: PUBLICATION_SUB_TYPES_LOADED,
                payload: publicationSubTypeList
            })
        ).toEqual(
            Immutable.fromJS({
                authorList: {},
                publicationSubTypeList: publicationSubTypeList
            })
        );
    });

    it('should handle AUTHORS_LOADED', () => {
        expect(
            publicationSubTypeReducer(initialState, {
                type: AUTHORS_LOADED,
                payload: authors
            })
        ).toEqual(
            Immutable.fromJS({
                authorList: authors,
                publicationSubTypeList: {}
            })
        );
    });
});
