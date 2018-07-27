import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import SearchComponent from '../components/SearchComponent';
import * as actions from 'actions';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
    const {searchQuery, publicationsList} = !!state && !!state.get('searchRecordsReducer') && state.get('searchRecordsReducer') || {};

    const isAdvancedSearch = !!searchQuery && !!searchQuery.searchMode && searchQuery.searchMode === 'advanced';
    const isAdvancedSearchMinimised = isAdvancedSearch && publicationsList.length > 0;

    return {
        searchQueryParams: !!searchQuery && searchQuery.searchQueryParams || {},
        isAdvancedSearch: isAdvancedSearch,
        isAdvancedSearchMinimised: isAdvancedSearchMinimised,
        isOpenAccessInAdvancedMode: isAdvancedSearch && !!searchQuery && !!searchQuery.activeFacets.showOpenAccessOnly,
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
