import {connect} from 'react-redux';

import {reduxForm, getFormValues} from 'redux-form/immutable';
import FileUploadDialog from '../components/FileUploadDialog';
import {uploadFile, openDialog, closeDialog, decreaseStep, increaseStep, resetState, cancelUpload, loadFileMetaData} from '../actions';
import {showSnackbar} from '../../../App/actions';
import Immutable from 'immutable';

let FileUploadDialogContainer = reduxForm({
    destroyOnUnmount: false
})(FileUploadDialog);

FileUploadDialogContainer = connect((state, initialProps) => {
    const fileUploadSate = state.get('fileUpload');
    return {
        isDialogOpen: fileUploadSate.get('isDialogOpen'),
        formValues: getFormValues(initialProps.form)(state) || Immutable.Map({}),
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
        loadFileMetaData: (data) => dispatch(loadFileMetaData(data)),
        resetState: () => dispatch(resetState()),
        showSnackbar: (msg) => dispatch(showSnackbar(msg))
    };
})(FileUploadDialogContainer);

export default FileUploadDialogContainer;
