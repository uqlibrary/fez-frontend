import {connect} from 'react-redux';

import {reduxForm, getFormValues} from 'redux-form/immutable';
import AddJournalArticleForm from '../components/AddJournalArticleForm';
import {
    loadPublicationSubTypesList,
    cancelAddRecord,
    loadAuthorsList,
    resetFormSubmissionFlag,
    submitRecordForApproval
} from '../actions';
import {uploadFile} from '../../../SharedComponents/FileUploader/actions';
import {decreaseStep} from '../../../AddRecord/actions';
import Immutable from 'immutable';
import {showSnackbar} from 'modules/App/actions';


const scrollToElement = require('scrollto-element');

let AddJournalArticleFormContainer = reduxForm({
    onSubmitFail: (result) => {
        if (result) {
            const target = Object.keys(result);
            // scroll to the first erroneous field
            scrollToElement(document.getElementsByName(target[0])[0], 800);
        }
    }
})(AddJournalArticleForm);

AddJournalArticleFormContainer = connect(state => {
    const journalArticleState = state.get('journalArticle');
    const fileUploadState = state.get('fileUpload');
    const authorsState = state.get('authors') || Immutable.Map({});

    return {
        acceptedFiles: fileUploadState.get('acceptedFiles'),
        authorList: journalArticleState.get('authorList') || Immutable.Map({}),
        formValues: getFormValues('AddJournalArticleForm')(state) || Immutable.Map({}),
        hasOpenAccess: fileUploadState.get('hasOpenAccess'),
        isOpenAccessAccepted: fileUploadState.get('isOpenAccessAccepted'),
        isUploadCompleted: fileUploadState.get('isUploadCompleted'),
        publicationSubTypeList: journalArticleState.get('publicationSubTypeList'),
        selectedPublicationId: state.get('publicationTypes').get('selectedPublicationType'),
        selectedAuthors: authorsState.get('selectedAuthors') || Immutable.Map({})
    };
}, dispatch => {
    return {
        cancelAddRecord: (message) => dispatch(cancelAddRecord(message)),
        decreaseStep: () => dispatch(decreaseStep()),
        loadPublicationSubTypesList: (id) => dispatch(loadPublicationSubTypesList(id)),
        loadAuthorsList: () => dispatch(loadAuthorsList()),
        resetFormSubmissionFlag: () => dispatch(resetFormSubmissionFlag()),
        showSnackbar: (msg) => dispatch(showSnackbar(msg)),
        submitRecordForApproval: (data, message) => dispatch(submitRecordForApproval(data, message)),
        uploadFile: (acceptedFiles) => dispatch(uploadFile(acceptedFiles))
    };
})(AddJournalArticleFormContainer);

export default AddJournalArticleFormContainer;
