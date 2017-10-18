import * as actions from 'actions/actionTypes';

const controlledVocab = (value) => (value.substring(value.indexOf('@') + 1, value.length));

const handlers = {
    [`${actions.VOCABULARIES_LOAD_FAILED}@`]: (state, action) => {
        return {
            ...state,
            [controlledVocab(action.type)]: {
                controlledVocabList: [],
                controlledVocabLoading: false,
                controlledVocabLoadingError: true
            }
        };
    },
    [`${actions.VOCABULARIES_LOADED}@`]: (state, action) => {
        return {
            ...state,
            [controlledVocab(action.type)]: {
                controlledVocabList: action.payload,
                controlledVocabLoading: false,
                controlledVocabLoadingError: false
            }
        };
    },
    [`${actions.VOCABULARIES_LOADING}@`]: (state, action) => {
        return {
            ...state,
            [controlledVocab(action.type)]: {
                controlledVocabLoading: true,
                controlledVocabLoadingError: false
            }
        };
    }
};

export default function controlledVocabulariesReducer(state = {}, action) {
    const handler = handlers[action.type.substring(0, action.type.indexOf('@') + 1)];

    if (!handler) {
        return state;
    }
    return handler(state, action);
}
