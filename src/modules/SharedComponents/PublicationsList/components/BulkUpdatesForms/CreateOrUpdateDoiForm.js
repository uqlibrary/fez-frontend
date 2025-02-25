import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { locale } from 'locale';
import { createOrUpdateDoi } from 'actions';
import { RECORD_TYPE_COLLECTION } from '../../../../../config/general';
import { useDispatch } from 'react-redux';
import { useForm } from 'hooks';

export const CreateOrUpdateDoiForm = ({ onCancel, recordsSelected }) => {
    const dispatch = useDispatch();
    const {
        safelyHandleSubmit,
        formState: { hasError, isSubmitting, isSubmitSuccessful },
    } = useForm();
    const txt = locale.components.bulkUpdates.bulkUpdatesForms;
    const hasCollectionsAmongSelectedRecords =
        Object.values(recordsSelected).filter(
            record =>
                !!record &&
                !!record.rek_object_type_lookup &&
                record.rek_object_type_lookup.toLowerCase() === RECORD_TYPE_COLLECTION,
        ).length > 0;

    React.useEffect(() => {
        if (!isSubmitSuccessful) return;
        setTimeout(onCancel, 2000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitSuccessful]);

    const handleSubmit = safelyHandleSubmit(() => dispatch(createOrUpdateDoi(Object.values(recordsSelected))));

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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting || isSubmitSuccessful}
                        fullWidth
                        id="create-or-update-doi-submit"
                        onClick={handleSubmit}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12}>
                    {!!isSubmitting && (
                        <Alert
                            alertId="alert-info-create-or-update-doi"
                            {...txt.createOrUpdateDoiForm.submittingAlert}
                        />
                    )}
                    {!!isSubmitSuccessful && (
                        <Alert alertId="alert-done-create-or-update-doi" {...txt.createOrUpdateDoiForm.successAlert} />
                    )}
                    {!!hasError && (
                        <Alert alertId="alert-error-create-or-update-doi" {...txt.createOrUpdateDoiForm.errorAlert} />
                    )}
                </Grid>
            </Grid>
        </form>
    );
};

CreateOrUpdateDoiForm.propTypes = {
    onCancel: PropTypes.func,
    recordsSelected: PropTypes.object,
};

export default React.memo(CreateOrUpdateDoiForm);
