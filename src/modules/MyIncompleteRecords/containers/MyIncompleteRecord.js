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
    console.log('MyIncompleteRecord container onSubmit');
    console.log('values');
    console.log(values);
    console.log('props');
    console.log(props);
    const data = {
        ...values.toJS(),
        publication: {...props.recordToFix},
        author: {...props.author}
    };
    console.log('data');
    console.log(data);
    return dispatch(
        actions.patchIncompleteRecord(data))
        .then(() => {
            // following from fixRecord...
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
    console.log('mapStateToProps');
    console.log('state');
    console.log(state);
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    const importedValues = state.get('fixRecordReducer') && state.get('fixRecordReducer').recordToFix;

    if (!!importedValues && !!importedValues.fez_record_search_key_author) {
        if (importedValues.fez_record_search_key_author.length === 0 || !importedValues.fez_record_search_key_author[0].rek_author_order) {
            // we did not get an author id - handle error
            // how?
        }
    }

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
            fez_record_search_key_audience_size: importedValues && importedValues.fez_record_search_key_audience_size || null,
            fez_record_search_key_creator_contribution_statement: importedValues && importedValues.fez_record_search_key_creator_contribution_statement || null
        }
    };
};

function mapDispatchToProps(dispatch) {
    console.log('mapDispatchToProps');
    console.log('dispatch');
    console.log(dispatch);
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

MyIncompleteRecordContainer = connect(mapStateToProps, mapDispatchToProps)(MyIncompleteRecordContainer);
MyIncompleteRecordContainer = withRouter(MyIncompleteRecordContainer);
export default MyIncompleteRecordContainer;
