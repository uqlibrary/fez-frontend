import Immutable from 'immutable';

import {
    FILE_UPLOADING,
    FILE_DIALOG_OPENED,
    FILE_DIALOG_CLOSED,
    FILE_STEPPER_INDEX_DECREASED,
    FILE_STEPPER_INDEX_INCREASED,
    FILE_STEPPER_INDEX_ZEROED,
    FILE_UPLOADED,
    FILE_DOCUMENT_ACCESS_TYPES_LOADED
} from './actions';

// Immutable state
export const initialState = Immutable.fromJS({
    completedFiles: 0,
    documentAccessTypes: [],
    isUploadCompleted: false,
    isDialogOpen: false,
    progress: {},
    stepperIndex: 0
});

const fileUploadReducer = (state = initialState, action) => {
    switch (action.type) {
        case FILE_DIALOG_OPENED:
        case FILE_DIALOG_CLOSED:
            return state.set('isDialogOpen', action.payload);
        case FILE_STEPPER_INDEX_INCREASED:
            return state.set('stepperIndex', state.get('stepperIndex') + 1);
        case FILE_STEPPER_INDEX_DECREASED:
            return state.set('stepperIndex', state.get('stepperIndex') - 1);
        case FILE_STEPPER_INDEX_ZEROED:
            return state.set('stepperIndex', 0);
        case FILE_UPLOADING:
            return state.set('progress', Immutable.fromJS(action.payload));
        case FILE_UPLOADED:
            const completedCount = state.get('completedFiles') + 1;
            return state.set('completedFiles', completedCount).set('isUploadCompleted', state.get('acceptedFiles').size === completedCount);
        case FILE_DOCUMENT_ACCESS_TYPES_LOADED:
            return state.set('documentAccessTypes', Immutable.fromJS(action.payload));
        default:
            return state;
    }
};

export default fileUploadReducer;
