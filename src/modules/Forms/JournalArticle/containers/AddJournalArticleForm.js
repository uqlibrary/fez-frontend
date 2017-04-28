import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import AddJournalArticleForm from '../components/AddJournalArticleForm';
import {loadPublicationSubTypes, loadAuthorData} from '../actions';
import Immutable from 'immutable';


let AddJournalArticleFormContainer = reduxForm({
    form: 'AddJournalArticleForm'
})(AddJournalArticleForm);

AddJournalArticleFormContainer = connect(state => {
    const publicationTypeState = state.get('publicationSubTypes');
    return {
        listOfAuthors: publicationTypeState.get('listOfAuthors') || Immutable.Map({}),
        types: publicationTypeState.get('publicationSubTypes')
    };
}, dispatch => {
    return {
        loadPublicationSubTypes: () => dispatch(loadPublicationSubTypes()),
        loadAuthorData: () => dispatch(loadAuthorData())
    };
})(AddJournalArticleFormContainer);

export default AddJournalArticleFormContainer;
