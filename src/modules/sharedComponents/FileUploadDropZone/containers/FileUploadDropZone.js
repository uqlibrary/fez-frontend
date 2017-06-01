import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import FileUploadDropZone from '../components/FileUploadDropZone';
import {openDialog, setAcceptedFileList} from '../actions';
import {showSnackbar} from '../../../App/actions';

let FileUploadDropZoneContainer = reduxForm({
    destroyOnUnmount: false
})(FileUploadDropZone);

FileUploadDropZoneContainer = connect((state) => {
    const fileUploadState = state.get('fileUpload');
    return {
        fileMetadata: fileUploadState.get('fileMetadata')
    };
}, dispatch => {
    return {
        openDialog: () => dispatch(openDialog()),
        setAcceptedFileList: (acceptedFiles) => dispatch(setAcceptedFileList(acceptedFiles)),
        showSnackbar: (msg) => dispatch(showSnackbar(msg))
    };
})(FileUploadDropZoneContainer);

export default FileUploadDropZoneContainer;
