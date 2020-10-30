import * as actions from 'actions/actionTypes';

export const initialState = {
    bulkUpdatesListLoading: true,
    bulkUpdatesList: null,
    bulkUpdatesListError: null,
};

const handlers = {
    [actions.BULK_UPDATES_LIST_LOADING]: state => ({
        ...state,
        bulkUpdatesListLoading: true,
    }),

    [actions.BULK_UPDATES_LIST_LOADED]: (state, action) => ({
        ...state,
        bulkUpdatesListLoading: false,
        bulkUpdatesList: action.payload,
    }),

    [actions.BULK_UPDATES_LIST_FAILED]: (state, action) => ({
        ...state,
        bulkUpdatesListLoading: false,
        bulkUpdatesList: null,
        bulkUpdatesListError: action.payload,
    }),
};

export default function bulkUpdatesReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
