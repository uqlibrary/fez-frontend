import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import ClaimPublicationForm from '../components/ClaimPublicationForm';
import {claimThisPublication, cancelThisPublicationClaim} from '../actions';


let ClaimPublicationFormContainer = reduxForm({
    form: 'ClaimPublicationForm'
})(ClaimPublicationForm);

ClaimPublicationFormContainer = connect(null, dispatch => {
    return {
        cancelThisPublicationClaim: (message) => dispatch(cancelThisPublicationClaim(message)),
        claimThisPublication: (message) => dispatch(claimThisPublication(message))
    };
})(ClaimPublicationFormContainer);

export default ClaimPublicationFormContainer;
