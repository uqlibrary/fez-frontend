
import { reduxForm, SubmissionError, stopSubmit } from 'redux-form/immutable';
import * as actions from 'actions';
import MyIncompleteRecord from '../components/MyIncompleteRecord';
import { confirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { authorAffiliationRequired } from 'config/validation';
import { locale } from 'locale';

export const FORM_NAME = 'MyIncompleteRecord';

export const onSubmit = (values, dispatch, props) => {
    const data = {
        ...values.toJS(),
        publication: {...props.recordToFix},
        author: {...props.author}
    };

    return dispatch(actions.updateIncompleteRecord(data))
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

export const validate = (values, props) => {
    const { author } = props;
    stopSubmit(FORM_NAME, null);
    const data = values.toJS();
    const errors = {};
    if (data.authorsAffiliation &&
        data.authorsAffiliation
            .some(authorAffiliation => authorAffiliationRequired(authorAffiliation, author))
    ) {
        errors.authorsAffiliation = locale.validationErrors.authorsAffiliationIncomplete;
    }
    return errors;
};

export default confirmDiscardFormChanges(reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    validate,
    onSubmit
})(MyIncompleteRecord));
