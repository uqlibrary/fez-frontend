import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Dashboard from '../components/Dashboard';

let DashboardPage = connect(state => {
    return {
        account: state.getIn(['app', 'account'])
    };
}
)(Dashboard);

// Add router
DashboardPage = withRouter(DashboardPage);

export default DashboardPage;
