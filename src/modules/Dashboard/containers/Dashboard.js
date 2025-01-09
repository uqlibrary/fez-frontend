import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dashboard from '../components/Dashboard';
import * as actions from 'actions';

const mapStateToProps = state => {
    const { loadingLatestPublications, latestPublicationsList } = state.get('myLatestPublicationsReducer');
    const { loadingTrendingPublications, trendingPublicationsList } = state.get('myTrendingPublicationsReducer');
    const { possibleCounts, loadingPossibleCounts } = state.get('claimPublicationReducer');
    const account = state.get('accountReducer');

    const ret = {
        ...account,
        ...state.get('academicStatsReducer'),
        ...state.get('appReducer'),
        ...state.get('publicationsReducer'),
        ...state.get('orcidSyncReducer'),
        showLatestPublicationsTab: loadingLatestPublications || latestPublicationsList.length > 0,
        showTrendingPublicationsTab: loadingTrendingPublications || trendingPublicationsList.length > 0,
        orcidSyncEnabled:
            !!account.author &&
            !!account.author.aut_is_orcid_sync_enabled &&
            account.authorDetails &&
            account.authorDetails.espace.doc_count > 0,
        possiblyYourPublicationsCount: possibleCounts,
        possiblyYourPublicationsCountLoading: loadingPossibleCounts,
    };

    console.log('ret=', ret);
    ret.publicationTypesCount = null; // []
    // ret.publicationsByYear = null; // { "series": [], "categories": [] }
    ret.publicationsByYear = { series: null, categories: [] };
    return ret;
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(Dashboard);

export default DashboardContainer;
