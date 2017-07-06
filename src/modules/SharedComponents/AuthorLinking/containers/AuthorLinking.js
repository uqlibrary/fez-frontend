import {connect} from 'react-redux';
import AuthorLinking from '../components/AuthorLinking';
import {setSelectedAuthor, resetSelectedAuthor} from '../actions';

const AuthorLinkingContainer = connect((state) => {
    const appState = state.get('app');
    return {
        account: appState.get('account')
    };
}, dispatch => {
    return {
        resetSelectedAuthor: () => dispatch(resetSelectedAuthor()),
        setSelectedAuthor: (authorId) => dispatch(setSelectedAuthor(authorId))
    };
})(AuthorLinking);

export default AuthorLinkingContainer;
