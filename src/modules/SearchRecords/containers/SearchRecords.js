import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SearchRecords from '../components/SearchRecords';
import * as actions from 'actions';
import { withRouter } from 'react-router-dom';
import { pathConfig } from 'config';

const mapStateToProps = (state, props) => ({
    ...state.get('searchRecordsReducer'),
    ...state.get('exportPublicationsReducer'),
    canUseExport: true,
    isUnpublishedBufferPage: props.location.pathname === pathConfig.admin.unpublished,
    isAdmin:
        !!state &&
        !!state.get('accountReducer') &&
        !!state.get('accountReducer').account &&
        state.get('accountReducer').account.canMasquerade,
});

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

let SearchRecordsContainer = connect(mapStateToProps, mapDispatchToProps)(SearchRecords);
SearchRecordsContainer = withRouter(SearchRecordsContainer);

export default SearchRecordsContainer;
