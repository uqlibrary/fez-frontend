import {connect} from 'react-redux';
import {reduxForm, getFormValues, stopSubmit, SubmissionError} from 'redux-form/immutable';
import Immutable from 'immutable';
import ThesisSubmission from '../components/ThesisSubmission';
import {submitThesis} from 'actions';
import {general} from 'config';
// import {locale} from 'locale';
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

    if (!data.rek_title) {
        errors.push('Thesis title is required');
    }

    if (data.fez_record_search_key_org_unit_name && !data.fez_record_search_key_org_unit_name.rek_org_unit_name) {
        errors.push('School, institute or centre is required');
    }

    if (!data.fez_record_search_key_org_name.rek_org_name) {
        errors.push('Institution name is required');
    }

    if (!data.rek_genre_type) {
        errors.push('Thesis type is required');
    }

    if (!data.rek_date) {
        errors.push('Publication date is required');
    }

    if (!data.currentAuthor || data.currentAuthor.length === 0) {
        errors.push('Thesis author name is required');
    }

    if (data.fez_record_search_key_description && !data.fez_record_search_key_description.rek_description) {
        errors.push('Abstract is required');
    }

    if (!data.supervisors || data.supervisors.length === 0) {
        errors.push('Supervisors are required');
    }

    if (!data.fieldOfResearch || data.fieldOfResearch.length === 0) {
        errors.push('Field of research values are required');
    }

    if (!data.fez_record_search_key_keywords || data.fez_record_search_key_keywords.length === 0) {
        errors.push('Keyword values are required');
    }

    if (!data.files || data.files.queue.length === 0) {
        errors.push('Thesis files are required');
    }

    return errors.length > 0 ? {_error: errors} : null;
};

let ThesisSubmissionContainer = reduxForm({
    form: FORM_NAME,
    validate,
    onSubmit
})(confirmDiscardFormChanges(ThesisSubmission, FORM_NAME));

const mapStateToProps = (state, props) => {
    const currentAuthor = state.get('accountReducer').author;
    const initialValues = {
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
