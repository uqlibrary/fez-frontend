import * as actions from 'actions/actionTypes';

export const initialState = {
    hidePossiblyYourPublicationsLure: false
};

const handlers = {
    [actions.APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_HIDE]: () => ({
        ...initialState,
        hidePossiblyYourPublicationsLure: true
    })
};

export default function appReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
