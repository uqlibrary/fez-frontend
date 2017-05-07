import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import AddRecord from '../components/AddRecord';
import {loadPublicationTypesList, cancelAddRecord, saveForLater, submitRecord} from '../actions';

let AddRecordContainer = reduxForm({
    form: 'AddRecordForm'
})(AddRecord);

AddRecordContainer = connect((state) => {
    return {
        searchResultsList: state.get('publicationSearch').get('searchResultsList'),
        selectedPublicationType: state.get('publicationTypes').get('selectedPublicationType'),
        publicationTypeList: state.get('publicationTypes').get('publicationTypeList')
    };
}, dispatch => {
    return {
        loadPublicationTypesList: () => dispatch(loadPublicationTypesList()),
        cancelAddRecord: (message) => dispatch(cancelAddRecord(message)),
        saveForLater: (message) => dispatch(saveForLater(message)),
        submitRecord: (message) => dispatch(submitRecord(message))
    };
})(AddRecordContainer);

export default AddRecordContainer;
