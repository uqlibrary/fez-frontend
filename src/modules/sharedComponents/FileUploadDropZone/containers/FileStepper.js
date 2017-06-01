import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import FileStepper from '../components/FileStepper';
import {uploadFile, openDialog, closeDialog, loadDocumentAccessTypes} from '../actions';

let FileStepperContainer = reduxForm({
    destroyOnUnmount: false
})(FileStepper);

FileStepperContainer = connect((state) => {
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
})(FileStepperContainer);

export default FileStepperContainer;
