import {connect} from 'react-redux';
import {reduxForm, getFormValues, stopSubmit, SubmissionError, reset} from 'redux-form/immutable';
import Immutable from 'immutable';
import PublicationForm from '../components/PublicationForm';
import {createNewRecord} from 'actions';
import {locale, general} from 'config';

const FORM_NAME = 'PublicationForm';

const onSubmit = (values, dispatch) => {
    // set default values for a new unapproved record
    return dispatch(createNewRecord({...values.toJS()}))
        .then(() => {
            // once this promise is resolved form is submitted successfully and will call parent container
            // reported bug to redux-form:
            // reset form after success action was dispatched:
            // componentWillUnmount cleans up form, but then onSubmit success sets it back to active
            setTimeout(()=>{
                dispatch(reset(FORM_NAME));
            }, 100);
        })
        .catch(error => {
            throw new SubmissionError({_error: error.message});
        });
};

const validate = (values) => {
    // reset global errors, eg form submit failure
    stopSubmit(FORM_NAME, null);
    const data = values.toJS();
    const errors = {};
    if (data.rek_display_type === general.PUBLICATION_TYPE_BOOK_CHAPTER
        || data.rek_display_type === general.PUBLICATION_TYPE_JOURNAL_ARTICLE
        || data.rek_display_type === general.PUBLICATION_TYPE_CONFERENCE_PAPER) {
        // author should be selected and linked to the current user
        if (!data.authors || data.authors.length === 0 || data.authors.filter(item => (item.selected)).length === 0) {
            errors.authors = locale.components.publicationForm.bookChapter.validationError;
        }
    }

    switch(data.rek_display_type) {
        case general.PUBLICATION_TYPE_BOOK:
            // either author or editor should be selected and linked to a user
            if (
                (!data.authors && !data.editors) ||
                (data.authors && data.editors && data.editors.length === 0 && data.authors.length === 0) ||
                (data.authors && data.authors.filter(item => (item.selected)).length === 0 &&
                    (!data.editors || (data.editors && data.editors.filter(item => (item.selected)).length === 0)))
            ) {
                errors.authors = locale.components.publicationForm.book.validationError;
            }
            break;


        case general.PUBLICATION_TYPE_AUDIO_DOCUMENT:
            // either author or editor should be selected and linked to a user
            if (
                (!data.authors && !data.editors) ||
                (data.authors && data.editors && data.editors.length === 0 && data.authors.length === 0) ||
                (data.authors && data.authors.filter(item => (item.selected)).length === 0 &&
                    (!data.editors || (data.editors && data.editors.filter(item => (item.selected)).length === 0)))
            ) {
                errors.authors = locale.components.publicationForm.audioDocument.validationError;
            }
            break;

        default: break;
    }

    return errors;
};

let PublicationFormContainer = reduxForm({
    form: FORM_NAME,
    validate,
    onSubmit
})(PublicationForm);

const mapStateToProps = (state) => {
    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({})
    };
};

PublicationFormContainer = connect(mapStateToProps)(PublicationFormContainer);

export default PublicationFormContainer;
