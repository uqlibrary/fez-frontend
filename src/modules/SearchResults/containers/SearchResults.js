import { connect } from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import SearchResults from '../components/SearchResults';

let SearchResultsContainer = reduxForm({
    form: 'SearchResultsForm'
})(SearchResults);

SearchResultsContainer = connect((state) => {
    const searchResultsState = state.get('publicationSearch');
    return {
        searchResults: searchResultsState.get('searchResults')
    };
})(SearchResultsContainer);

export default SearchResultsContainer;
