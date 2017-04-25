import publicationSubTypeReducer, {initialState} from './reducer';
import {PUBLICATION_SUB_TYPES_LOADED, AUTHORS_LOADED} from './actions';
import Immutable from 'immutable';

import {publicationSubTypes} from '../../../../src/mock/data/publicationSubTypes';

const authors = [
    {'id': 202, 'name': 'Author 8'},
    {'id': 263, 'name': 'Author 9'},
    {'id': 174, 'name': 'Author 10'},
    {'id': 177, 'name': 'Author 11'}
];

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
                payload: publicationSubTypes
            })
        ).toEqual(
            Immutable.fromJS({
                listOfAuthors: {},
                publicationSubTypes: publicationSubTypes
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
                listOfAuthors: authors,
                publicationSubTypes: {}
            })
        );
    });
});
