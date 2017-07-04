import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import ClaimPublication from '../components/ClaimPublication';
import {loadUsersPublications, markPublicationsNotMine} from '../actions';

let ClaimPublicationContainer = reduxForm({
    form: 'ClaimPublicationResultsForm'
})(ClaimPublication);

ClaimPublicationContainer = connect((state) => {
    const appState = state.get('app');
    const claimPublications = state.get('claimPublication');
    return {
        account: appState.get('account'),
        loadingSearch: claimPublications.get('loadingSearch'),
        claimPublicationResults: claimPublications.get('claimPublicationResults')
    };
}, dispatch => {
    return {
        loadUsersPublications: (userId) => dispatch(loadUsersPublications(userId)),
        markPublicationsNotMine: () => dispatch(markPublicationsNotMine())
    };
})(ClaimPublicationContainer);

export default ClaimPublicationContainer;
