import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Immutable from 'immutable';
import { reduxForm, getFormValues, getFormSyncErrors, SubmissionError } from 'redux-form/immutable';

import BatchImport, { FORM_NAME } from '../components/BatchImport';

import * as actions from 'actions';
import { confirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';

const onSubmit = (values, dispatch) => {
    const data = { ...values.toJS() };
    return dispatch(actions.createBatchImport(data))
        .then(response => {
            if (!response || !response.data) {
                throw new SubmissionError();
            }
            // console.log(`Success: ${response.data}`);
        })
        .catch(error => {
            throw new SubmissionError({ _error: error.message });
        });
};

let BatchImportContainer = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(confirmDiscardFormChanges(BatchImport, FORM_NAME));

const mapStateToProps = state => {
    const formErrors = (state && getFormSyncErrors(FORM_NAME)(state)) || Immutable.Map({});
    const formValues = (state && getFormValues(FORM_NAME)(state)) || Immutable.Map({});
    return {
        communityID: formValues.toJS().communityID,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        formErrors,
    };
};

BatchImportContainer = connect(mapStateToProps)(BatchImportContainer);

BatchImportContainer = withRouter(BatchImportContainer);
export default BatchImportContainer;
