import * as actions from 'actions/actionTypes';

const saveReducerOnSessionExpired = store => next => action => {
    if (action.type === actions.CURRENT_ACCOUNT_SESSION_EXPIRED) {
        localStorage.setItem(action.payload, JSON.stringify(Array.from(store.getState().get(action.payload))));
    }

    return next(action);
};

export default saveReducerOnSessionExpired;
