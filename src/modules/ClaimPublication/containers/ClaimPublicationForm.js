import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import ClaimPublicationForm from '../components/ClaimPublicationForm';


let ClaimPublicationFormContainer = reduxForm({
    form: 'ClaimPublicationForm'
})(ClaimPublicationForm);

ClaimPublicationFormContainer = connect((state) => {
    const claimPublication = state.get('claimPublication');
    return {
        claimPublicationResults: claimPublication.get('claimPublicationResults'),
        selectedPublication: claimPublication.get('selectedPublication')
    };
})(ClaimPublicationFormContainer);

export default ClaimPublicationFormContainer;
