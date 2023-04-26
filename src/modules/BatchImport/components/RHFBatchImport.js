// import React, { useEffect, useState } from 'react';
import React, { useEffect } from 'react';
// import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';

import { CSV_INGEST_DOCUMENT_TYPES } from 'config/general';
import { createBatchImport } from 'actions';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { RHFDocumentTypeSingleField } from 'modules/SharedComponents/PublicationSubtype';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import {
    RHFCollectionSelectField,
    RHFCommunitySelectField,
    RHFDirectorySelectField,
} from 'modules/SharedComponents/SelectFields';

// import { validation, publicationTypes } from 'config';
import { publicationTypes } from 'config';
import { pathConfig } from 'config/pathConfig';
import { default as componentsLocale } from 'locale/components';
import validationErrors from 'locale/validationErrors';
// import { default as publicationLocale } from 'locale/publicationForm';
import { Controller, FormProvider, useForm } from 'react-hook-form';

const csvIngestDoctypesList = Object.values(publicationTypes(false))
    .filter(item => CSV_INGEST_DOCUMENT_TYPES.includes(item.id))
    .map(item => ({
        value: item.id,
        text: item.name,
    }));

export const BatchImport = ({ history }) => {
    const dispatch = useDispatch();
    const methods = useForm({ mode: 'onChange' });
    const batchImportTxt = componentsLocale.components.digiTeam.batchImport;
    const communityID = methods.watch('communityID');
    const isBulkFileIngest = methods.watch('is_bulk_file_ingest');
    const disableSubmit = !!methods.formState.errors && Object.keys(methods.formState.errors).length > 0;

    // manually trigger validation on initial render to display the validation errors
    useEffect(() => {
        methods.trigger();
    }, [methods]);
    /*
    useEffect(() => {
        const alertProps = validation.getErrorAlertProps({
            alertLocale: {
                validationAlert: { ...publicationLocale.validationAlert },
                progressAlert: { ...batchImportTxt.submitProgressAlert },
                successAlert: { ...batchImportTxt.submitSuccessAlert },
                errorAlert: { ...batchImportTxt.submitFailureAlert },
            },
            error,
            errors,
            isSubmitSuccessful,
            isSubmitting,
        });
        const actionProps = isSubmitSuccessful
            ? {
                  actionButtonLabel: batchImportTxt.postSubmitPrompt.confirmButtonLabel,
                  action: reset,
              }
            : {};

    }, [batchImportTxt, errors, reset, isSubmitSuccessful, isSubmitting]);
*/
    const _abandonImport = () => {
        history.push(pathConfig.index);
    };

    const onSubmit = data => {
        console.log(data);
        return dispatch(createBatchImport(data));
    };

    return (
        <StandardPage title={batchImportTxt.title}>
            <FormProvider {...methods}>
                <ConfirmDiscardFormChanges
                    dirty={methods.formState.isDirty}
                    submitSucceeded={methods.formState.isSubmitSuccessful}
                >
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <StandardCard help={batchImportTxt.help}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Controller
                                                control={methods.control}
                                                name="is_bulk_file_ingest"
                                                defaultValue={false}
                                                render={({ field: { onChange, value } }) => (
                                                    <FormControlLabel
                                                        control={<Switch value={value} onChange={onChange} />}
                                                        {...batchImportTxt.formLabels.bulkFileIngest}
                                                    />
                                                )}
                                                disabled={methods.formState.isSubmitting}
                                                id="is-bulk-file-ingest-input"
                                                data-testid="is-bulk-file-ingest-input"
                                            />
                                        </Grid>
                                        {!isBulkFileIngest && (
                                            <Grid item xs={12}>
                                                <Controller
                                                    control={methods.control}
                                                    defaultValue=""
                                                    render={({ field: { value, onChange }, fieldState }) => (
                                                        <RHFCommunitySelectField
                                                            value={value}
                                                            onChange={onChange}
                                                            {...fieldState}
                                                            genericSelectFieldId="community-pid"
                                                            {...batchImportTxt.formLabels.community}
                                                        />
                                                    )}
                                                    disabled={methods.formState.isSubmitting}
                                                    id="communityPID"
                                                    name="communityID"
                                                    rules={{ required: validationErrors.validationErrors.required }}
                                                />
                                            </Grid>
                                        )}
                                        {!isBulkFileIngest && !!communityID && (
                                            <Grid item xs={12}>
                                                <Controller
                                                    defaultValue=""
                                                    render={({ field: { value, onChange }, fieldState }) => (
                                                        <RHFCollectionSelectField
                                                            communityId={communityID}
                                                            value={value}
                                                            onChange={onChange}
                                                            genericSelectFieldId="collection-pid"
                                                            {...fieldState}
                                                            {...batchImportTxt.formLabels.collection}
                                                        />
                                                    )}
                                                    disabled={methods.formState.isSubmitting}
                                                    id="collectionPID"
                                                    name="collection_pid"
                                                    rules={{ required: validationErrors.validationErrors.required }}
                                                />
                                            </Grid>
                                        )}
                                        {!isBulkFileIngest && (
                                            <Grid item xs={12}>
                                                <Controller
                                                    defaultValue=""
                                                    render={({ field: { value, onChange }, fieldState }) => (
                                                        <RHFDocumentTypeSingleField
                                                            value={value}
                                                            onChange={onChange}
                                                            {...fieldState}
                                                            {...batchImportTxt.formLabels.docType}
                                                        />
                                                    )}
                                                    disabled={methods.formState.isSubmitting}
                                                    id="doctypeID"
                                                    name="doc_type_id"
                                                    rules={{ required: validationErrors.validationErrors.required }}
                                                    itemsList={csvIngestDoctypesList}
                                                />
                                            </Grid>
                                        )}
                                        <Grid item xs={12}>
                                            <Controller
                                                defaultValue=""
                                                render={({ field: { value, onChange }, fieldState }) => (
                                                    <RHFDirectorySelectField
                                                        value={value}
                                                        onChange={onChange}
                                                        genericSelectFieldId="directory"
                                                        {...fieldState}
                                                        {...batchImportTxt.formLabels.directory}
                                                    />
                                                )}
                                                disabled={methods.formState.isSubmitting}
                                                id="directory"
                                                name="directory"
                                                rules={{ required: validationErrors.validationErrors.required }}
                                            />
                                        </Grid>
                                    </Grid>
                                </StandardCard>
                            </Grid>
                            {methods.formState.errors && (
                                <Grid item xs={12}>
                                    <Alert alertId="batch-import-validation" {...methods.formState.errors} />
                                </Grid>
                            )}
                            <Grid item xs={false} sm />
                            <Grid item xs={12} sm="auto">
                                <Button
                                    aria-label={batchImportTxt.formLabels.cancelButtonLabel}
                                    children={batchImportTxt.formLabels.cancelButtonLabel}
                                    data-testid="batch-import-cancel"
                                    disabled={methods.formState.isSubmitting}
                                    fullWidth
                                    id="cancelBatchImport"
                                    onClick={_abandonImport}
                                    variant="contained"
                                    color={'default'}
                                />
                            </Grid>
                            <Grid item xs={12} sm="auto">
                                <Button
                                    aria-label={batchImportTxt.formLabels.submitButtonLabel}
                                    children={batchImportTxt.formLabels.submitButtonLabel}
                                    color="primary"
                                    data-testid="batch-import-submit"
                                    disabled={
                                        methods.formState.isSubmitting ||
                                        methods.formState.isSubmitSuccessful ||
                                        disableSubmit
                                    }
                                    fullWidth
                                    id="submitBatchImport"
                                    variant="contained"
                                    type="submit"
                                />
                            </Grid>
                        </Grid>
                    </form>
                </ConfirmDiscardFormChanges>
            </FormProvider>
        </StandardPage>
    );
};

BatchImport.propTypes = {
    history: PropTypes.object,
};

export default React.memo(BatchImport);
