import Immutable from 'immutable';

import {FILE_UPLOADING, FILE_DIALOG_OPENED, FILE_DIALOG_CLOSED, FILE_DECREASE_STEP, FILE_INCREASE_STEP, FILE_RESET_STEP, FILE_LIST_CREATED, FILE_UPLOADED} from './actions';

// Immutable state
export const initialState = Immutable.fromJS({
    acceptedFiles: [],
    completedFiles: 0,
    isUploadCompleted: false,
    isDialogOpen: Immutable.fromJS(false),
    progress: {},
    stepperIndex: 0
});

const fileUploadReducer = (state = initialState, action) => {
    switch (action.type) {
        case FILE_DIALOG_OPENED:
        case FILE_DIALOG_CLOSED:
            return state.set('isDialogOpen', Immutable.fromJS(action.payload));
        case FILE_INCREASE_STEP:
            return state.set('stepperIndex', state.get('stepperIndex') + 1);
        case FILE_DECREASE_STEP:
            return state.set('stepperIndex', state.get('stepperIndex') - 1);
        case FILE_RESET_STEP:
            return state.set('stepperIndex', 0);
        case FILE_UPLOADING:
            return state.set('progress', Immutable.fromJS(action.payload));
        case FILE_LIST_CREATED:
            return state.set('acceptedFiles', Immutable.fromJS(action.payload));
        case FILE_UPLOADED:
            const completedCount = state.get('completedFiles') + 1;
            return state.set('completedFiles', completedCount).set('isUploadCompleted', state.get('acceptedFiles').size === completedCount);
        default:
            return state;
    }
};

export default fileUploadReducer;
