import {actionTypes} from 'redux-form';

export const resetValue = (state, action) => {
    switch (action.type) {
        case actionTypes.UNREGISTER_FIELD:
            const key = action.payload.name.split('.').shift();
            if (state && state.hasIn(['initial', key])) {
                return state;
            }
            return state
                ? state
                    .deleteIn(['values', key])
                    .deleteIn(['registeredFields', action.payload.name])
                    .deleteIn(['fields', key])
                : null;
        default:
            return state;
    }
};
