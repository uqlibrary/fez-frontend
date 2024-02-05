import * as actions from 'actions/actionTypes';

const initialState = {
    scaleOfSignificance: [],
    clearedScaleAuthors: false,
};

const handlers = {
    [actions.ADMIN_SCALE_SIGNIFICANCE_UPDATED]: (state, action) => ({
        ...initialState,
        scaleOfSignificance: action.payload,
        clearedScaleAuthors: false,
    }),
};

export default function adminScaleOfSignificanceReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
