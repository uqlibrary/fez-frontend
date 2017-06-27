import {connect} from 'react-redux';

import {reduxForm, getFormValues} from 'redux-form/immutable';
import AddJournalArticleForm from '../components/AddJournalArticleForm';
import {loadPublicationSubTypesList, cancelAddRecord, submitRecordForApproval} from '../actions';
import {decreaseStep} from '../../../AddRecord/actions';
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
    const authorsState = state.get('authors') || Immutable.Map({});

    return {
        authorList: publicationTypeState.get('authorList') || Immutable.Map({}),
        formValues: getFormValues('AddJournalArticleForm')(state) || Immutable.Map({}),
        publicationSubTypeList: publicationTypeState.get('publicationSubTypeList'),
        selectedPublicationId: state.get('publicationTypes').get('selectedPublicationType'),
        authorsList: authorsState.get('authorsList') || Immutable.Map({})
    };
}, dispatch => {
    return {
        cancelAddRecord: (message) => dispatch(cancelAddRecord(message)),
        decreaseStep: () => dispatch(decreaseStep()),
        loadPublicationSubTypesList: (id) => dispatch(loadPublicationSubTypesList(id)),
        submitRecordForApproval: (data, message) => dispatch(submitRecordForApproval(data, message))
    };
})(AddJournalArticleFormContainer);

export default AddJournalArticleFormContainer;
