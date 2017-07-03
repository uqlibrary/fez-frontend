import publicationTypeReducer, {initialState} from './reducer';
import {PUBLICATION_TYPES_LOADED, PUBLICATION_TYPE_SELECTED} from './actions';
import Immutable from 'immutable';

import {publicationTypeList} from 'mock/data/publicationTypes';

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
                payload: publicationTypeList
            })
        ).toEqual(
            Immutable.fromJS({
                publicationTypeList: publicationTypeList,
                selectedPublicationType: {}
            })
        );
    });

    it('should handle PUBLICATION_TYPE_SELECTED', () => {
        const alteredState = Immutable.fromJS({
            publicationTypeList: publicationTypeList,
            selectedPublicationType: {}
        });

        expect(
            publicationTypeReducer(alteredState, {
                type: PUBLICATION_TYPE_SELECTED,
                payload: 179
            })
        ).toEqual(
            Immutable.fromJS({
                publicationTypeList: publicationTypeList,
                selectedPublicationType: Immutable.fromJS({id: 179, name: 'Journal Article', class: 'Uqlibrary\\FezCore\\Types\\JournalArticle'})
            })
        );
    });
});
