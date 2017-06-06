import {connect} from 'react-redux';

import {reduxForm, getFormValues} from 'redux-form/immutable';
import AddJournalArticleForm from '../components/AddJournalArticleForm';
import {loadPublicationSubTypesList, cancelAddRecord, loadAuthorsList, submitRecordForApproval} from '../actions';
import {decreaseStep} from '../../../AddRecord/actions';
import Immutable from 'immutable';


let AddJournalArticleFormContainer = reduxForm()(AddJournalArticleForm);

AddJournalArticleFormContainer = connect(state => {
    const publicationTypeState = state.get('publicationSubTypes');
    const fileUploadState = state.get('fileUpload');
    const authorsState = state.get('authors') || Immutable.Map({});

    return {
        authorList: publicationTypeState.get('authorList') || Immutable.Map({}),
        fileMetadata: fileUploadState.get('fileMetadata'),
        formValues: getFormValues('AddJournalArticleForm')(state) || Immutable.Map({}),
        publicationSubTypeList: publicationTypeState.get('publicationSubTypeList'),
        selectedPublicationId: state.get('publicationTypes').get('selectedPublicationType'),
        selectedAuthors: authorsState.get('selectedAuthors') || Immutable.Map({}),
    };
}, dispatch => {
    return {
        cancelAddRecord: (message) => dispatch(cancelAddRecord(message)),
        decreaseStep: () => dispatch(decreaseStep()),
        loadPublicationSubTypesList: (id) => dispatch(loadPublicationSubTypesList(id)),
        loadAuthorsList: () => dispatch(loadAuthorsList()),
        submitRecordForApproval: (data, message) => dispatch(submitRecordForApproval(data, message))
    };
})(AddJournalArticleFormContainer);

export default AddJournalArticleFormContainer;
