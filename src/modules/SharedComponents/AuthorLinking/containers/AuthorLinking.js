import {connect} from 'react-redux';
import AuthorLinking from '../components/AuthorLinking';
import {setSelectedAuthor, resetSelectedAuthor} from '../actions';

const AuthorLinkingContainer = connect((state) => {
    const appState = state.get('app');
    const authorLinking = state.get('authorLinking');
    return {
        account: appState.get('account'),
        selectedAuthorId: authorLinking.get('selectedAuthor')
    };
}, dispatch => {
    return {
        resetSelectedAuthor: () => dispatch(resetSelectedAuthor()),
        setSelectedAuthor: (authorId) => dispatch(setSelectedAuthor(authorId))
    };
})(AuthorLinking);

export default AuthorLinkingContainer;
