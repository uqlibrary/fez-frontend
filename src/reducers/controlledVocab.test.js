import * as actions from 'actions/actionTypes';
import viewVocabReducer from './controlledVocab';

describe('Controlled vocabularies reducer', () => {
    it('should return correct state on vocabulary loading', () => {
        const state = controlledVocabulariesReducer({}, { type: `${actions.VIEW_VOCAB_LOADING}@123456` });
        expect(state[123456].itemsLoading).toBeTruthy();
        expect(state[123456].itemsLoadingError).toBeFalsy();
    });

    it('should return correct state on vocabulary loaded', () => {
        const inputData = [
            {
                cvr_id: 4706,
                cvr_parent_cvo_id: 453581,
                cvr_child_cvo_id: 453582,
                controlled_vocab: {
                    cvo_id: 453582,
                    cvo_title: 'One',
                    cvo_desc: '',
                    cvo_image_filename: null,
                    cvo_external_id: null,
                    cvo_hide: 0,
                    cvo_order: 2,
                    cvo_lat: null,
                    cvo_long: null,
                    cvo_policy: null,
                    controlled_vocab_children: [],
                },
            },
            {
                cvr_id: 4707,
                cvr_parent_cvo_id: 453581,
                cvr_child_cvo_id: 453583,
                controlled_vocab: {
                    cvo_id: 453583,
                    cvo_title: 'Two',
                    cvo_desc: '',
                    cvo_image_filename: null,
                    cvo_external_id: null,
                    cvo_hide: 0,
                    cvo_order: 4,
                    cvo_lat: null,
                    cvo_long: null,
                    cvo_policy: null,
                    controlled_vocab_children: [],
                },
            },
        ];
        const expectedData = ['One', 'Two'];

        const state = controlledVocabulariesReducer(
            {},
            { type: `${actions.VIEW_VOCAB_LOADED}@123456`, payload: inputData },
        );
        expect(state[123456].itemsList).toEqual(expectedData);
        expect(state[123456].itemsLoading).toBeFalsy();
        expect(state[123456].itemsLoadingError).toBeFalsy();
    });

    it('should return correct state on vocabulary load failed', () => {
        const state = controlledVocabulariesReducer({}, { type: `${actions.VIEW_VOCAB_LOAD_FAILED}@123456` });
        expect(state[123456].itemsList).toEqual([]);
        expect(state[123456].itemsLoading).toBeFalsy();
        expect(state[123456].itemsLoadingError).toBeTruthy();
    });

    it('should return new state with other vocab data set', () => {
        const oldState = {
            987655: {
                itemsList: ['One', 'Two'],
                itemsLoading: false,
                itemsLoadingError: false,
            },
        };
        const inputData = [
            {
                cvr_id: 4706,
                cvr_parent_cvo_id: 453581,
                cvr_child_cvo_id: 453582,
                controlled_vocab: {
                    cvo_id: 453582,
                    cvo_title: 'Three',
                    cvo_desc: '',
                    cvo_image_filename: null,
                    cvo_external_id: null,
                    cvo_hide: 0,
                    cvo_order: 2,
                    cvo_lat: null,
                    cvo_long: null,
                    cvo_policy: null,
                    controlled_vocab_children: [],
                },
            },
            {
                cvr_id: 4707,
                cvr_parent_cvo_id: 453581,
                cvr_child_cvo_id: 453583,
                controlled_vocab: {
                    cvo_id: 453583,
                    cvo_title: 'Four',
                    cvo_desc: '',
                    cvo_image_filename: null,
                    cvo_external_id: null,
                    cvo_hide: 0,
                    cvo_order: 4,
                    cvo_lat: null,
                    cvo_long: null,
                    cvo_policy: null,
                    controlled_vocab_children: [],
                },
            },
        ];

        const expectedState = {
            '123456': {
                itemsKeyValueList: [
                    {
                        key: 453582,
                        value: 'Three',
                    },
                    {
                        key: 453583,
                        value: 'Four',
                    },
                ],
                itemsList: ['Three', 'Four'],
                itemsLoading: false,
                itemsLoadingError: false,
            },
            '987655': {
                itemsList: ['One', 'Two'],
                itemsLoading: false,
                itemsLoadingError: false,
            },
        };

        const state = controlledVocabulariesReducer(oldState, {
            type: `${actions.VIEW_VOCAB_LOADED}@123456`,
            payload: inputData,
        });

        expect(state).toEqual(expectedState);
        expect(state[123456].itemsLoading).toBeFalsy();
        expect(state[123456].itemsLoadingError).toBeFalsy();
    });

    it("should return unmodiifed state if action doesn't have a handler", () => {
        const state = controlledVocabulariesReducer({ abc: 'abc' }, { type: 'INVALID_ACTION_TYPE' });
        expect(state).toEqual({ abc: 'abc' });
    });
});
