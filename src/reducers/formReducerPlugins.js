import {actionTypes} from 'redux-form';

export const resetValue = (state, action) => {
    switch(action.type) {
        case actionTypes.UNREGISTER_FIELD:
            return state
                .deleteIn(['values', action.payload.name.split('.').shift()])
                .deleteIn(['registeredFields', action.payload.name])
                .deleteIn(['fields', action.payload.name.split('.').shift()]);
        default:
            return state;
    }
};
