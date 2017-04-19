import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import AddJournalArticleForm from '../components/AddJournalArticleForm';
import {loadPublicationSubTypes} from '../actions';


let AddJournalArticleFormContainer = reduxForm({
    form: 'AddJournalArticleForm'
})(AddJournalArticleForm);

AddJournalArticleFormContainer = connect(state => {
    const publicationTypeState = state.get('publicationSubTypes');
    return {
        types: publicationTypeState.get('publicationSubTypes')
    };
}, dispatch => {
    return {
        loadPublicationSubTypes: () => dispatch(loadPublicationSubTypes())
    };
})(AddJournalArticleFormContainer);

export default AddJournalArticleFormContainer;
