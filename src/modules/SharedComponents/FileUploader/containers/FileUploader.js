import {connect} from 'react-redux';

import FileUploader from '../components/FileUploader';
import {resetToInitialState, setAcceptedFileList} from '../actions';
import {showSnackbar} from 'modules/App/actions';

const FileUploaderContainer = connect((state) => {
    const fileUploadState = state.get('fileUpload');
    return {
        acceptedFiles: fileUploadState.get('acceptedFiles'),
        fileMetadata: fileUploadState.get('fileMetadata'),
        uploadError: fileUploadState.get('uploadError')
    };
}, dispatch => {
    return {
        resetToInitialState: () => dispatch(resetToInitialState()),
        setAcceptedFileList: (acceptedFiles) => dispatch(setAcceptedFileList(acceptedFiles)),
        showSnackbar: (msg) => dispatch(showSnackbar(msg))
    };
})(FileUploader);

export default FileUploaderContainer;
