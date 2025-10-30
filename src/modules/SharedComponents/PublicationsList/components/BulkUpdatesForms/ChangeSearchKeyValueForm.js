import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useValidatedForm } from 'hooks';
import { Field } from '../../../Toolbox/ReactHookForm';
import Grid from '@mui/material/GridLegacy';
import Button from '@mui/material/Button';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import SearchKeyField, { getSearchKeyValueField } from './SearchKeyField';
import { locale } from 'locale';
import { validation } from 'config';
import { changeSearchKeyValue } from 'actions';
import { useWatch } from 'react-hook-form';

export const CreateOrUpdateDoiForm = ({ onCancel, recordsSelected }) => {
    const dispatch = useDispatch();
    const txt = locale.components.bulkUpdates.bulkUpdatesForms;
    const prevSearchKey = useRef(null);

    const {
        control,
        setValue,
        unregister,
        safelyHandleSubmit,
        formState: { isSubmitting, isSubmitSuccessful, hasServerError, hasError },
    } = useValidatedForm({ defaultValues: { search_key: null } });
    const searchKey = useWatch({ control, name: 'search_key' });

    const onSubmit = safelyHandleSubmit(
        async data => await dispatch(changeSearchKeyValue(Object.values(recordsSelected), data)),
    );

    // handle search key changes - remove old field and validate added one
    useEffect(() => {
        const prev = prevSearchKey.current;
        prevSearchKey.current = searchKey;
        if (!prev) return;

        unregister(prev);
        setValue(searchKey, null);
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [searchKey]);

    useEffect(() => {
        if (!isSubmitSuccessful) return;
        setTimeout(onCancel, 2000);
    }, [isSubmitSuccessful, onCancel]);

    return (
        <form data-testid="change-search-key-value-form" id="change-search-key-value-form">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Field
                        control={control}
                        component={SearchKeyField}
                        disabled={isSubmitting || isSubmitSuccessful}
                        genericSelectFieldId="search-key"
                        label={txt.changeSearchKeyValueForm.formLabels.searchKey}
                        name="search_key"
                        required
                        validate={[validation.required]}
                    />
                </Grid>
                {!!searchKey && (
                    <React.Fragment>
                        <Grid item xs={12}>
                            <Field
                                control={control}
                                component={getSearchKeyValueField(searchKey).component}
                                disabled={isSubmitting || isSubmitSuccessful}
                                label={txt.changeSearchKeyValueForm.formLabels.searchKeyValue}
                                name={searchKey}
                                required
                                validate={[validation.required]}
                                {...getSearchKeyValueField(searchKey).componentProps}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                control={control}
                                component={TextField}
                                fullWidth
                                textFieldId="edit-reason"
                                disabled={isSubmitting || isSubmitSuccessful}
                                label={txt.changeSearchKeyValueForm.formLabels.editNotes}
                                name="edit_reason"
                                multiline
                                rows={3}
                            />
                        </Grid>
                    </React.Fragment>
                )}
                <Grid item xs={12} sm={6}>
                    <Button
                        aria-label={txt.changeSearchKeyValueForm.formLabels.cancelButtonLabel}
                        children={txt.changeSearchKeyValueForm.formLabels.cancelButtonLabel}
                        data-analyticsid="change-search-key-value-cancel"
                        data-testid="change-search-key-value-cancel"
                        disabled={isSubmitting}
                        fullWidth
                        id="change-search-key-value-cancel"
                        onClick={onCancel}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        aria-label={txt.changeSearchKeyValueForm.formLabels.submitButtonLabel}
                        children={txt.changeSearchKeyValueForm.formLabels.submitButtonLabel}
                        color="primary"
                        data-analyticsid="change-search-key-value-submit"
                        data-testid="change-search-key-value-submit"
                        disabled={hasError || isSubmitting || isSubmitSuccessful}
                        fullWidth
                        id="change-search-key-value-submit"
                        onClick={onSubmit}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12}>
                    {!!isSubmitting && (
                        <Alert
                            alertId="alert-info-change-search-key-value"
                            {...txt.changeSearchKeyValueForm.submittingAlert}
                        />
                    )}
                    {!!isSubmitSuccessful && (
                        <Alert
                            alertId="alert-done-change-search-key-value"
                            {...txt.changeSearchKeyValueForm.successAlert}
                        />
                    )}
                    {!!hasServerError && (
                        <Alert
                            alertId="alert-error-change-search-key-value"
                            {...txt.changeSearchKeyValueForm.errorAlert}
                        />
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
