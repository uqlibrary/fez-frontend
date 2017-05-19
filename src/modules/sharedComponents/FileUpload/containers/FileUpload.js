import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import FileUpload from '../components/FileUpload';
import {uploadFile} from '../actions';

let FileUploadContainer = reduxForm({
    form: 'AddRecordForm'
})(FileUpload);

FileUploadContainer = connect(null, dispatch => {
    return {
        uploadFile: (file) => dispatch(uploadFile(file))
    };
})(FileUploadContainer);

export default FileUploadContainer;
