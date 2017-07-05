import Immutable from 'immutable';

import {
    FILE_DELETED,
    FILE_DOCUMENT_ACCESS_TYPES_LOADED,
    FILE_LIST_CREATED,
    FILE_LIST_DELETED,
    FILE_STATE_RESTORED,
    FILE_UPLOAD_TERMINATED,
    FILE_UPLOADING,
    FILE_UPLOADED
} from './actions';

// Immutable state
export const initialState = Immutable.fromJS({
    acceptedFiles: [],
    completedFiles: 0,
    documentAccessTypes: [],
    isUploadCompleted: false,
    progress: {},
    uploadError: ''
});

const fileUploadReducer = (state = initialState, action) => {
    switch (action.type) {
        case FILE_DELETED:
            const acceptedFiles = state.get('acceptedFiles').toJS();
            acceptedFiles.splice(action.payload, 1);
            console.dir(acceptedFiles);
            return state.set('acceptedFiles', Immutable.fromJS(acceptedFiles));
        case FILE_LIST_CREATED:
            const newList = state.get('acceptedFiles').concat(action.payload);
            return state.set('acceptedFiles', Immutable.fromJS(newList));
        case FILE_LIST_DELETED:
            return state.set('acceptedFiles', Immutable.fromJS([]));
        case FILE_UPLOADING:
            return state.set('progress', Immutable.fromJS(action.payload));
        case FILE_UPLOAD_TERMINATED:
            return state.set('uploadError', Immutable.fromJS(action.payload));
        case FILE_UPLOADED:
            const completedCount = state.get('completedFiles') + 1;
            return state.set('completedFiles', completedCount).set('isUploadCompleted', state.get('acceptedFiles').size === completedCount);
        case FILE_DOCUMENT_ACCESS_TYPES_LOADED:
            return state.set('documentAccessTypes', Immutable.fromJS(action.payload));
        case FILE_STATE_RESTORED:
            return initialState;
        default:
            return state;
    }
};

export default fileUploadReducer;
