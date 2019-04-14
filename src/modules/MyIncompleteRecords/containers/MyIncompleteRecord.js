import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm, getFormValues, getFormSyncErrors, SubmissionError, stopSubmit} from 'redux-form/immutable';
import Immutable from 'immutable';
import MyIncompleteRecord from '../components/MyIncompleteRecord';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';
import {confirmDiscardFormChanges} from 'modules/SharedComponents/ConfirmDiscardFormChanges';

const FORM_NAME = 'MyIncompleteRecord';

const onSubmit = (values, dispatch, props) => {
    const data = {
        ...values.toJS(),
        publication: {...props.recordToFix},
        author: {...props.author}
    };
    return dispatch(data.fixAction === 'unclaim'
        ? actions.unclaimRecord(data)
        : actions.fixRecord(data))
        .then(() => {
            // once this promise is resolved form is submitted successfully and will call parent container
            // reported bug to redux-form:
            // reset form after success action was dispatched:
            // componentWillUnmount cleans up form, but then onSubmit success sets it back to active
            // setTimeout(()=>{
            //     dispatch(reset(FORM_NAME));
            // }, 100);
        }).catch(error => {
            throw new SubmissionError({_error: error.message});
        });
};

const validate = () => {
    stopSubmit(FORM_NAME, null);
    const errors = {};
    return errors;
};

let MyIncompleteRecordContainer = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    validate,
    onSubmit
})(confirmDiscardFormChanges(MyIncompleteRecord, FORM_NAME));

const mapStateToProps = (state) => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    const importedValues = state.get('fixRecordReducer') && state.get('fixRecordReducer').recordToFix;
    return {
        ...state.get('fixRecordReducer'),
        ...state.get('accountReducer'),
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        initialValues: {
            // Place all of the imported NTRO values from the PID into their form fields here....
            rek_title: importedValues && importedValues.rek_title || null,
            rek_author_affiliation_name: importedValues && importedValues.rek_author_affiliation_name || null,
            rek_author_affiliation_type: importedValues && importedValues.rek_author_affiliation_type || null,
            fez_record_search_key_significance: importedValues && importedValues.fez_record_search_key_significance || null,
            rek_description: importedValues && importedValues.rek_description || null,
            rek_formatted_abstract: importedValues && importedValues.rek_formatted_abstract || null,
            fez_record_search_key_total_pages: importedValues && importedValues.fez_record_search_key_total_pages || null,
            fez_record_search_key_language: importedValues && importedValues.fez_record_search_key_language || null,
            fez_record_search_key_quality_indicator: importedValues && importedValues.fez_record_search_key_quality_indicator || null,
            fez_record_search_key_grant_agency: importedValues && importedValues.fez_record_search_key_grant_agency || null,
            fez_record_search_key_grant_id: importedValues && importedValues.fez_record_search_key_grant_id || null,
            fez_record_search_key_grant_agency_type: importedValues && importedValues.fez_record_search_key_grant_agency_type || null,
            fez_record_search_key_audience_size: importedValues && importedValues.fez_record_search_key_audience_size || null
        }
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
