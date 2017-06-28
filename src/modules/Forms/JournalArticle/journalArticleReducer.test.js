import publicationSubTypeReducer, {initialState} from './reducer';
import {PUBLICATION_SUB_TYPES_LOADED} from './actions';
import Immutable from 'immutable';

import {publicationSubTypeList} from 'mock/data/publicationSubTypes';

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
                publicationSubTypeList: publicationSubTypeList
            })
        );
    });
});
