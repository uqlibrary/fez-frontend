import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import FileUploadDialog from '../components/FileUploadDialog';
import {uploadFile, openDialog, closeDialog, decreaseStep, increaseStep, resetSteps, cancelUpload} from '../actions';
import {showSnackbar} from '../../../App/actions';

let FileUploadDialogContainer = reduxForm({
    form: 'AddRecordForm'
})(FileUploadDialog);

FileUploadDialogContainer = connect((state) => {
    const fileUploadSate = state.get('fileUpload');
    return {
        isDialogOpen: fileUploadSate.get('isDialogOpen'),
        stepperIndex: fileUploadSate.get('stepperIndex'),
        isUploadCompleted: fileUploadSate.get('isUploadCompleted')
    };
}, dispatch => {
    return {
        uploadFile: (file) => dispatch(uploadFile(file)),
        openDialog: () => dispatch(openDialog()),
        cancelUpload: () => dispatch(cancelUpload()),
        closeDialog: () => dispatch(closeDialog()),
        increaseStep: () => dispatch(increaseStep()),
        decreaseStep: () => dispatch(decreaseStep()),
        resetSteps: () => dispatch(resetSteps()),
        showSnackbar: (msg) => dispatch(showSnackbar(msg))
    };
})(FileUploadDialogContainer);

export default FileUploadDialogContainer;
