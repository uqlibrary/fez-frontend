import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import FileMetadata from '../components/FileMetadata';
import {deleteFile, setCheckboxState, setOpenAccessState} from '../actions';
import {showSnackbar} from 'modules/App/actions';

let FileMetadataContainer = reduxForm({
    destroyOnUnmount: false
})(FileMetadata);

FileMetadataContainer = connect((state) => {
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
        deleteFile: (file) => dispatch(deleteFile(file)),
        showSnackbar: (msg) => dispatch(showSnackbar(msg))
    };
})(FileMetadataContainer);

export default FileMetadataContainer;
