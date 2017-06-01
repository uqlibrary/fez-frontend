import {connect} from 'react-redux';

import {reduxForm, getFormValues} from 'redux-form/immutable';
import Confirmation from '../components/Confirmation';
import {cancelUpload, closeDialog, decreaseStep, increaseStep, updateFileMetadata, uploadFile} from '../actions';
import {showSnackbar} from 'modules/App/actions';
import Immutable from 'immutable';

let ConfirmationContainer = reduxForm({
    destroyOnUnmount: false
})(Confirmation);

ConfirmationContainer = connect((state, initialProps) => {
    const fileUploadState = state.get('fileUpload');
    return {
        fileMetadata: fileUploadState.get('fileMetadata'),
        formValues: getFormValues(initialProps.form)(state) || Immutable.Map({}),
        isUploadCompleted: fileUploadState.get('isUploadCompleted'),
        stepperIndex: fileUploadState.get('stepperIndex'),
        uploadError: fileUploadState.get('uploadError'),
        uploadProgress: fileUploadState.get('progress')
    };
}, dispatch => {
    return {
        cancelUpload: () => dispatch(cancelUpload()),
        closeDialog: () => dispatch(closeDialog()),
        decreaseStep: () => dispatch(decreaseStep()),
        increaseStep: () => dispatch(increaseStep()),
        showSnackbar: (msg) => dispatch(showSnackbar(msg)),
        updateFileMetadata: (data) => dispatch(updateFileMetadata(data)),
        uploadFile: (files) => dispatch(uploadFile(files))
    };
})(ConfirmationContainer);

export default ConfirmationContainer;
