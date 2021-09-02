import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, SubmissionError } from 'redux-form/immutable';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { locale } from 'locale';
import { createOrUpdateDoi } from 'actions';

const FORM_NAME = 'CreateOrUpdateDoiForm';

const onSubmit = (values, dispatch, props) => {
    return dispatch(createOrUpdateDoi(Object.values(props.recordsSelected))).catch(error => {
        throw new SubmissionError({ _error: error.message });
    });
};

export const CreateOrUpdateDoiForm = ({ error, handleSubmit, onCancel, submitting, submitSucceeded }) => {
    const txt = locale.components.bulkUpdates.bulkUpdatesForms;

    React.useEffect(() => {
        if (submitSucceeded) {
            setTimeout(onCancel, 2000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitSucceeded]);

    return (
        <form data-testid="create-or-update-doi-form" id="create-or-update-doi-form">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert alertId="alert-info-create-or-update-doi" {...txt.createOrUpdateDoiForm.alert} />
                </Grid>
                <Grid item xs={6}>
                    <Button
                        aria-label={txt.createOrUpdateDoiForm.formLabels.cancelButtonLabel}
                        children={txt.createOrUpdateDoiForm.formLabels.cancelButtonLabel}
                        data-testid="create-or-update-doi-cancel"
                        disabled={submitting}
                        fullWidth
                        id="create-or-update-doi-cancel"
                        onClick={onCancel}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={6}>
                    <Button
                        aria-label={txt.createOrUpdateDoiForm.formLabels.submitButtonLabel}
                        children={txt.createOrUpdateDoiForm.formLabels.submitButtonLabel}
                        color="primary"
                        data-testid="create-or-update-doi-submit"
                        disabled={submitting || submitSucceeded}
                        fullWidth
                        id="create-or-update-doi-submit"
                        onClick={handleSubmit}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12}>
                    {!!submitting && (
                        <Alert
                            alertId="alert-info-create-or-update-doi"
                            {...txt.createOrUpdateDoiForm.submittingAlert}
                        />
                    )}
                    {!!submitSucceeded && (
                        <Alert alertId="alert-done-create-or-update-doi" {...txt.createOrUpdateDoiForm.successAlert} />
                    )}
                    {!!error && (
                        <Alert alertId="alert-error-create-or-update-doi" {...txt.createOrUpdateDoiForm.errorAlert} />
                    )}
                </Grid>
            </Grid>
        </form>
    );
};

CreateOrUpdateDoiForm.propTypes = {
    error: PropTypes.string,
    handleSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    recordsSelected: PropTypes.object,
    submitting: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
};

const CreateOrUpdateDoiReduxForm = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(CreateOrUpdateDoiForm);

export default React.memo(CreateOrUpdateDoiReduxForm);
