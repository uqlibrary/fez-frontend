import * as actions from '../actions/actionTypes';
import controlledVocabulariesReducer from './controlledVocabularies';

describe('Controlled vocabularies reducer', () => {
    it('should return correct state on vocabulary loading', () => {
        const state = controlledVocabulariesReducer({}, {type: `${actions.VOCABULARIES_LOADING}@123456`});
        expect(state[123456].controlledVocabLoading).toBeTruthy();
        expect(state[123456].controlledVocabLoadingError).toBeFalsy();
    });

    it('should return correct state on vocabulary loaded', () => {
        const data = ['some', 'test', 'results'];
        const state = controlledVocabulariesReducer({}, {type: `${actions.VOCABULARIES_LOADED}@123456`, payload: data});
        expect(state[123456].controlledVocabList).toBe(data);
        expect(state[123456].controlledVocabLoading).toBeFalsy();
        expect(state[123456].controlledVocabLoadingError).toBeFalsy();
    });

    it('should return correct state on vocabulary load failed', () => {
        const state = controlledVocabulariesReducer({}, {type: `${actions.VOCABULARIES_LOAD_FAILED}@123456`});
        expect(state[123456].controlledVocabList).toEqual([]);
        expect(state[123456].controlledVocabLoading).toBeFalsy();
        expect(state[123456].controlledVocabLoadingError).toBeTruthy();
    });

    it('should return correct state with other vocab data set', () => {
        const oldState = {
            987655: {
                controlledVocabList: ['initial', 'controlled', 'vocab', 'list'],
                controlledVocabLoading: false,
                controlledVocabLoadingError: false
            }
        };
        const data = ['new', 'vocab', 'list'];

        const expectedState = {
            987655: {
                controlledVocabList: ['initial', 'controlled', 'vocab', 'list'],
                controlledVocabLoading: false,
                controlledVocabLoadingError: false
            },
            123456: {
                controlledVocabList: ['new', 'vocab', 'list'],
                controlledVocabLoading: false,
                controlledVocabLoadingError: false
            }
        };

        const state = controlledVocabulariesReducer(oldState, {type: `${actions.VOCABULARIES_LOADED}@123456`, payload: data});

        expect(state).toEqual(expectedState);
        expect(state[123456].controlledVocabLoading).toBeFalsy();
        expect(state[123456].controlledVocabLoadingError).toBeFalsy();
    });

    // it('should return unmodiifed state if action doesn\'t have a handler', () => {
        // const state = controlledVocabulariesReducer({abc: 'abc'}, {type: 'someotheraction'});
        // expect(state).toEqual({abc: 'abc'});
    // });
});