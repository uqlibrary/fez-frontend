import {connect} from 'react-redux';

import FileMetadata from '../components/FileMetadata';
import {deleteAllFiles, deleteFile, setCheckboxState} from '../actions';

const FileMetadataContainer = connect((state) => {
    const fileUploadState = state.get('fileUpload');
    return {
        acceptedFiles: fileUploadState.get('acceptedFiles'),
        fileMetadata: fileUploadState.get('fileMetadata'),
        uploadError: fileUploadState.get('uploadError'),
        uploadProgress: fileUploadState.get('progress')
    };
}, dispatch => {
    return {
        setCheckboxState: (event, isInputChecked) => dispatch(setCheckboxState(event, isInputChecked)),
        deleteAllFiles: () => dispatch(deleteAllFiles()),
        deleteFile: (file) => dispatch(deleteFile(file)),
    };
})(FileMetadata);

export default FileMetadataContainer;
