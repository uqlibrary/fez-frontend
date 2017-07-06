import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import AddRecord from '../components/AddRecord';
import {decreaseStep, increaseStep, loadPublicationTypesList, resetStepper} from '../actions';

let AddRecordContainer = reduxForm({
    form: 'AddRecordForm'
})(AddRecord);

AddRecordContainer = connect((state) => {
    return {
        searchResultsList: state.get('publicationSearch') ? state.get('publicationSearch').get('searchResultsList') : {},
        loadingSearch: state.get('publicationSearch').get('loadingSearch'),
        selectedPublicationType: state.get('publicationTypes').get('selectedPublicationType'),
        stepperIndex: state.get('addRecord').get('stepperIndex'),
        publicationTypeList: state.get('publicationTypes').get('publicationTypeList')
    };
}, dispatch => {
    return {
        loadPublicationTypesList: () => dispatch(loadPublicationTypesList()),
        increaseStep: () => dispatch(increaseStep()),
        decreaseStep: () => dispatch(decreaseStep()),
        resetStepper: () => dispatch(resetStepper())
    };
})(AddRecordContainer);

export default AddRecordContainer;
