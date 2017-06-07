import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import {deleteFile} from '../actions';
import UploadedFileMetadata from '../components/UploadedFileMetadata';

let UploadedFileMetadataContainer = reduxForm({
    destroyOnUnmount: false
})(UploadedFileMetadata);

UploadedFileMetadataContainer = connect((state) => {
    const fileUploadSate = state.get('fileUpload');
    return {
        documentAccessTypes: fileUploadSate.get('documentAccessTypes')
    };
}, dispatch => {
    return {
        deleteFile: (filename) => dispatch(deleteFile(filename))
    };
})(UploadedFileMetadataContainer);

export default UploadedFileMetadataContainer;
