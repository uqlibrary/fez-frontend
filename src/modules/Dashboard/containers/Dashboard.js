import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Dashboard from '../components/Dashboard';
import * as actions from 'actions';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
    const {loadingLatestPublications, latestPublicationsList} = state.get('myLatestPublicationsReducer');
    const {loadingTrendingPublications, trendingPublicationsList} = state.get('myTrendingPublicationsReducer');
    const {possibleCounts, loadingPossibleCounts} = state.get('claimPublicationReducer');

    const loadingIncompleteRecordData = state.get('publicationsReducer').loadingPublicationsList &&
        state.get('publicationsReducer').publicationsListType === 'incomplete';

    const incompleteRecordList = (state.get('publicationsReducer').publicationsListType === 'incomplete') &&
        state.get('publicationsReducer').publicationsList || [];

    return {
        ...state.get('accountReducer'),
        ...state.get('academicStatsReducer'),
        ...state.get('appReducer'),
        incompleteRecordList,
        loadingIncompleteRecordData,
        showLatestPublicationsTab: loadingLatestPublications || latestPublicationsList.length > 0,
        showTrendingPublicationsTab: loadingTrendingPublications || trendingPublicationsList.length > 0,
        possiblyYourPublicationsCount: possibleCounts,
        possiblyYourPublicationsCountLoading: loadingPossibleCounts,
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
