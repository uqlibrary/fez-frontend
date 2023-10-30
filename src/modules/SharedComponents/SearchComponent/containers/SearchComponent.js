import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SearchComponent from '../components/SearchComponent';
import * as actions from 'actions';
import { withRouter } from 'react-router-dom';
import deparam from 'can-deparam';

const defaultObj = {};

export const mapStateToProps = (state, ownProps) => {
    let searchQuery;
    try {
        searchQuery = deparam(ownProps.location.search.substr(1)) || {};
    } catch (e) {
        searchQuery = {};
    }
    const { publicationsList } =
        (!!state && !!state.get('searchRecordsReducer') && state.get('searchRecordsReducer')) || {};
    const isAdvancedSearch =
        (!!searchQuery && !!searchQuery.searchMode && searchQuery.searchMode === 'advanced') ||
        ownProps.isAdvancedSearch;
    const isCommunityCollection = !!searchQuery && !!searchQuery.commColl && searchQuery.commColl === 'true';
    const isAdvancedSearchMinimised =
        isAdvancedSearch && publicationsList && publicationsList.length > 0 && !!!isCommunityCollection;

    return {
        ...state.get('accountReducer'),
        searchQueryParams: (!!searchQuery && searchQuery.searchQueryParams) || defaultObj,
        isAdvancedSearch: isAdvancedSearch,
        isAdvancedSearchMinimised: isAdvancedSearchMinimised,
        isAdmin: ownProps.isAdmin || false,
        // isMobile: ownProps.isMobile || false,
        isUnpublishedBufferPage: ownProps.isUnpublishedBufferPage || false,
        isOpenAccessInAdvancedMode:
            isAdvancedSearch &&
            !!searchQuery &&
            !!searchQuery.activeFacets &&
            !!searchQuery.activeFacets.showOpenAccessOnly &&
            searchQuery.activeFacets.showOpenAccessOnly === 'true',
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

let SearchComponentContainer = connect(mapStateToProps, mapDispatchToProps)(SearchComponent);
SearchComponentContainer = withRouter(SearchComponentContainer);
export default SearchComponentContainer;
