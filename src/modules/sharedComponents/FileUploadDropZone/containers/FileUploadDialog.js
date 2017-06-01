import {connect} from 'react-redux';

import {reduxForm, getFormValues} from 'redux-form/immutable';
import FileUploadDialog from '../components/FileUploadDialog';
import {uploadFile, openDialog, closeDialog, decreaseStep, increaseStep, resetState, cancelUpload, updateFileMetadata} from '../actions';
import {showSnackbar} from '../../../App/actions';
import Immutable from 'immutable';

let FileUploadDialogContainer = reduxForm({
    destroyOnUnmount: false
})(FileUploadDialog);

FileUploadDialogContainer = connect((state, initialProps) => {
    const fileUploadState = state.get('fileUpload');
    return {
        isDialogOpen: fileUploadState.get('isDialogOpen'),
        formValues: getFormValues(initialProps.form)(state) || Immutable.Map({}),
        fileMetadata: fileUploadState.get('fileMetadata'),
        stepperIndex: fileUploadState.get('stepperIndex'),
        isUploadCompleted: fileUploadState.get('isUploadCompleted'),
        uploadError: fileUploadState.get('uploadError')
    };
}, dispatch => {
    return {
        uploadFile: (file) => dispatch(uploadFile(file)),
        openDialog: () => dispatch(openDialog()),
        cancelUpload: () => dispatch(cancelUpload()),
        closeDialog: () => dispatch(closeDialog()),
        increaseStep: () => dispatch(increaseStep()),
        decreaseStep: () => dispatch(decreaseStep()),
        updateFileMetadata: (data) => dispatch(updateFileMetadata(data)),
        resetState: () => dispatch(resetState()),
        showSnackbar: (msg) => dispatch(showSnackbar(msg))
    };
})(FileUploadDialogContainer);

export default FileUploadDialogContainer;
