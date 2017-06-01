import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import FileUploader from '../components/FileUploader';
import {openDialog, setAcceptedFileList, initializeDialog} from '../actions';
import {showSnackbar} from 'modules/App/actions';

let FileUploaderContainer = reduxForm({
    destroyOnUnmount: false
})(FileUploader);

FileUploaderContainer = connect((state) => {
    const fileUploadState = state.get('fileUpload');
    return {
        fileMetadata: fileUploadState.get('fileMetadata')
    };
}, dispatch => {
    return {
        initializeDialog: () => dispatch(initializeDialog()),
        openDialog: () => dispatch(openDialog()),
        setAcceptedFileList: (acceptedFiles) => dispatch(setAcceptedFileList(acceptedFiles)),
        showSnackbar: (msg) => dispatch(showSnackbar(msg))
    };
})(FileUploaderContainer);

export default FileUploaderContainer;
