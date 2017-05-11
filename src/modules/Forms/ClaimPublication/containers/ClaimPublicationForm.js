import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import ClaimPublicationForm from '../components/ClaimPublicationForm';
import {claimThisPublication, claimThisPublicationCancelled} from '../actions';


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
        claimThisPublicationCancelled: (message) => dispatch(claimThisPublicationCancelled(message)),
        claimThisPublication: (message) => dispatch(claimThisPublication(message))
    };
})(ClaimPublicationFormContainer);

export default ClaimPublicationFormContainer;
