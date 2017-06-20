import {connect} from 'react-redux';

import {reduxForm, getFormValues} from 'redux-form/immutable';
import AddJournalArticleForm from '../components/AddJournalArticleForm';
import {loadPublicationSubTypesList, cancelAddRecord, loadAuthorsList, submitRecordForApproval} from '../actions';
import {uploadFile} from '../../../SharedComponents/FileUploader/actions';
import Immutable from 'immutable';

const scrollToElement = require('scrollto-element');

let AddJournalArticleFormContainer = reduxForm({
    onSubmitFail: (result) => {
        const target = Object.keys(result);
        // scroll to the first erroneous field
        scrollToElement(document.getElementsByName(target[0])[0], 800);
    }
})(AddJournalArticleForm);

AddJournalArticleFormContainer = connect(state => {
    const publicationTypeState = state.get('publicationSubTypes');
    const fileUploadState = state.get('fileUpload');
    const authorsState = state.get('authors') || Immutable.Map({});

    return {
        acceptedFiles: fileUploadState.get('acceptedFiles'),
        authorList: publicationTypeState.get('authorList') || Immutable.Map({}),
        formValues: getFormValues('AddJournalArticleForm')(state) || Immutable.Map({}),
        isOpenAccessAccepted: fileUploadState.get('isOpenAccessAccepted'),
        isUploadCompleted: fileUploadState.get('isUploadCompleted'),
        publicationSubTypeList: publicationTypeState.get('publicationSubTypeList'),
        selectedPublicationId: state.get('publicationTypes').get('selectedPublicationType'),
        selectedAuthors: authorsState.get('selectedAuthors') || Immutable.Map({})
    };
}, dispatch => {
    return {
        cancelAddRecord: (message) => dispatch(cancelAddRecord(message)),
        loadPublicationSubTypesList: (id) => dispatch(loadPublicationSubTypesList(id)),
        loadAuthorsList: () => dispatch(loadAuthorsList()),
        submitRecordForApproval: (data, message) => dispatch(submitRecordForApproval(data, message)),
        uploadFile: (acceptedFiles) => dispatch(uploadFile(acceptedFiles))
    };
})(AddJournalArticleFormContainer);

export default AddJournalArticleFormContainer;
