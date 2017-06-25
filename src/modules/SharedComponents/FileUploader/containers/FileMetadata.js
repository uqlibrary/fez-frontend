import {connect} from 'react-redux';

import FileMetadata from '../components/FileMetadata';
import {deleteAllFiles, deleteFile, setCheckboxState, setOpenAccessState} from '../actions';
import {showSnackbar} from 'modules/App/actions';

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
        setOpenAccessState: (isOpenAccess) => dispatch(setOpenAccessState(isOpenAccess)),
        deleteAllFiles: () => dispatch(deleteAllFiles()),
        deleteFile: (file) => dispatch(deleteFile(file)),
        showSnackbar: (msg) => dispatch(showSnackbar(msg))
    };
})(FileMetadata);

export default FileMetadataContainer;
