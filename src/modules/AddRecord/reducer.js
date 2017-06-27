import Immutable from 'immutable';

import {
    ADD_RECORD_STEPPER_INDEX_INCREASED,
    ADD_RECORD_STEPPER_INDEX_DECREASED
} from './actions';

// Immutable state
export const initialState = Immutable.fromJS({
    stepperIndex: 2
});

const addRecordReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_RECORD_STEPPER_INDEX_INCREASED:
            return state.set('stepperIndex', state.get('stepperIndex') + 1);
        case ADD_RECORD_STEPPER_INDEX_DECREASED:
            return state.set('stepperIndex', state.get('stepperIndex') - 1);
        default:
            return state;
    }
};

export default addRecordReducer;
