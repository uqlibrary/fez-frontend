import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import FileUploadStepper from '../components/FileUploadStepper';
import {uploadFile, openDialog, closeDialog} from '../actions';

let FileUploadStepperContainer = reduxForm({
    form: 'AddRecordForm'
})(FileUploadStepper);

FileUploadStepperContainer = connect((state) => {
    const fileUploadSate = state.get('fileUpload');
    return {
        stepperIndex: fileUploadSate.get('stepperIndex')
    };
}, dispatch => {
    return {
        uploadFile: (file) => dispatch(uploadFile(file)),
        openDialog: () => dispatch(openDialog()),
        closeDialog: () => dispatch(closeDialog())
    };
})(FileUploadStepperContainer);

export default FileUploadStepperContainer;
