import * as actions from 'actions/actionTypes';

const initialState = {
    saveRequesting: null,
    saveUpdated: false,
    saveFailed: false,
};

const handlers = {
    [actions.CHANGE_DISPLAY_TYPE_INPROGRESS]: state => ({
        ...state,
        saveRequesting: true,
        saveFailed: false,
    }),

    [actions.CHANGE_DISPLAY_TYPE_SUCCESS]: state => ({
        ...state,
        saveRequesting: false,
        saveUpdated: true,
    }),

    [actions.CHANGE_DISPLAY_TYPE_FAILED]: state => ({
        ...state,
        saveFailed: true,
        saveRequesting: false,
    }),
};

export default function changeDisplayTypeReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
