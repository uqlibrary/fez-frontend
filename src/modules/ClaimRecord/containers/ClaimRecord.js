import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm, getFormValues, stopSubmit, SubmissionError} from 'redux-form/immutable';
import Immutable from 'immutable';
import ClaimRecord from '../components/ClaimRecord';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';

const FORM_NAME = 'ClaimRecord';

const onSubmit = (values, dispatch) => {
    const data = {...values.toJS()};
    return dispatch(actions.claimPublication(data))
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
    // reset global errors, eg form submit failure
    stopSubmit(FORM_NAME, null);
};

let ClaimPublicationFormContainer = reduxForm({
    form: FORM_NAME,
    validate,
    onSubmit
})(ClaimRecord);

const mapStateToProps = (state) => {
    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        initialValues: {
            publication: state.get('claimPublicationReducer').publicationToClaim,
            author: state.get('accountReducer').author
        }
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

ClaimPublicationFormContainer = connect(mapStateToProps, mapDispatchToProps)(ClaimPublicationFormContainer);
ClaimPublicationFormContainer = withRouter(ClaimPublicationFormContainer);

export default ClaimPublicationFormContainer;
