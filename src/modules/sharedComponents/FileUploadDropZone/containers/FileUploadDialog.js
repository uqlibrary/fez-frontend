import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import FileUploadDialog from '../components/FileUploadDialog';
import {uploadFile} from '../actions';

let FileUploadDialogContainer = reduxForm({
    form: 'AddRecordForm'
})(FileUploadDialog);

FileUploadDialogContainer = connect(null, dispatch => {
    return {
        uploadFile: (file) => dispatch(uploadFile(file))
    };
})(FileUploadDialogContainer);

export default FileUploadDialogContainer;
