import publicationTypeReducer, {initialState} from './reducer';
import {PUBLICATION_TYPES_LOADED} from './actions';
import Immutable from 'immutable';

import {publicationTypes} from '../../../../src/mock/data/publicationTypes';

describe('Publication type reducer', () => {
    it('should return the initial state', () => {
        expect(
            publicationTypeReducer(undefined, {})
        ).toEqual(
            initialState
        );
    });

    it('should handle PUBLICATION_TYPES_LOADED', () => {
        expect(
            publicationTypeReducer(initialState, {
                type: PUBLICATION_TYPES_LOADED,
                payload: publicationTypes
            })
        ).toEqual(
            Immutable.fromJS({
                publicationTypes: publicationTypes
            })
        );
    });
});
