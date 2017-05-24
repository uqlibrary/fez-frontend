import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import FileUploadSummary from '../components/FileUploadSummary';
import {uploadFile, openDialog, closeDialog} from '../actions';

let FileUploadSummaryContainer = reduxForm({
    form: 'AddRecordForm'
})(FileUploadSummary);

FileUploadSummaryContainer = connect((state) => {
    const fileUploadSate = state.get('fileUpload');
    return {
        uploadProgress: fileUploadSate.get('progress'),
        stepperIndex: fileUploadSate.get('stepperIndex')
    };
}, dispatch => {
    return {
        uploadFile: (file) => dispatch(uploadFile(file)),
        openDialog: () => dispatch(openDialog()),
        closeDialog: () => dispatch(closeDialog())
    };
})(FileUploadSummaryContainer);

export default FileUploadSummaryContainer;
