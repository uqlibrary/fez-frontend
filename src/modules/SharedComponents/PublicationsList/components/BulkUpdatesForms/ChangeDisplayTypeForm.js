import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@mui/material/GridLegacy';
import Button from '@mui/material/Button';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { DocumentTypeSingleField, PublicationSubtypeField } from 'modules/SharedComponents/PublicationSubtype';
import { locale } from 'locale';
import { validation } from 'config';
import { usePublicationSubtype } from 'hooks';
import { changeDisplayType } from 'actions';
import { useValidatedForm } from 'hooks';
import { Field } from '../../../Toolbox/ReactHookForm';
import { useWatch } from 'react-hook-form';

export const ChangeDisplayTypeForm = ({ onCancel, recordsSelected }) => {
    const dispatch = useDispatch();
    const txt = locale.components.bulkUpdates.bulkUpdatesForms;

    const {
        control,
        safelyHandleSubmit,
        setValue,
        formState: { isSubmitting, isSubmitSuccessful, serverError, hasServerError, hasError },
    } = useValidatedForm({
        defaultValues: {
            rek_display_type: null,
            rek_subtype: null,
        },
    });

    const displayType = useWatch({ control, name: 'rek_display_type' });
    const subtypes = usePublicationSubtype(displayType || null, true);

    // handles displayType changes
    useEffect(() => {
        setValue('rek_subtype', null);
    }, [displayType, setValue]);

    useEffect(() => {
        if (!isSubmitSuccessful) return;
        setTimeout(onCancel, 2000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitSuccessful]);

    const onSubmit = safelyHandleSubmit(
        async data => await dispatch(changeDisplayType(Object.values(recordsSelected), data, true)),
    );

    return (
        <form data-testid="change-display-type-form" id="change-display-type-form">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert alertId="alert-info-change-display-type" {...txt.changeDisplayTypeForm.alert} />
                </Grid>
                <Grid item xs={12}>
                    <Field
                        control={control}
                        component={DocumentTypeSingleField}
                        disabled={isSubmitting || isSubmitSuccessful}
                        genericSelectFieldId="rek-display-type"
                        label={txt.changeDisplayTypeForm.formLabels.displayType}
                        name="rek_display_type"
                        required
                        validate={[validation.required]}
                    />
                </Grid>
                {!!displayType && subtypes.length > 0 && (
                    <Grid item xs={12}>
                        <Field
                            control={control}
                            component={PublicationSubtypeField}
                            displayType={!!displayType && displayType}
                            disabled={isSubmitting || isSubmitSuccessful}
                            label={txt.changeDisplayTypeForm.formLabels.subtype}
                            name="rek_subtype"
                            required
                            validate={[validation.required]}
                        />
                    </Grid>
                )}
                <Grid item xs={12} sm={6}>
                    <Button
                        aria-label={txt.changeDisplayTypeForm.formLabels.cancelButtonLabel}
                        children={txt.changeDisplayTypeForm.formLabels.cancelButtonLabel}
                        data-analyticsid="change-display-type-cancel"
                        data-testid="change-display-type-cancel"
                        disabled={isSubmitting}
                        fullWidth
                        id="change-display-type-cancel"
                        onClick={onCancel}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        aria-label={txt.changeDisplayTypeForm.formLabels.submitButtonLabel}
                        children={txt.changeDisplayTypeForm.formLabels.submitButtonLabel}
                        color="primary"
                        data-analyticsid="change-display-type-submit"
                        data-testid="change-display-type-submit"
                        disabled={hasError || isSubmitting || isSubmitSuccessful}
                        fullWidth
                        id="change-display-type-submit"
                        onClick={onSubmit}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12}>
                    {isSubmitting && (
                        <Alert
                            alertId="alert-info-change-display-type"
                            {...txt.changeDisplayTypeForm.submittingAlert}
                        />
                    )}
                    {isSubmitSuccessful && (
                        <Alert alertId="alert-done-change-display-type" {...txt.changeDisplayTypeForm.successAlert} />
                    )}
                    {hasServerError && (
                        <Alert alertId="alert-error-change-display-type" {...txt.changeDisplayTypeForm.errorAlert}>
                            {serverError}
                        </Alert>
                    )}
                </Grid>
            </Grid>
        </form>
    );
};

ChangeDisplayTypeForm.propTypes = {
    onCancel: PropTypes.func,
    recordsSelected: PropTypes.object,
};

export default React.memo(ChangeDisplayTypeForm);
