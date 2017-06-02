import {connect} from 'react-redux';

import {reduxForm, getFormValues} from 'redux-form/immutable';
import Authors from '../components/Authors';
import Immutable from 'immutable';
import {removeAuthor, addAuthor, clearAuthors} from '../actions';


let AuthorsContainer = reduxForm({
    destroyOnUnmount: false
})(Authors);

AuthorsContainer = connect((state, initialProps) => {
    const listOfAuthorsState = state.get('authors') || Immutable.Map({});
    return {
        selectedAuthors: listOfAuthorsState.get('selectedAuthors') || Immutable.Map({}),
        formValues: getFormValues(initialProps.form || 'AuthorForm')(state) || Immutable.Map({})
    };
}, dispatch => {
    return {
        removeAuthor: author => dispatch(removeAuthor(author)),
        addAuthor: author => dispatch(addAuthor(author)),
        clearAuthors: () => dispatch(clearAuthors())
    };
})(AuthorsContainer);

export default AuthorsContainer;
