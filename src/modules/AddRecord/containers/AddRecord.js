import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import AddRecord from '../components/AddRecord';
import {loadPublicationTypesList} from '../actions';
import {hideSnackbar, showSnackbar} from '../../App/actions';

let AddRecordContainer = reduxForm({
    form: 'AddRecordForm'
})(AddRecord);

AddRecordContainer = connect((state) => {
    return {
        searchResultsList: state.get('publicationSearch').get('searchResultsList'),
        selectedPublicationType: state.get('publicationTypes').get('selectedPublicationType'),
        publicationTypeList: state.get('publicationTypes').get('publicationTypeList'),
        snackbar: state.get('app').get('snackbar')
    };
}, dispatch => {
    return {
        loadPublicationTypesList: () => dispatch(loadPublicationTypesList()),
        hideSnackbar: () => dispatch(hideSnackbar()),
        showSnackbar: (message) => dispatch(showSnackbar(message))
    };
})(AddRecordContainer);

export default AddRecordContainer;
