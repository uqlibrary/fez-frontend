import * as actions from 'actions/actionTypes';

const initialState = {
    saveRequesting: false,
    saveUpdated: false,
    saveFailed: false,
};

const handlers = {
    [actions.ADMIN_UPDATE_WORK_PROCESSING]: state => ({
        ...state,
        saveRequesting: true,
        saveFailed: false,
    }),

    [actions.ADMIN_UPDATE_WORK_SUCCESS]: state => ({
        ...state,
        saveRequesting: false,
        saveUpdated: true,
    }),

    [actions.ADMIN_UPDATE_WORK_FAILED]: state => ({
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
