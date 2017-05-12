import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import ClaimPublication from '../components/ClaimPublication';
import {loadUsersPublications} from '../actions';

let ClaimPublicationContainer = reduxForm({
    form: 'ClaimPublicationResultsForm'
})(ClaimPublication);

ClaimPublicationContainer = connect((state) => {
    return {
        searchResultsList: state.get('claimPublication').get('claimPublicationResults')
    };
}, dispatch => {
    return {
        loadUsersPublications: (userId) => dispatch(loadUsersPublications(userId))
    };
})(ClaimPublicationContainer);

export default ClaimPublicationContainer;
