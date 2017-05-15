import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import ClaimPublicationForm from '../components/ClaimPublicationForm';
import {showSnackbar} from '../../../App';


let ClaimPublicationFormContainer = reduxForm({
    form: 'ClaimPublicationForm'
})(ClaimPublicationForm);

ClaimPublicationFormContainer = connect((state) => {
    const claimPublication = state.get('claimPublication');
    return {
        searchResultsList: claimPublication.get('claimPublicationResults'),
        selectedPublication: claimPublication.get('selectedPublication')
    };
}, dispatch => {
    return {
        showSnackbar: (message) => dispatch(showSnackbar(message))
    };
})(ClaimPublicationFormContainer);

export default ClaimPublicationFormContainer;
