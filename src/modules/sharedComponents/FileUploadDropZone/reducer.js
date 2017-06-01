import Immutable from 'immutable';

import {
    DIALOG_GETTING_STARTED_PAGE,
    DIALOG_STEPPER_PAGE,
    FILE_DOCUMENT_ACCESS_TYPES_LOADED,
    FILE_DIALOG_OPENED,
    FILE_DIALOG_CLOSED,
    FILE_DIALOG_INITIALIZED,
    FILE_LIST_CREATED,
    FILE_METADATA_UPDATED,
    FILE_PAGE_DECREASED,
    FILE_PAGE_INCREASED,
    FILE_STEPPER_INDEX_DECREASED,
    FILE_STEPPER_INDEX_INCREASED,
    FILE_UPLOAD_TERMINATED,
    FILE_UPLOADING,
    FILE_UPLOADED
} from './actions';

// Immutable state
export const initialState = Immutable.fromJS({
    acceptedFiles: [],
    completedFiles: 0,
    documentAccessTypes: [],
    fileMetadata: [],
    isUploadCompleted: false,
    isDialogOpen: false,
    page: DIALOG_GETTING_STARTED_PAGE,
    progress: {},
    stepperIndex: 0,
    uploadError: ''
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
        case FILE_LIST_CREATED:
            return state.set('acceptedFiles', Immutable.fromJS(action.payload));
        case FILE_METADATA_UPDATED:
            return state.set('fileMetadata', Immutable.fromJS(action.payload));
        case FILE_UPLOADING:
            return state.set('progress', Immutable.fromJS(action.payload));
        case FILE_UPLOAD_TERMINATED:
            return state.set('uploadError', Immutable.fromJS(action.payload));
        case FILE_UPLOADED:
            const completedCount = state.get('completedFiles') + 1;
            return state.set('completedFiles', completedCount).set('isUploadCompleted', state.get('acceptedFiles').size === completedCount);
        case FILE_DOCUMENT_ACCESS_TYPES_LOADED:
            return state.set('documentAccessTypes', Immutable.fromJS(action.payload));
        case FILE_PAGE_INCREASED:
            return state.set('page', Immutable.fromJS(DIALOG_STEPPER_PAGE));
        case FILE_PAGE_DECREASED:
            return state.set('page', Immutable.fromJS(DIALOG_GETTING_STARTED_PAGE));
        case FILE_DIALOG_INITIALIZED:
            return initialState.set('fileMetadata', state.get('fileMetadata')).set('documentAccessTypes', state.get('documentAccessTypes'));
        default:
            return state;
    }
};

export default fileUploadReducer;
