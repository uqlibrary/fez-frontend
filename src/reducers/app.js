import * as actions from 'actions/actionTypes';

export const initialState = {
    hidePossiblyYourPublicationsLure: false,
    appAlert: null
};

const handlers = {
    [actions.APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_HIDE]: (state) => ({
        ...state,
        hidePossiblyYourPublicationsLure: true
    }),

    [actions.APP_ALERT_SHOW]: (state, action) => ({
        ...state,
        appAlert: action.payload
    }),

    [actions.APP_ALERT_HIDE]: (state) => ({
        ...state,
        appAlert: null
    })
};

export default function appReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    console.log(action);
    return handler(state, action);
}
