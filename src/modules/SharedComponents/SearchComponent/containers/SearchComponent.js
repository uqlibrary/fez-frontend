import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import SearchComponent from '../components/SearchComponent';
import * as actions from 'actions';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
    const isAdvancedSearch = !!state.get('searchRecordsReducer').searchQuery &&
        !!state.get('searchRecordsReducer').searchQuery.searchMode &&
        state.get('searchRecordsReducer').searchQuery.searchMode === 'advanced';

    return {
        searchQueryParams: state && state.get('searchRecordsReducer') && state.get('searchRecordsReducer').searchQuery
            && state.get('searchRecordsReducer').searchQuery.searchQueryParams || {},
        isAdvancedSearch: isAdvancedSearch,
        isAdvancedSearchMinimised: isAdvancedSearch,
        isOpenAccessInAdvancedMode: isAdvancedSearch && !!state.get('searchRecordsReducer').searchQuery.activeFacets.showOpenAccessOnly,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

let SearchComponentContainer = connect(mapStateToProps, mapDispatchToProps)(SearchComponent);
SearchComponentContainer = withRouter(SearchComponentContainer);
export default SearchComponentContainer;
