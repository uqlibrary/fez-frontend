import * as actions from 'actions/actionTypes';

const formDataSaverOnSessionExpired = store => next => action => {
    if (action.type === actions.CURRENT_ACCOUNT_SESSION_EXPIRED) {
        localStorage.setItem('form', JSON.stringify(Array.from(store.getState().get('form'))));
    }

    return next(action);
};

export default formDataSaverOnSessionExpired;
