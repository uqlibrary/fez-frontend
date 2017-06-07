import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import UploadDialog from '../components/UploadDialog';

let UploadDialogContainer = reduxForm({
    destroyOnUnmount: false
})(UploadDialog);

UploadDialogContainer = connect((state) => {
    const fileUploadState = state.get('fileUpload');
    return {
        isDialogOpen: fileUploadState.get('isDialogOpen'),
        page: fileUploadState.get('page')
    };
})(UploadDialogContainer);

export default UploadDialogContainer;
