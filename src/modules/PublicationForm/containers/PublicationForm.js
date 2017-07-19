import {connect} from 'react-redux';
import {reduxForm, getFormValues} from 'redux-form/immutable';
import Immutable from 'immutable';
import PublicationForm from '../components/PublicationForm';
const scrollToElement = require('scrollto-element');

const onSubmit = () => { // (values) => {
    console.log('forms is submitting.... from container component for now....');
    // console.log(values.toJS());
};

const validate = () => { // (values) => {
    // console.log(values.toJS());
    const errors = {};
    // validate partial date of custom date picker
    // if (values.get('partialDateYear') && values.get('partialDateMonth') && values.get('partialDateDay')) {
    //     const parsedDate = new Date(
    //         parseInt(values.get('partialDateYear'), 10),
    //         parseInt(values.get('partialDateMonth'), 10),
    //         parseInt(values.get('partialDateDay'), 10));
    //
    //     if (parsedDate.getMonth() !== parseInt(values.get('partialDateMonth'), 10)) {
    //         errors.partialDateDay = 'Invalid date';
    //     }
    // publicationData: {
    //  rek_title: 'wrong!'
    // }
    // }
    return errors;
};

const onSubmitFail = (result) => {
    try {
        const target = Object.keys(result);
        const invalidField = document.getElementsByName(target[0])[0];
        if (invalidField) {
            // scroll to the first erroneous field
            scrollToElement(invalidField, 800);
            // set focus to first invalid field
            invalidField.focus();
            const invalidFieldSubElements = invalidField.querySelectorAll('button, select, input, textArea, a');
            if (invalidFieldSubElements.length > 0) {
                invalidFieldSubElements[0].focus();
            }
        }
    } catch (e) {
        console.debug(e);
    }
};

let PublicationFormContainer = reduxForm({
    form: 'PublicationForm', // a unique identifier for this form
    validate,
    onSubmitFail,
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
