import * as actions from 'actions/actionTypes';
// import { record } from 'mock/data';

export const initialState = {
    communityList: [],
    loadingCommunities: false,
    loadingCommunitiesError: null,
    totalRecords: 0,
    startRecord: 0,
    endRecord: 0,
    currentPage: 1,
    perPage: 10,
};

const handlers = {
    [actions.VIEW_COMMUNITIES_LOADING]: () => ({
        ...initialState,
        loadingCommunities: true,
    }),

    [actions.VIEW_COMMUNITIES_LOADED]: (state, action) => ({
        ...initialState,
        loadingCommunities: false,
        communityList: action.payload.data,
        totalRecords: action.payload.total,
        startRecord: action.payload.from,
        endRecord: action.payload.to,
        currentPage: action.payload.current_page,
        perPage: action.payload.per_page,
    }),

    [actions.VIEW_COMMUNITIES_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        loadingCommunities: false,
        loadingCommunitiesError: action.payload,
    }),
};

export default function viewCommunitiesReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
