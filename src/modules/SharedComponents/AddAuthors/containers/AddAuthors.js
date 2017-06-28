import {connect} from 'react-redux';
import {clearAuthorsSearchResults, clearIdentifiersSearchResults, searchForAuthors, searchFromIdentifiersField, updateAuthorsList} from '../actions';
import AddAuthors from '../components/AddAuthors';

const AddAuthorsContainer = connect((state) => {
    const authorsState = state.get('authors');
    return {
        authorsList: authorsState.get('authorsList'),
        authorsSearchResults: authorsState.get('authorsSearchResults'),
        identifiersSearchResults: authorsState.get('identifiersSearchResults')
    };
}, dispatch => {
    return {
        clearAuthorsSearchResults: () => dispatch(clearAuthorsSearchResults()),
        clearIdentifiersSearchResults: () => dispatch(clearIdentifiersSearchResults()),
        searchForAuthors: (querystring) => dispatch(searchForAuthors(querystring)),
        searchFromIdentifiersField: (querystring) => dispatch(searchFromIdentifiersField(querystring)),
        updateAuthorsList: (authorsList) => dispatch(updateAuthorsList(authorsList))
    };
})(AddAuthors);

export default AddAuthorsContainer;
