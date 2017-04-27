import {connect} from 'react-redux';
import AddRecord from '../components/AddRecord';
import {reduxForm} from 'redux-form/immutable';

let AddRecordContainer = reduxForm({
    form: 'AddNewRecord'
})(AddRecord);

AddRecordContainer = connect(state => {
    return {
        selectedPublication: state.get('publicationTypes').get('selectedPublicationType')
    };
})(AddRecordContainer);

export default AddRecordContainer;
