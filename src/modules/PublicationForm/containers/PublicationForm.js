import {connect} from 'react-redux';
import {reduxForm, getFormValues, stopSubmit, SubmissionError, reset} from 'redux-form/immutable';
import Immutable from 'immutable';
import PublicationForm from '../components/PublicationForm';
import {createNewRecord} from 'actions';
import {NEW_RECORD_DEFAULT_VALUES} from 'config/general';

const FORM_NAME = 'PublicationForm';

const onSubmit = (values, dispatch) => {
    const files = []; // TODO: will become a part of values
    // set default values for a new unapproved record
    // TODO: date should be a part of redux-form data
    const data = {...values.toJS(), ...NEW_RECORD_DEFAULT_VALUES, rek_date: '2000-1-1'};
    return dispatch(createNewRecord(data, files))
        .then(() => {
            // once this promise is resolved form is submitted successfully and will call parent container
            // reported bug to redux-form:
            // reset form after success action was dispatched:
            // componentWillUnmount cleans up form, but then onSubmit success sets it back to active
            setTimeout(()=>{
                dispatch(reset(FORM_NAME));
            }, 100);
        }).catch(error => {
            throw new SubmissionError({_error: error.message});
        });
};

const validate = () => {
    // reset global errors, eg form submit failure
    stopSubmit(FORM_NAME, null);
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
