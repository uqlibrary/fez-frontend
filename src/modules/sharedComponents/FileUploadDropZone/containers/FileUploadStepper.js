import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import FileUploadStepper from '../components/FileUploadStepper';
import {uploadFile, openDialog, closeDialog, loadDocumentAccessTypes} from '../actions';

let FileUploadStepperContainer = reduxForm({
    destroyOnUnmount: false
})(FileUploadStepper);

FileUploadStepperContainer = connect((state) => {
    const fileUploadSate = state.get('fileUpload');
    return {
        documentAccessTypes: fileUploadSate.get('documentAccessTypes').toJS(),
        stepperIndex: fileUploadSate.get('stepperIndex')
    };
}, dispatch => {
    return {
        uploadFile: (file) => dispatch(uploadFile(file)),
        openDialog: () => dispatch(openDialog()),
        closeDialog: () => dispatch(closeDialog()),
        loadDocumentAccessTypes: () => dispatch(loadDocumentAccessTypes())
    };
})(FileUploadStepperContainer);

export default FileUploadStepperContainer;
