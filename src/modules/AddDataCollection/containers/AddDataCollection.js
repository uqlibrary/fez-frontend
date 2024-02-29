import { connect } from 'react-redux';
import { reduxForm, getFormValues, SubmissionError, getFormSyncErrors, stopSubmit, reset } from 'redux-form/immutable';
import Immutable from 'immutable';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';
import { createNewRecord } from 'actions';
import AddDataCollection from '../components/AddDataCollection';
import { NEW_DATASET_DEFAULT_VALUES } from 'config/general';
import { locale } from 'locale';
import moment from 'moment';

const FORM_NAME = 'DataCollection';

const onSubmit = (values, dispatch, state) => {
    // Get the list of redux-form registered fields for the current form
    const formFields = state.registeredFields.toJS();

    // Delete the currentAuthor if there is no author field in the
    //  form (potentially editors only like conference proceedings) and its not a thesis (specific field name)
    const cleanValues = values.toJS();
    if (!formFields.authors && !formFields['currentAuthor.0.nameAsPublished']) {
        delete cleanValues.currentAuthor;
    }

    // set default values for a new unapproved record
    return dispatch(createNewRecord({ ...cleanValues }))
        .then(() => {
            // once this promise is resolved form is submitted successfully and will call parent containers
            // setTimeout(() => {
            //     dispatch(reset(FORM_NAME));
            // }, 100);
        })
        .catch(error => {
            throw new SubmissionError({ _error: error.message });
        });
};

const validate = values => {
    // add only multi field validations
    // single field validations should be implemented using validate prop: <Field validate={[validation.required]} />
    // reset global errors, eg form submit failure
    stopSubmit(FORM_NAME, null);
    const data = values.toJS();
    const errors = {};

    // Check start\end dates are valid
    const endDate =
        data.fez_record_search_key_end_date &&
        data.fez_record_search_key_end_date.rek_end_date &&
        moment(data.fez_record_search_key_end_date.rek_end_date, 'YYYY-MM-DD').format();
    const startDate =
        data.fez_record_search_key_start_date &&
        data.fez_record_search_key_start_date.rek_start_date &&
        moment(data.fez_record_search_key_start_date.rek_start_date, 'YYYY-MM-DD').format();

    if (!!endDate && !!startDate && startDate > endDate) {
        errors.collectionDateRange = locale.validationErrors.collectionDateRange;
    } else {
        if (!!errors.collectionDateRange) {
            // cleanup
            delete errors.collectionDateRange;
        }
    }

    return errors;
};

const AddDataCollectionContainer = reduxForm({
    form: FORM_NAME,
    onSubmit,
    validate,
})(AddDataCollection);

const mapStateToProps = state => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});

    const initialValues = {
        ...NEW_DATASET_DEFAULT_VALUES,
    };

    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        initialValues: initialValues,
        resetForm: () => reset(FORM_NAME),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const AddDataCollectionForm = connect(mapStateToProps, mapDispatchToProps)(AddDataCollectionContainer);

export default AddDataCollectionForm;
