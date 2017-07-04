import {connect} from 'react-redux';
import {clearAuthorsList, clearAuthorsSearchResults, clearIdentifiersSearchResults, searchFromAuthorsField, searchFromIdentifiersField, updateAuthorsList} from '../actions';
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
        clearAuthorsList: () => dispatch(clearAuthorsList()),
        clearAuthorsSearchResults: () => dispatch(clearAuthorsSearchResults()),
        clearIdentifiersSearchResults: () => dispatch(clearIdentifiersSearchResults()),
        searchFromAuthorsField: (querystring) => dispatch(searchFromAuthorsField(querystring)),
        searchFromIdentifiersField: (querystring) => dispatch(searchFromIdentifiersField(querystring)),
        updateAuthorsList: (authorsList) => dispatch(updateAuthorsList(authorsList))
    };
})(AddAuthors);

export default AddAuthorsContainer;
