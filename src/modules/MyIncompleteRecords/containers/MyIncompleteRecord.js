import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MyIncompleteRecord from '../components/MyIncompleteRecord';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';
import Immutable from 'immutable';
import {getFormSyncErrors, getFormValues, SubmissionError, reset, reduxForm} from 'redux-form';
import {createNewRecord} from 'actions';
import {confirmDiscardFormChanges} from 'modules/SharedComponents/ConfirmDiscardFormChanges';

const FORM_NAME = 'MyIncompleteRecord';

const onSubmit = (values, dispatch, state) => {
    // Get the list of redux-form registered fields for the current form
    const formFields = state.registeredFields.toJS();

    // Delete the currentAuthor if there is no author field in the form (potentially editors only like conference proceedings) and its not a thesis (specific field name)
    const cleanValues = values.toJS();
    if((!formFields.authors && !formFields['currentAuthor.0.nameAsPublished'])) {
        delete cleanValues.currentAuthor;
    }

    // set default values for a new unapproved record
    // TODO: New action to patch the record - NOT CREATE A NEW ONE
    return dispatch(createNewRecord({...cleanValues}))
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

let MyIncompleteRecordContainer = reduxForm({
    form: FORM_NAME,
    onSubmit
})(confirmDiscardFormChanges(MyIncompleteRecord, FORM_NAME));

const mapStateToProps = (state) => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    const formValues = getFormValues(FORM_NAME)(state) || Immutable.Map({});
    const importedValues = state.get('viewRecordReducer') && state.get('viewRecordReducer').recordToView;

    return {
        ...state.get('accountReducer'),
        ...state.get('viewRecordReducer'),
        // Form props
        formValues: formValues,
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        initialValues: importedValues ? {
        // Place all of the imported NTRO values from the PID into their form fields here....
            rek_title: importedValues.rek_title || 'Test', // This is just an example
            rek_author_affiliation_name: importedValues.rek_author_affiliation_name || null,
            rek_author_affiliation_type: importedValues.rek_author_affiliation_type || null,
            fez_record_search_key_significance: importedValues.fez_record_search_key_significance || null,
            rek_description: importedValues.rek_description || null,
            rek_formatted_abstract: importedValues.rek_formatted_abstract || null,
            fez_record_search_key_total_pages: importedValues.fez_record_search_key_total_pages || null,
            fez_record_search_key_language: importedValues.fez_record_search_key_language || null,
            fez_record_search_key_quality_indicator: importedValues.fez_record_search_key_quality_indicator || null,
            fez_record_search_key_grant_agency: importedValues.fez_record_search_key_grant_agency || null,
            fez_record_search_key_grant_id: importedValues.fez_record_search_key_grant_id || null,
            fez_record_search_key_grant_agency_type: importedValues.fez_record_search_key_grant_agency_type || null,
            fez_record_search_key_audience_size: importedValues.fez_record_search_key_audience_size || null
        } : null
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

MyIncompleteRecordContainer = connect(mapStateToProps, mapDispatchToProps)(MyIncompleteRecordContainer);
MyIncompleteRecordContainer = withRouter(MyIncompleteRecordContainer);
export default MyIncompleteRecordContainer;
