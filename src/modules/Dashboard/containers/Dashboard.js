import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Dashboard from '../components/Dashboard';
import * as actions from 'actions';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
    return {
        account: state.get('accountReducer').account,
        authorDetails: state.get('accountReducer').authorDetails,
        authorDetailsLoading: state.get('accountReducer').authorDetailsLoading,
        possiblyYourPublicationsCount: state.get('claimPublicationReducer').possibleCounts,
        ...state.get('academicStatsReducer'),
        ...state.get('appReducer'),
        ...state.get('publicationsReducer')
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

let DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(Dashboard);
DashboardContainer = withRouter(DashboardContainer);

export default DashboardContainer;
