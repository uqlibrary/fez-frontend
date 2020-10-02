import { actionTypes } from 'redux-form';
import { ADMIN_DELETE_ATTACHED_FILE } from 'actions/actionTypes';

export const resetValue = (state, action) => {
    switch (action.type) {
        case actionTypes.UNREGISTER_FIELD:
            if (!action.payload.name) {
                return state;
            }

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
        case actionTypes.CHANGE:
            const field = action.meta.field;
            if (field === 'rek_display_type' && action.meta.touch === false) {
                return state.deleteIn(['values', 'rek_subtype']);
            }
            return state;
        default:
            return state;
    }
};

export const deleteFileFromSecuritySection = (state, action) => {
    switch (action.type) {
        case ADMIN_DELETE_ATTACHED_FILE:
            return state.setIn(
                ['values', 'securitySection', 'dataStreams'],
                state
                    .get('values')
                    .get('securitySection')
                    .get('dataStreams')
                    .filter(file => file.toJS().dsi_dsid !== action.payload.dsi_dsid),
            );
        default:
            return state;
    }
};
