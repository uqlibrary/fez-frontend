import {connect} from 'react-redux';
import {reduxForm} from 'redux-form/immutable';

import AddRecord from '../components/AddRecord';

let AddRecordContainer = reduxForm({
    form: 'AddNewRecord'
})(AddRecord);

AddRecordContainer = connect(state => {
    return {
        selectedPublication: state.get('publicationTypes').get('selectedPublicationType')
    };
})(AddRecordContainer);

export default AddRecordContainer;
