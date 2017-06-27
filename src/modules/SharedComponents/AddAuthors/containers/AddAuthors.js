import {connect} from 'react-redux';
import {updateAuthorsList} from '../actions';
import AddAuthors from '../components/AddAuthors';

const AddAuthorsContainer = connect((state) => {
    const authorsState = state.get('authors');
    return {
        authorsList: authorsState.get('authorsList')
    };
}, dispatch => {
    return {
        updateAuthorsList: (authorsList) => dispatch(updateAuthorsList(authorsList))
    };
})(AddAuthors);

export default AddAuthorsContainer;
