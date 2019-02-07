import {connect} from 'react-redux';
import {reduxForm, getFormValues, SubmissionError, getFormSyncErrors} from 'redux-form/immutable';
import Immutable from 'immutable';
import CollectionForm from '../components/CollectionForm';
import {submitThesis, checkSession, clearSessionExpiredFlag} from 'actions';
// import {general} from 'config';
import {bindActionCreators} from 'redux';

import {confirmDiscardFormChanges} from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import {reloadReducerFromLocalStorage} from 'modules/SharedComponents/ReloadReducerFromLocalStorage';

const FORM_NAME = 'Collection';

const onSubmit = (values, dispatch, props) => {
    return dispatch(submitThesis({...values.toJS()}, props.author))
        .then(() => {
            // console.log(record);
            // once this promise is resolved form is submitted successfully and will call parent container
            // reported bug to redux-form:
            // reset form after success action was dispatched:
            // componentWillUnmount cleans up form, but then onSubmit success sets it back to active
            // setTimeout(()=>{
            //     dispatch(reset(FORM_NAME));
            // }, 100);
        })
        .catch(error => {
            throw new SubmissionError({_error: error});
        });
};

let CollectionContainer = reduxForm({
    form: FORM_NAME,
    onSubmit
})(confirmDiscardFormChanges(CollectionForm, FORM_NAME));

const mapStateToProps = (state, props) => {
    const currentAuthor = state && state.get('accountReducer') ? state.get('accountReducer').author : null;

    // eslint-disable-next-line no-unused-vars
    const {...locallyStoredValues} = !!props.locallyStoredReducer && !!props.locallyStoredReducer.get(FORM_NAME) && props.locallyStoredReducer.get(FORM_NAME).values;

    // const today = new Date();
    const initialValues = {};

    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});

    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        initialValues: Object.keys(locallyStoredValues).length > 0 && locallyStoredValues || initialValues,
        author: currentAuthor,
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({checkSession, clearSessionExpiredFlag}, dispatch)
});

CollectionContainer = connect(mapStateToProps, mapDispatchToProps)(CollectionContainer);

export default reloadReducerFromLocalStorage()(CollectionContainer);
