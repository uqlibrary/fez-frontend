import * as actions from 'actions/actionTypes';

const handlers = {
    [`${actions.VOCABULARIES_LOAD_FAILED}@`]: (state, action) => (
        {
            ...state,
            [actions.getActionSuffix(action.type)]: {
                controlledVocabList: [],
                controlledVocabLoading: false,
                controlledVocabLoadingError: true
            }
        }
    ),
    [`${actions.VOCABULARIES_LOADED}@`]: (state, action) => (
        {
            ...state,
            [actions.getActionSuffix(action.type)]: {
                controlledVocabList: action.payload,
                controlledVocabLoading: false,
                controlledVocabLoadingError: false
            }
        }
    ),
    [`${actions.VOCABULARIES_LOADING}@`]: (state, action) => (
        {
            ...state,
            [actions.getActionSuffix(action.type)]: {
                controlledVocabLoading: true,
                controlledVocabLoadingError: false
            }
        }
    )
};

export default function controlledVocabulariesReducer(state = {}, action) {
    const handler = handlers[actions.getAction(action.type)];

    if (!handler) {
        return state;
    }
    return handler(state, action);
}
