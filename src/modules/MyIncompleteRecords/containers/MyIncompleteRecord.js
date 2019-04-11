import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MyIncompleteRecord from '../components/MyIncompleteRecord';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';
import Immutable from 'immutable';
import {general, publicationTypes} from 'config';
import {formValueSelector, getFormSyncErrors, getFormValues, SubmissionError, reset, reduxForm, stopSubmit} from 'redux-form';
import * as recordForms from 'modules/SharedComponents/PublicationForm/components/Forms';
import {NEW_DOCTYPES_OPTIONS, DOCTYPE_SUBTYPE_MAPPING} from 'config/general';
import {createNewRecord} from 'actions';
import {confirmDiscardFormChanges} from 'modules/SharedComponents/ConfirmDiscardFormChanges';

const FORM_NAME = 'incompleteForm';

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

const validate = (values) => {
    console.log('Trying to validate :', values);
    // add only multi field validations
    // single field validations should be implemented using validate prop: <Field validate={[validation.required]} />
    // reset global errors, eg form submit failure
    stopSubmit(FORM_NAME, null);
    // const data = values && values.toJS() || null;
    const errors = {};

    // // Check start\end dates are valid
    // const endDate = data.fez_record_search_key_end_date && data.fez_record_search_key_end_date.rek_end_date && moment(data.fez_record_search_key_end_date.rek_end_date, 'YYYY-MM-DD').format();
    // const startDate = data.rek_date && moment(data.rek_date).format();
    //
    // if(!!endDate && !!startDate && startDate > endDate) {
    //     errors.dateRange = locale.validationErrors.dateRange;
    // }
    //
    // // Check start/end pages are alid
    // const startPage = data.fez_record_search_key_start_page && data.fez_record_search_key_start_page.rek_start_page;
    // const endPage = data.fez_record_search_key_end_page && data.fez_record_search_key_end_page.rek_end_page;
    // if(!!startPage && !!endPage && startPage > endPage) {
    //     errors.pageRange = locale.validationErrors.pageRange;
    // }

    return errors;
};

const MyIncompleteRecordWrapper = reduxForm({
    form: FORM_NAME,
    validate,
    onSubmit

})(confirmDiscardFormChanges(MyIncompleteRecord, FORM_NAME));

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = (state) => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    const formValues = getFormValues(FORM_NAME)(state) || Immutable.Map({});
    const displayType = selector(state, 'rek_display_type');
    const publicationSubtype = selector(state, 'rek_subtype');

    const selectedPublicationType = !!displayType && publicationTypes({...recordForms}).filter(type =>
        type.id === displayType
    );

    let hasDefaultDocTypeSubType = false;
    let docTypeSubTypeCombo = null;

    if (!!displayType && NEW_DOCTYPES_OPTIONS.includes(displayType)) {
        hasDefaultDocTypeSubType = true;
        docTypeSubTypeCombo = !!DOCTYPE_SUBTYPE_MAPPING[displayType] && DOCTYPE_SUBTYPE_MAPPING[displayType];
    }

    const hasSubtypes = !!selectedPublicationType && selectedPublicationType.length > 0 && !!selectedPublicationType[0].subtypes || false;
    const subtypes = hasSubtypes && selectedPublicationType[0].subtypes || null;
    const formComponent = hasSubtypes
        ? !!publicationSubtype && selectedPublicationType[0].formComponent
        : (selectedPublicationType.length > 0 && selectedPublicationType[0].formComponent || null);

    const importedValues = state.get('viewRecordReducer') && state.get('viewRecordReducer').recordToView;
    console.log(importedValues);

    return {
        ...state.get('accountReducer'),
        ...state.get('viewRecordReducer'),
        // Form props
        formValues: formValues,
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        hasSubtypes: hasSubtypes,
        subtypes: !!publicationSubtype && general.NTRO_SUBTYPES.includes(publicationSubtype) && subtypes.filter(type => general.NTRO_SUBTYPES.includes(type)) || subtypes,
        subtype: publicationSubtype,
        formComponent: (!hasSubtypes && formComponent) || (hasSubtypes && !!publicationSubtype && formComponent) || null,
        isNtro: general.NTRO_SUBTYPES.includes(publicationSubtype),
        hasDefaultDocTypeSubType: hasDefaultDocTypeSubType,
        docTypeSubTypeCombo: docTypeSubTypeCombo,
        isAuthorSelected: !!formValues && formValues.get('authors') && formValues.get('authors').some((object) => {return object.selected === true;}) || false,
        initialValues: {
            // Place all of the imported NTRO values from the PID into their form fields here....
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

let MyIncompleteRecordContainer = connect(mapStateToProps, mapDispatchToProps)(MyIncompleteRecordWrapper);
MyIncompleteRecordContainer = withRouter(MyIncompleteRecordContainer);
export default MyIncompleteRecordContainer;
