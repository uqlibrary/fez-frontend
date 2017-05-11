import {connect} from 'react-redux';
import {reduxForm} from 'redux-form/immutable';
import ClaimPublicationRow from '../components/ClaimPublicationRow';
import {clearSelectedPublication, loadSelectedPublication} from '../actions';

let ClaimPublicationRowFormContainer = reduxForm({
    destroyOnUnmount: false
})(ClaimPublicationRow);


ClaimPublicationRowFormContainer = connect(null, dispatch => {
    return {
        clearSelectedPublication: () => dispatch(clearSelectedPublication()),
        loadSelectedPublication: (id) => dispatch(loadSelectedPublication(id))
    };
})(ClaimPublicationRowFormContainer);

export default ClaimPublicationRowFormContainer;
