import * as actions from './actionTypes';

export function updateAdminScaleSignificance(items) {
    return dispatch => {
        dispatch({ type: actions.ADMIN_SCALE_SIGNIFICANCE_UPDATED, payload: items });
    };
}
