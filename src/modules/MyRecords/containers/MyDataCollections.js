import { connect } from 'react-redux';
import { locale } from 'locale';
import { general } from 'config';
import MyRecords from '../components/MyRecords';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';
import { pathConfig } from 'config';
import { withNavigate } from 'helpers/withNavigate';

const mapStateToProps = state => {
    return {
        authorDetails: state.get('accountReducer').authorDetails || {},
        accountLoading: state.get('accountReducer').accountLoading,
        ...state.get('publicationsReducer').datasets,
        ...state.get('exportPublicationsReducer'),
        initialFacets: {
            filters: { 'Display type': general.PUBLICATION_TYPE_DATA_COLLECTION },
        },
        localePages: locale.pages.myDatasets,
        thisUrl: pathConfig.dataset.mine,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            ...bindActionCreators(actions, dispatch),
            loadAuthorPublications: state => dispatch(actions.searchAuthorPublications(state, 'datasets')),
        },
    };
}

const ResearchContainer = connect(mapStateToProps, mapDispatchToProps)(MyRecords);
export default withNavigate()(ResearchContainer);
