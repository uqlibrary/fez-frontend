import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SearchRecords from '../components/SearchRecords';
import * as actions from 'actions';

const mapStateToProps = state => ({
    ...state.get('searchRecordsReducer'),
    ...state.get('exportPublicationsReducer'),
    ...state.get('accountReducer'),
    canUseExport: true,
});

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const SearchRecordsContainer = connect(mapStateToProps, mapDispatchToProps)(SearchRecords);

export default SearchRecordsContainer;
