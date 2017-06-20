import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import FileUploader from '../components/FileUploader';
import {setAcceptedFileList} from '../actions';
import {showSnackbar} from 'modules/App/actions';

let FileUploaderContainer = reduxForm({
    destroyOnUnmount: false
})(FileUploader);

FileUploaderContainer = connect((state) => {
    const fileUploadState = state.get('fileUpload');
    return {
        acceptedFiles: fileUploadState.get('acceptedFiles'),
        fileMetadata: fileUploadState.get('fileMetadata')
    };
}, dispatch => {
    return {
        setAcceptedFileList: (acceptedFiles) => dispatch(setAcceptedFileList(acceptedFiles)),
        showSnackbar: (msg) => dispatch(showSnackbar(msg))
    };
})(FileUploaderContainer);

export default FileUploaderContainer;
