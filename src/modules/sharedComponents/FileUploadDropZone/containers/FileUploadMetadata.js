import {connect} from 'react-redux';

import {reduxForm, getFormValues} from 'redux-form/immutable';
import FileUploadMetadata from '../components/FileUploadMetadata';
import Immutable from 'immutable';

let FileUploadMetadataContainer = reduxForm({
    destroyOnUnmount: false
})(FileUploadMetadata);

FileUploadMetadataContainer = connect((state, initialProps) => {
    return {
        formValues: getFormValues(initialProps.form || 'AuthorForm')(state) || Immutable.Map({})
    };
})(FileUploadMetadataContainer);

export default FileUploadMetadataContainer;
