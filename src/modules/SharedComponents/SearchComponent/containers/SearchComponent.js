import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import SearchComponent from '../components/SearchComponent';
import * as actions from 'actions';
import {withRouter} from 'react-router-dom';
import deparam from 'can-deparam';

const mapStateToProps = (state, ownProps) => {
    const searchQuery = deparam(ownProps.location.search.substr(1)) || {};
    const isAdmin = !!state && !!state.get('accountReducer') && !!state.get('accountReducer').account && state.get('accountReducer').account.canMasquerade;

    const {publicationsList} = !!state && !!state.get('searchRecordsReducer') && state.get('searchRecordsReducer') || {};

    const isAdvancedSearch = !!searchQuery && !!searchQuery.searchMode && searchQuery.searchMode === 'advanced' || ownProps.isAdvancedSearch;
    const isAdvancedSearchMinimised = isAdvancedSearch && publicationsList.length > 0;

    return {
        searchQueryParams: !!searchQuery && searchQuery.searchQueryParams || {},
        isAdvancedSearch: isAdvancedSearch,
        isAdvancedSearchMinimised: isAdvancedSearchMinimised,
        isAdmin: isAdmin,
        isOpenAccessInAdvancedMode: (
            isAdvancedSearch
            && !!searchQuery
            && !!searchQuery.activeFacets
            && !!searchQuery.activeFacets.showOpenAccessOnly
            && searchQuery.activeFacets.showOpenAccessOnly === 'true'
        )
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
