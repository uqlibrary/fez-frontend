import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import UploadedFileMetadata from '../components/UploadedFileMetadata';

let UploadedFileMetadataContainer = reduxForm({
    destroyOnUnmount: false
})(UploadedFileMetadata);

UploadedFileMetadataContainer = connect((state) => {
    const fileUploadSate = state.get('fileUpload');
    return {
        documentAccessTypes: fileUploadSate.get('documentAccessTypes')
    };
})(UploadedFileMetadataContainer);

export default UploadedFileMetadataContainer;
