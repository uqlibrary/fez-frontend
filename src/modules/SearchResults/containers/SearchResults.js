import {reduxForm} from 'redux-form/immutable';
import SearchResults from '../components/SearchResults';

const SearchResultsContainer = reduxForm({
    form: 'SearchResultsForm'
})(SearchResults);

export default SearchResultsContainer;
