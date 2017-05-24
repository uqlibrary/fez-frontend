import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import FileUploadDropZone from '../components/FileUploadDropZone';
import {openDialog, setAcceptedFileList} from '../actions';
import {showSnackbar} from '../../../App/actions';

let FileUploadDropZoneContainer = reduxForm({
    form: 'AddRecordForm'
})(FileUploadDropZone);

FileUploadDropZoneContainer = connect(null, dispatch => {
    return {
        openDialog: () => dispatch(openDialog()),
        setAcceptedFileList: (acceptedFiles) => dispatch(setAcceptedFileList(acceptedFiles)),
        showSnackbar: (msg) => dispatch(showSnackbar(msg))
    };
})(FileUploadDropZoneContainer);

export default FileUploadDropZoneContainer;
