import * as actions from 'actions/actionTypes';

const initState = {
    rawData: [],
    itemsList: [],
    itemsKeyValueList: [],
    itemsLoading: false,
    itemsLoadingError: false,
    itemsLoaded: false,
};

function flatten(list) {
    // controlled_vocab.controlled_vocab_children
    return list?.map?.(item => {
        return [
            { key: item.controlled_vocab.cvo_id, value: item.controlled_vocab.cvo_title },
            ...[].concat.apply([], flatten(item.controlled_vocab.controlled_vocab_children)),
        ];
    });
}

const handlers = {
    [`${actions.VOCABULARIES_LOAD_FAILED}@`]: (state, action) => ({
        ...state,
        [actions.getActionSuffix(action.type)]: {
            ...initState,
            itemsLoadingError: true,
        },
    }),
    [`${actions.VOCABULARIES_LOADED}@`]: (state, action) => ({
        ...state,
        [actions.getActionSuffix(action.type)]: {
            ...initState,
            rawData: action.payload,
            itemsList: action.payload?.map?.(item => item.controlled_vocab.cvo_title),
            itemsKeyValueList: [].concat.apply([], flatten(action.payload)),
            itemsLoaded: true,
        },
    }),
    [`${actions.VOCABULARIES_LOADING}@`]: (state, action) => ({
        ...state,
        [actions.getActionSuffix(action.type)]: {
            ...initState,
            itemsLoading: true,
        },
    }),
};

export default function controlledVocabulariesReducer(state = {}, action) {
    const handler = handlers[actions.getAction(action.type)];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
