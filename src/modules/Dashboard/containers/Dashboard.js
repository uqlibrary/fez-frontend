import {connect} from 'react-redux';
import Dashboard from '../components/Dashboard';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (reduxStore) => {
    return {
        account: reduxStore.getIn(['app', 'account']),
        claimPublicationResults: {},
        authorDetailsLoading: reduxStore.get('authorDetailsReducer').authorDetailsLoading,
        authorDetails: reduxStore.get('authorDetailsReducer').authorDetails,
    };
};

let DashboardContainer = connect(mapStateToProps)(Dashboard);
DashboardContainer = withRouter(DashboardContainer);

export default DashboardContainer;
