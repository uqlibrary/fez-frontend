import { reduxForm, SubmissionError, stopSubmit } from 'redux-form/immutable';
import * as actions from 'actions';
import MyIncompleteRecord from '../components/MyIncompleteRecord';
import { authorAffiliationRequired } from 'config/validation';
import { locale } from 'locale';

export const FORM_NAME = 'MyIncompleteRecord';

export const onSubmit = (values, dispatch, props) => {
    const data = {
        ...values.toJS(),
        publication: { ...props.recordToFix },
        author: { ...props.author },
    };

    return dispatch(actions.updateIncompleteRecord(data)).catch(error => {
        throw new SubmissionError({ _error: error.message });
    });
};

export const validate = (values, props) => {
    const { author } = props;
    stopSubmit(FORM_NAME, null);
    const data = values.toJS();
    const errors = {};
    if (
        data.authorsAffiliation &&
        data.authorsAffiliation.some(authorAffiliation => authorAffiliationRequired(authorAffiliation, author))
    ) {
        errors.authorsAffiliation = locale.validationErrors.authorsAffiliationIncomplete;
    }
    return errors;
};

export default reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    validate,
    onSubmit,
})(MyIncompleteRecord);
