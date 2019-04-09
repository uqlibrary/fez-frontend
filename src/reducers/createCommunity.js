import * as actions from 'actions/actionTypes';

export const initialState = {
    newRecord: null,
    newCommunitySaving: false,
    newCommunityError: false,
    newCommunityErrorMessage: null
};

const handlers = {

    [actions.CREATE_COMMUNITY_SUCCESS]: (state, action) => (
        {
            ...initialState,
            newRecord: action.payload,
            newCommunitySaving: false,
            newCommunityError: false
        }
    ),

    [actions.CREATE_COMMUNITY_FAILED]: (state, action) => (
        {
            ...initialState,
            newCommunitySaving: false,
            newCommunityError: true,
            newCommunityErrorMessage: action.payload
        }
    ),

    [actions.CREATE_COMMUNITY_SAVING]: () => (
        {
            ...initialState,
            newCommunitySaving: true,
            newCommunityError: false
        }
    )
};

export default function createCommunityReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
