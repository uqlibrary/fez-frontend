import * as actions from 'actions/actionTypes';

const initState = {
    itemsList: [],
    itemsLoading: false,
    itemsLoadingError: false
};

const handlers = {
    [`${actions.VOCABULARIES_LOAD_FAILED}@`]: (state, action) => (
        {
            ...state,
            [actions.getActionSuffix(action.type)]: {
                ...initState,
                itemsLoadingError: true
            }
        }
    ),
    [`${actions.VOCABULARIES_LOADED}@`]: (state, action) => (
        {
            ...state,
            [actions.getActionSuffix(action.type)]: {
                ...initState,
                itemsList: action.payload.map(item => (item.controlled_vocab.cvo_title))
            }
        }
    ),
    [`${actions.VOCABULARIES_LOADING}@`]: (state, action) => (
        {
            ...state,
            [actions.getActionSuffix(action.type)]: {
                ...initState,
                itemsLoading: true
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
