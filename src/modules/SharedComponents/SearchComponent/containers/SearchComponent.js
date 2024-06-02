import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SearchComponent from '../components/SearchComponent';
import * as actions from 'actions';
import deparam from 'can-deparam';
import { withNavigate } from 'helpers/withNavigate';
import { locale } from '../../../../locale';

const defaultObj = {};
const allowedAdvancedSearchFields = Object.keys(locale.components.searchComponent.advancedSearch.fieldTypes);

/**
 * Filter out with labels only.
 *
 * @param object
 * @return {{}}
 */
const removeInvalidSearchQueryParams = searchQuery => ({
    ...searchQuery,
    searchQueryParams: Object.keys(searchQuery?.searchQueryParams || {}).reduce((validated, key) => {
        const term = searchQuery.searchQueryParams[key];
        // allow any params for non advanced searches,
        // otherwise make sure given fields have values and are allowed
        if (
            searchQuery.searchMode !== 'advanced' ||
            (term.hasOwnProperty('value') && allowedAdvancedSearchFields.includes(key))
        ) {
            validated[key] = term;
        }
        return validated;
    }, {}),
});

export const mapStateToProps = (state, ownProps) => {
    let searchQuery;
    try {
        searchQuery = removeInvalidSearchQueryParams(deparam(ownProps.location.search.substr(1)) || {});
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

const SearchComponentContainer = connect(mapStateToProps, mapDispatchToProps)(SearchComponent);
export default withNavigate()(SearchComponentContainer);
