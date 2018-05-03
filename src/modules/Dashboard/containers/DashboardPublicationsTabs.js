import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DashboardPublicationsTabs from '../components/DashboardPublicationsTabs';
import * as actions from 'actions';

const mapStateToProps = (state) => {
    return {
        ...state.get('myTrendingPublicationsReducer'),
        ...state.get('myLatestPublicationsReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

const DashboardPublicationTabsContainer = connect(mapStateToProps, mapDispatchToProps)(DashboardPublicationsTabs);

export default DashboardPublicationTabsContainer;
