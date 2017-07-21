import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import ClaimPublication from '../components/ClaimPublication';
import {loadUsersPublications, markPublicationsNotMine} from '../actions';
// import {clearSearchResults} from 'modules/Forms/PublicationSearch/actions';

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
        clearSearchResults: () => dispatch(()=>{}),
        loadUsersPublications: (username) => dispatch(loadUsersPublications(username)),
        markPublicationsNotMine: (username, pids) => dispatch(markPublicationsNotMine(username, pids))
    };
})(ClaimPublicationContainer);

export default ClaimPublicationContainer;
