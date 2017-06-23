/* eslint-disable */

import {connect} from 'react-redux';

import {reduxForm, getFormValues} from 'redux-form/immutable';
import AddJournalArticleForm from '../components/AddJournalArticleForm';
import {loadPublicationSubTypesList, cancelAddRecord, loadAuthorsList, submitRecordForApproval} from '../actions';
import {decreaseStep} from '../../../AddRecord/actions';
import Immutable from 'immutable';

const scrollToElement = require('scrollto-element');

let AddJournalArticleFormContainer = reduxForm({
    validate: (values) => {

        console.dir(values);

        //validate partial date of custom date picker
        if (values.get('partialDateYear') && values.get('partialDateMonth') && values.get('partialDateDay')) {
            const parsedDate = new Date(
                parseInt(values.get('partialDateYear')),
                parseInt(values.get('partialDateMonth')),
                parseInt(values.get('partialDateDay')));

            if (parsedDate.getMonth() !== parseInt(values.get('partialDateMonth'))) {
                return { partialDateDay: 'Invalid date'};
            }
        }
        return null;
    },

    onSubmitFail: (result, dispatch, submitError, props) => {
        try {
            const target = Object.keys(result);
            const invalidField = document.getElementsByName(target[0])[0];
            if (invalidField) {
                // scroll to the first erroneous field
                scrollToElement(invalidField, 800);
                // set focus to first invalid field
                invalidField.focus();
                const invalidFieldSubElements = invalidField.querySelectorAll('button, select, input, textArea, a');
                if (invalidFieldSubElements.length > 0) {
                    invalidFieldSubElements[0].focus();
                }
            }
        } catch (e) {
            console.debug(e);
        }
    }
})(AddJournalArticleForm);

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
        selectedAuthors: authorsState.get('selectedAuthors') || Immutable.Map({})
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
