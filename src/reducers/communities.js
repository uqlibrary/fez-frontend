import * as actions from 'actions/actionTypes';
// import { record } from 'mock/data';

export const initialState = {
    communityList: [],
    loadingcommunities: false,
    loadingCommunitiesError: null,
    totalPages: 0,
    startPage: 0,
    endPage: 0,
    currentPage: 0,
    perPage: 0,
};

const handlers = {
    [actions.VIEW_COMMUNITIES_LOADING]: () => ({
        ...initialState,
        loadingcommunities: true,
    }),

    [actions.VIEW_COMMUNITIES_LOADED]: (state, action) => ({
        ...initialState,
        loadingcommunities: false,
        communityList: action.payload.data,
        totalRecords: action.payload.total,
        startRecord: action.payload.from,
        endRecord: action.payload.to,
        currentPage: action.payload.current_page,
        perPage: action.payload.per_page,
    }),

    [actions.VIEW_COMMUNITIES_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        loadingcommunities: false,
        loadingCommunitiesError: action.payload,
    }),
    // [actions.VIEW_COMMUNITIES_SORT_CHANGE]: state => ({
    //     ...state,
    // }),
};

export default function viewCommunitiesReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
