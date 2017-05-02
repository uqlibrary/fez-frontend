import { connect } from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import SearchResults from '../components/SearchResults';

let SearchResultsContainer = reduxForm({
    form: 'SearchResultsForm'
})(SearchResults);

SearchResultsContainer = connect((state) => {
    const searchResultsState = state.get('publicationSearch');
    return {
        searchResultsList: searchResultsState.get('searchResultsList')
    };
})(SearchResultsContainer);

export default SearchResultsContainer;
