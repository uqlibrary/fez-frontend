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
        authorList: publicationTypeState.get('authorList') || Immutable.Map({}),
        publicationSubTypeList: publicationTypeState.get('publicationSubTypeList')
    };
}, dispatch => {
    return {
        loadPublicationSubTypes: () => dispatch(loadPublicationSubTypes()),
        loadAuthorData: () => dispatch(loadAuthorData())
    };
})(AddJournalArticleFormContainer);

export default AddJournalArticleFormContainer;
