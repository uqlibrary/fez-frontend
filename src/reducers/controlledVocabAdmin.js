import * as actions from 'actions/actionTypes';

export const initialState = {
    vocab: null,
    vocabAdminBusy: false,
    vocabAdminSuccess: null,
    vocabAdminError: null,
};

const handlers = {
    [actions.VOCAB_ADMIN_BUSY]: () => ({
        ...initialState,
        vocabAdminBusy: true,
    }),

    [actions.VOCAB_ADMIN_SUCCESS]: (_, action) => ({
        ...initialState,
        vocabAdminBusy: false,
        vocabAdminSuccess: true,
        vocab: action.payload.data,
    }),

    [actions.VOCAB_ADMIN_ACTION]: (_, action) => ({
        ...initialState,
        vocab: action.payload,
    }),

    [actions.VOCAB_ADMIN_FAILED]: (_, action) => ({
        ...initialState,
        vocabAdminBusy: false,
        vocabAdminError: action.payload,
    }),

    [actions.VOCAB_ADMIN_CLEAR]: () => ({ ...initialState }),
};

export default function vocabAdminReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
