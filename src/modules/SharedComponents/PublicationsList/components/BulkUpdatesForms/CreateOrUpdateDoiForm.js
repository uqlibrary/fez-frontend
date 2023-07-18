import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, SubmissionError } from 'redux-form/immutable';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { locale } from 'locale';
import { createOrUpdateDoi } from 'actions';
import { RECORD_TYPE_COLLECTION } from '../../../../../config/general';

const FORM_NAME = 'CreateOrUpdateDoiForm';

const onSubmit = (values, dispatch, props) => {
    return dispatch(createOrUpdateDoi(Object.values(props.recordsSelected))).catch(error => {
        throw new SubmissionError({ _error: error.message });
    });
};

export const CreateOrUpdateDoiForm = ({
    error,
    handleSubmit,
    onCancel,
    recordsSelected,
    submitting,
    submitSucceeded,
}) => {
    const txt = locale.components.bulkUpdates.bulkUpdatesForms;
    const hasCollectionsAmongSelectedRecords =
        Object.values(recordsSelected).filter(
            record =>
                !!record &&
                !!record.rek_object_type_lookup &&
                record.rek_object_type_lookup.toLowerCase() === RECORD_TYPE_COLLECTION,
        ).length > 0;

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
                {!!hasCollectionsAmongSelectedRecords && (
                    <Grid item xs={12}>
                        <Alert
                            alertId="collection-alert-warning-create-or-update-doi"
                            {...txt.createOrUpdateDoiForm.collectionAlert}
                        />
                    </Grid>
                )}
                <Grid item xs={12} sm={6}>
                    <Button
                        aria-label={txt.createOrUpdateDoiForm.formLabels.cancelButtonLabel}
                        children={txt.createOrUpdateDoiForm.formLabels.cancelButtonLabel}
                        data-analyticsid="create-or-update-doi-cancel"
                        data-testid="create-or-update-doi-cancel"
                        disabled={submitting}
                        fullWidth
                        id="create-or-update-doi-cancel"
                        onClick={onCancel}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        aria-label={txt.createOrUpdateDoiForm.formLabels.submitButtonLabel}
                        children={txt.createOrUpdateDoiForm.formLabels.submitButtonLabel}
                        color="primary"
                        data-analyticsid="create-or-update-doi-submit"
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
