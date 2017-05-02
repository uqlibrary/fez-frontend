import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import AddRecord from '../components/AddRecord';

let AddRecordContainer = reduxForm({
    form: 'AddRecordForm'
})(AddRecord);

AddRecordContainer = connect((state) => {
    return {
        searchResultsList: state.get('publicationSearch').get('searchResultsList'),
        selectedPublication: state.get('publicationTypes').get('selectedPublicationType')
    };
})(AddRecordContainer);

export default AddRecordContainer;
