import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { CollectionField } from 'modules/SharedComponents/LookupFields';
import { locale } from 'locale';
import { validation } from 'config';
import { copyToOrRemoveFromCollection } from 'actions';
import { useValidatedForm } from 'hooks';
import { Field } from '../../../Toolbox/ReactHookForm';
import { useWatch } from 'react-hook-form';

export const CopyToOrRemoveFromCollectionForm = ({ isRemoveFrom, onCancel, recordsSelected }) => {
    const dispatch = useDispatch();
    const txt = locale.components.bulkUpdates.bulkUpdatesForms;
    const records = useRef(
        Object.values(recordsSelected)?.map?.(record =>
            record.fez_record_search_key_ismemberof.map(collection => collection.rek_ismemberof),
        ),
    );
    const [alertUser, setAlertUser] = useState(null);
    const {
        control,
        safelyHandleSubmit,
        formState: { isSubmitting, isSubmitSuccessful, serverError, hasServerError, hasError },
    } = useValidatedForm();
    const collections = useWatch({ control, name: 'collections' });
    const idText = isRemoveFrom ? 'remove-from' : 'copy-to';

    useEffect(() => {
        if (isRemoveFrom) {
            const collectionsSet = Immutable.Set(
                (!!collections && collections.map(collection => collection.rek_pid)) || [],
            );
            setAlertUser(
                records.current.filter(recordCollections =>
                    collectionsSet.isSuperset(Immutable.Set(recordCollections).sort()),
                ).length > 0,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collections]);

    useEffect(() => {
        if (!isSubmitSuccessful) return;
        setTimeout(onCancel, 2000);
    }, [isSubmitSuccessful, onCancel]);

    const onSubmit = safelyHandleSubmit(async data => {
        await dispatch(copyToOrRemoveFromCollection(Object.values(recordsSelected), data, isRemoveFrom));
    });

    const hasACollectionSelected = Object.entries(recordsSelected).some(i => i[1].rek_object_type === 2);

    return (
        <form data-testid={`${idText}-collection-form`} id={`${idText}-collection-form`}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert
                        alertId={`alert-info-${idText}-collection`}
                        {...txt.copyToOrRemoveFromCollectionForm.alert(isRemoveFrom)}
                    />
                </Grid>
                {hasACollectionSelected && (
                    <Grid item xs={12}>
                        <Alert
                            alertId={`alert-info-${idText}-collection-notallowed`}
                            {...txt.copyToOrRemoveFromCollectionForm.onlyRecordsAllowed}
                        />
                    </Grid>
                )}
                {!!alertUser && (
                    <Grid item xs={12}>
                        <Alert
                            alertId={`alert-warning-${idText}-collection`}
                            {...txt.copyToOrRemoveFromCollectionForm.warningAlert}
                        />
                    </Grid>
                )}
                {!hasACollectionSelected && (
                    <Grid item xs={12}>
                        <Field
                            control={control}
                            component={CollectionField}
                            collectionFieldId="rek-ismemberof"
                            disabled={isSubmitting || isSubmitSuccessful}
                            floatingLabelText={txt.copyToOrRemoveFromCollectionForm.formLabels.collection}
                            fullWidth
                            name="collections"
                            required
                            validate={[validation.requiredList]}
                            {...locale.components.selectField.collection}
                        />
                    </Grid>
                )}
                <Grid item xs={12} sm={6}>
                    <Button
                        aria-label={txt.copyToOrRemoveFromCollectionForm.formLabels.cancelButtonLabel}
                        children={txt.copyToOrRemoveFromCollectionForm.formLabels.cancelButtonLabel}
                        data-analyticsid={`${idText}-collection-cancel`}
                        data-testid={`${idText}-collection-cancel`}
                        disabled={isSubmitting}
                        fullWidth
                        id={`${idText}-collection-cancel`}
                        onClick={onCancel}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        aria-label={txt.copyToOrRemoveFromCollectionForm.formLabels.submitButtonLabel}
                        children={txt.copyToOrRemoveFromCollectionForm.formLabels.submitButtonLabel}
                        color="primary"
                        data-analyticsid={`${idText}-collection-submit`}
                        data-testid={`${idText}-collection-submit`}
                        disabled={
                            hasError || isSubmitting || isSubmitSuccessful || !!alertUser || !!hasACollectionSelected
                        }
                        fullWidth
                        id={`${idText}-collection-submit`}
                        onClick={onSubmit}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12}>
                    {isSubmitting && (
                        <Alert
                            alertId={`alert-info-${idText}-collection`}
                            {...txt.copyToOrRemoveFromCollectionForm.submittingAlert(isRemoveFrom)}
                        />
                    )}
                    {isSubmitSuccessful && (
                        <Alert
                            alertId={`alert-done-${idText}-collection`}
                            {...txt.copyToOrRemoveFromCollectionForm.successAlert(isRemoveFrom)}
                        />
                    )}
                    {hasServerError && (
                        <Alert
                            alertId={`alert-error-${idText}-collection`}
                            {...txt.copyToOrRemoveFromCollectionForm.errorAlert(isRemoveFrom)}
                        >
                            {serverError}
                        </Alert>
                    )}
                </Grid>
            </Grid>
        </form>
    );
};

CopyToOrRemoveFromCollectionForm.propTypes = {
    isRemoveFrom: PropTypes.bool,
    onCancel: PropTypes.func,
    recordsSelected: PropTypes.object,
};

export default React.memo(CopyToOrRemoveFromCollectionForm);
