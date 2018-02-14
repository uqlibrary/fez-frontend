import {connect} from 'react-redux';
import {reduxForm, getFormValues, stopSubmit, SubmissionError} from 'redux-form/immutable';
import Immutable from 'immutable';
import ThesisSubmission from '../components/ThesisSubmission';
import {submitThesis} from 'actions';
import {general} from 'config';
import {default as formLocale} from 'locale/publicationForm';

import {confirmDiscardFormChanges} from 'modules/SharedComponents/ConfirmDiscardFormChanges';

const FORM_NAME = 'ThesisSubmission';

const onSubmit = (values, dispatch, props) => {
    return dispatch(submitThesis({...values.toJS()}, props.author))
        .then((record) => {
            console.log(record);
            // once this promise is resolved form is submitted successfully and will call parent container
            // reported bug to redux-form:
            // reset form after success action was dispatched:
            // componentWillUnmount cleans up form, but then onSubmit success sets it back to active
            // setTimeout(()=>{
            //     dispatch(reset(FORM_NAME));
            // }, 100);
        })
        .catch(error => {
            throw new SubmissionError({_error: error});
        });
};

const validate = (values) => {
    // add only multi field validations
    // single field validations should be implemented using validate prop: <Field validate={[validation.required]} />
    // reset global errors, eg form submit failure
    stopSubmit(FORM_NAME, null);

    const data = values.toJS();
    const errors = [];
    const txt = formLocale.thesis;

    if (!data.rek_title) {
        errors.push(txt.information.fieldLabels.documentTitle.errorMessage);
    }

    if (!data.fez_record_search_key_org_unit_name || !data.fez_record_search_key_org_unit_name.rek_org_unit_name) {
        errors.push(txt.information.fieldLabels.orgUnitName.errorMessage);
    }

    if (!data.fez_record_search_key_org_name || !data.fez_record_search_key_org_name.rek_org_name) {
        errors.push(txt.information.fieldLabels.orgName.errorMessage);
    }

    if (!data.rek_genre_type) {
        errors.push(txt.information.fieldLabels.thesisType.errorMessage);
    }

    if (!data.rek_date) {
        errors.push(txt.information.fieldLabels.date.errorMessage);
    }

    if (!data.currentAuthor || data.currentAuthor.length === 0 || !data.currentAuthor[0].nameAsPublished) {
        errors.push(txt.information.fieldLabels.author.errorMessage);
    }

    if (!data.fez_record_search_key_description || !data.fez_record_search_key_description.rek_description) {
        errors.push(txt.optional.fieldLabels.abstract.errorMessage);
    }

    if (!data.supervisors || data.supervisors.length === 0) {
        errors.push(txt.supervisors.errorMessage);
    }

    if (!data.fieldOfResearch || data.fieldOfResearch.length === 0) {
        errors.push(txt.fieldOfResearch.errorMessage);
    }

    if (!data.fez_record_search_key_keywords || data.fez_record_search_key_keywords.length === 0) {
        errors.push(txt.keywords.errorMessage);
    }

    if (!data.files || data.files.queue.length === 0) {
        errors.push(formLocale.fileUpload.errorMessage);
    }

    return errors.length > 0 ? {_error: errors} : null;
};

let ThesisSubmissionContainer = reduxForm({
    form: FORM_NAME,
    validate,
    onSubmit
})(confirmDiscardFormChanges(ThesisSubmission, FORM_NAME));

const mapStateToProps = (state, props) => {
    const currentAuthor = state && state.get('accountReducer') ? state.get('accountReducer').author : null;
    const initialValues = {
        'rek_formatted_abstract': 'some abs value...',
        'rek_formatted_title': 'some title value...',
        currentAuthor: [
            {
                'nameAsPublished': currentAuthor ? currentAuthor.aut_display_name : '',
                'authorId': currentAuthor ? currentAuthor.aut_id : ''
            }
        ],
        fez_record_search_key_org_name: {rek_org_name: 'The University of Queensland'},
        ...props.isHdrThesis ? general.HDR_THESIS_DEFAULT_VALUES : general.SBS_THESIS_DEFAULT_VALUES
    };

    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        initialValues: initialValues,
        author: currentAuthor,
        isHdrThesis: props.isHdrThesis
    };
};

ThesisSubmissionContainer = connect(mapStateToProps)(ThesisSubmissionContainer);

export default ThesisSubmissionContainer;
