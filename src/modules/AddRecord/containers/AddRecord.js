import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import AddRecord from '../components/AddRecord';
import {loadPublicationTypesList} from '../actions';

let AddRecordContainer = reduxForm({
    form: 'AddRecordForm'
})(AddRecord);

AddRecordContainer = connect((state) => {
    return {
        searchResultsList: state.get('claimPublication').get('claimPublicationResults'),
        selectedPublicationType: state.get('publicationTypes').get('selectedPublicationType'),
        publicationTypeList: state.get('publicationTypes').get('publicationTypeList')
    };
}, dispatch => {
    return {
        loadPublicationTypesList: () => dispatch(loadPublicationTypesList())
    };
})(AddRecordContainer);

export default AddRecordContainer;
