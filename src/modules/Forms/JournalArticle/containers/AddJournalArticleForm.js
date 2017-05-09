import {connect} from 'react-redux';

import {reduxForm, getFormValues} from 'redux-form/immutable';
import AddJournalArticleForm from '../components/AddJournalArticleForm';
import {loadPublicationSubTypesList, loadAuthorsList} from '../actions';
import Immutable from 'immutable';


let AddJournalArticleFormContainer = reduxForm({
    form: 'AddJournalArticleForm'
})(AddJournalArticleForm);

AddJournalArticleFormContainer = connect(state => {
    const publicationTypeState = state.get('publicationSubTypes');
    return {
        authorList: publicationTypeState.get('authorList') || Immutable.Map({}),
        publicationSubTypeList: publicationTypeState.get('publicationSubTypeList'),
        formValues: getFormValues('AddJournalArticleForm')(state) || Immutable.Map({}),
        selectedPublicationId: state.get('publicationTypes').get('selectedPublicationType')
    };
}, dispatch => {
    return {
        loadPublicationSubTypesList: (id) => dispatch(loadPublicationSubTypesList(id)),
        loadAuthorsList: () => dispatch(loadAuthorsList())
    };
})(AddJournalArticleFormContainer);

export default AddJournalArticleFormContainer;
