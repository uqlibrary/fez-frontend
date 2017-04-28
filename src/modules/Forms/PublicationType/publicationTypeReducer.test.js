import publicationTypeReducer, {initialState} from './reducer';
import {PUBLICATION_TYPES_LOADED, SELECTED_PUBLICATION_TYPE} from './actions';
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
                publicationTypes: publicationTypes,
                selectedPublicationType: {}
            })
        );
    });

    it('should handle SELECTED_PUBLICATION_TYPE', () => {
        const alteredState = Immutable.fromJS({
            publicationTypes: publicationTypes,
            selectedPublicationType: {}
        });

        expect(
            publicationTypeReducer(alteredState, {
                type: SELECTED_PUBLICATION_TYPE,
                payload: 179
            })
        ).toEqual(
            Immutable.fromJS({
                publicationTypes: publicationTypes,
                selectedPublicationType: Immutable.fromJS({id: 179, name: 'Journal Article'})
            })
        );
    });
});
