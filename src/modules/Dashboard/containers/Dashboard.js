import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Dashboard from '../components/Dashboard';
import * as actions from 'actions';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
    return {
        ...state.get('accountReducer'),
        ...state.get('academicStatsReducer'),
        ...state.get('appReducer'),
        ...state.get('publicationsReducer'),
        possiblyYourPublicationsCount: state.get('claimPublicationReducer').possibleCounts
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
