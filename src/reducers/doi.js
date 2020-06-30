import * as actions from 'actions/actionTypes';

const initialState = {
    doiRequesting: false,
    doiUpdated: null,
};

const handlers = {
    [actions.RECORD_DOI_UPDATE_REQUESTING]: () => ({
        ...initialState,
        doiRequesting: true,
    }),

    [actions.RECORD_DOI_UPDATE_SUCCEEDED]: () => ({
        ...initialState,
        doiRequesting: false,
        doiUpdated: true,
    }),

    [actions.RECORD_DOI_UPDATE_FAILED]: () => ({
        ...initialState,
        doiRequesting: false,
        doiUpdated: false,
    }),
};

export default function doiReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
