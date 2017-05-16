import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Dashboard from '../components/Dashboard';
import {loadUsersPublications} from 'modules/ClaimPublication/actions';

let DashboardPage = connect(state => {
    return {
        account: state.getIn(['app', 'account']),
        claimPublicationResults: state.get('claimPublication').get('claimPublicationResults')
    };
}, dispatch => {
    return {
        loadUsersPublications: (userId) => dispatch(loadUsersPublications(userId))
    };
})(Dashboard);

// Add router
DashboardPage = withRouter(DashboardPage);

export default DashboardPage;
