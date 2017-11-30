import * as actions from 'actions/actionTypes';

export const initialState = {
    hidePossiblyYourPublicationsLure: false,
    notificationAlert: null
};

const handlers = {
    [actions.APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_HIDE]: () => ({
        ...initialState,
        hidePossiblyYourPublicationsLure: true
    }),

    [actions.APP_NOTIFICATION]: (state, action) => ({
        ...state,
        notificationAlert: action.payload
    }),

    [actions.APP_NOTIFICATION_DISMISSED]: () => ({
        ...initialState,
        notificationAlert: null
    })
};

export default function appReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
