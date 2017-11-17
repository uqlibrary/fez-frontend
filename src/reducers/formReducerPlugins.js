import {actionTypes} from 'redux-form';

export const resetValue = (state, action) => {
    switch(action.type) {
        case actionTypes.UNREGISTER_FIELD:
            return state
                .setIn(['values', ...action.payload.name.split('.')], undefined)
                .deleteIn(['registeredFields', action.payload.name])
                .deleteIn(['fields', action.payload.name.split('.').shift()]);
        default:
            return state;
    }
};
