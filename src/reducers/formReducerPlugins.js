import {actionTypes} from 'redux-form';

export const resetValue = (state, action) => {
    switch(action.type) {
        case actionTypes.UNREGISTER_FIELD:
            const key = action.payload.name.split('.').shift();
            if (state.hasIn(['initial', key])) {
                return state;
            }
            return state
                .deleteIn(['values', key])
                .deleteIn(['registeredFields', action.payload.name])
                .deleteIn(['fields', key]);
        default:
            return state;
    }
};
