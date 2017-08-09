import {connect} from 'react-redux';
import {reduxForm, getFormValues, stopSubmit, SubmissionError, reset} from 'redux-form/immutable';
import Immutable from 'immutable';
import ClaimPublicationForm from '../components/ClaimPublicationForm';
import {withRouter} from 'react-router-dom';
import {claimPublication} from 'actions';

const FORM_NAME = 'ClaimPublicationForm';

const onSubmit = (values, dispatch) => {
    // TODO: will become a part of values
    // const files = [
    //     {
    //         file: 'image.jpg',
    //         access_condition_id: 1,
    //         date: '2017-08-20'
    //     },
    //     {
    //         file: 'image2.jpg',
    //         access_condition_id: 2,
    //         date: '2017-08-21'
    //     }
    // ];

    // set default values for a new unapproved record
    // TODO: date should be a part of redux-form data
    const data = {...values.toJS()};
    console.log(data);
    return dispatch(claimPublication(data))
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

let ClaimPublicationFormContainer = reduxForm({
    form: FORM_NAME,
    validate,
    onSubmit
})(ClaimPublicationForm);

const mapStateToProps = (state) => {
    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        initialValues: {
            publication: state.get('claimPublicationReducer').publicationToClaim,
            author: state.get('currentAuthorReducer').currentAuthor
        }
    };
};

ClaimPublicationFormContainer = connect(mapStateToProps)(ClaimPublicationFormContainer);
ClaimPublicationFormContainer = withRouter(ClaimPublicationFormContainer);

export default ClaimPublicationFormContainer;
