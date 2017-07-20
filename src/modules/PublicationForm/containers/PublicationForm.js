import {connect} from 'react-redux';
import {reduxForm, getFormValues, stopSubmit, SubmissionError} from 'redux-form/immutable';
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
        .then((response) => {
            // TODO: where should I redirect/display
            console.log('hurray!!! ' + response.rek_pid);
        }).catch(error => {
            throw new SubmissionError({_error: error.message});
        });
};

const validate = (values) => {
    // reset global errors, eg form submit failure
    stopSubmit(FORM_NAME, null);

    const errors = {};
    // validate partial date of custom date picker
    if (values.get('partialDateYear') && values.get('partialDateMonth') && values.get('partialDateDay')) {
        const parsedDate = new Date(
            parseInt(values.get('partialDateYear'), 10),
            parseInt(values.get('partialDateMonth'), 10),
            parseInt(values.get('partialDateDay'), 10));

        if (parsedDate.getMonth() !== parseInt(values.get('partialDateMonth'), 10)) {
            errors.partialDateDay = 'Invalid date';
        }
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
        formValues: getFormValues('PublicationForm')(state) || Immutable.Map({}),
        initialValues: {
            rek_title: 'default title value...'
        }
    };
};

PublicationFormContainer = connect(mapStateToProps)(PublicationFormContainer);

export default PublicationFormContainer;
