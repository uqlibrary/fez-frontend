import { connect } from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import AddRecord from '../components/AddRecord';

let AddRecordContainer = reduxForm({
    form: 'AddRecordForm'
})(AddRecord);

AddRecordContainer = connect((state) => {
    const searchResultsState = state.get('publicationSearch');
    return {
        searchResults: searchResultsState.get('searchResults')
    };
})(AddRecordContainer);

export default AddRecordContainer;
