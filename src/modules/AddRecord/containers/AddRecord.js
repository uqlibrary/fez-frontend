import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import AddRecord from '../components/AddRecord';
import {decreaseStep, increaseStep, loadPublicationTypesList} from '../actions';

let AddRecordContainer = reduxForm({
    form: 'AddRecordForm'
})(AddRecord);

AddRecordContainer = connect((state) => {
    return {
        searchResultsList: state.get('publicationSearch').get('searchResultsList'),
        selectedPublicationType: state.get('publicationTypes').get('selectedPublicationType'),
        stepperIndex: state.get('addRecord').get('stepperIndex'),
        publicationTypeList: state.get('publicationTypes').get('publicationTypeList')
    };
}, dispatch => {
    return {
        loadPublicationTypesList: () => dispatch(loadPublicationTypesList()),
        increaseStep: () => dispatch(increaseStep()),
        decreaseStep: () => dispatch(decreaseStep())
    };
})(AddRecordContainer);

export default AddRecordContainer;
