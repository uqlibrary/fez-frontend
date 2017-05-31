import Immutable from 'immutable';

import {
    FILE_UPLOADING,
    FILE_DIALOG_OPENED,
    FILE_DIALOG_CLOSED,
    FILE_LIST_CREATED,
    FILE_METADATA_CREATED,
    FILE_STEPPER_INDEX_DECREASED,
    FILE_STEPPER_INDEX_INCREASED,
    FILE_STEPPER_RESET_STATE,
    FILE_UPLOADED,
    FILE_DOCUMENT_ACCESS_TYPES_LOADED
} from './actions';

// Immutable state
export const initialState = Immutable.fromJS({
    acceptedFiles: [],
    completedFiles: 0,
    documentAccessTypes: [],
    fileMetaData: [],
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
        case FILE_STEPPER_RESET_STATE:
            return initialState.set('fileMetaData', state.get('fileMetaData')).set('documentAccessTypes', state.get('documentAccessTypes'));
        case FILE_LIST_CREATED:
            return state.set('acceptedFiles', Immutable.fromJS(action.payload));
        case FILE_METADATA_CREATED:
            return state.set('fileMetaData', Immutable.fromJS(action.payload));
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
