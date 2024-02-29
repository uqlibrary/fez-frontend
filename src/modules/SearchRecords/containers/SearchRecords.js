import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SearchRecords from '../components/SearchRecords';
import * as actions from 'actions';
import { pathConfig } from 'config';
import { withNavigate } from 'helpers/withNavigate';

const mapStateToProps = (state, props) => ({
    ...state.get('searchRecordsReducer'),
    ...state.get('exportPublicationsReducer'),
    ...state.get('accountReducer'),
    canUseExport: true,
    isUnpublishedBufferPage: props.location.pathname === pathConfig.admin.unpublished,
});

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const SearchRecordsContainer = connect(mapStateToProps, mapDispatchToProps)(SearchRecords);

export default withNavigate()(SearchRecordsContainer);
