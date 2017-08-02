import {connect} from 'react-redux';

import FileUploader from '../components/FileUploader';
import {resetToInitialState, setAcceptedFileList} from '../actions';

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
        setAcceptedFileList: (acceptedFiles) => dispatch(setAcceptedFileList(acceptedFiles))
    };
})(FileUploader);

export default FileUploaderContainer;
