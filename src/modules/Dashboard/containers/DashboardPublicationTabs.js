import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DashboardPublicationTabs from '../components/DashboardPublicationTabs';
import * as actions from 'actions';

const mapStateToProps = (state) => {
    return {
        ...state.get('accountReducer'),
        ...state.get('myTrendingPublicationsReducer'),
        ...state.get('myLatestPublicationsReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

const DashboardPublicationTabsContainer = connect(mapStateToProps, mapDispatchToProps)(DashboardPublicationTabs);

export default DashboardPublicationTabsContainer;
