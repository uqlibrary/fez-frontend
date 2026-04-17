import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import Grid from '@mui/material/GridLegacy';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';

import { CSV_INGEST_DOCUMENT_TYPES } from 'config/general';
import { createBatchImport } from 'actions';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { DocumentTypeSingleField } from 'modules/SharedComponents/PublicationSubtype';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import {
    CollectionSelectField,
    CommunitySelectField,
    DirectorySelectField,
} from 'modules/SharedComponents/SelectFields';

import { validation, publicationTypes } from 'config';
import { pathConfig } from 'config/pathConfig';
import { default as componentsLocale } from 'locale/components';
import { default as publicationLocale } from 'locale/publicationForm';
import { useNavigate } from 'react-router';
import { Controller } from '../../SharedComponents/Toolbox/ReactHookForm';
import { useValidatedForm } from '../../../hooks';

const csvIngestDoctypesList = Object.values(publicationTypes(false))
    .filter(item => CSV_INGEST_DOCUMENT_TYPES.includes(item.id))
    .map(item => ({
        value: item.id,
        text: item.name,
    }));

export const BatchImport = () => {
    const navigate = useNavigate();
    const [validationErrors, setValidationErrors] = useState(null);
    const batchImportTxt = componentsLocale.components.digiTeam.batchImport;
    const dispatch = useDispatch();
    const defaultValues = {
        is_bulk_file_ingest: false,
        communityID: '',
        collection_pid: '',
        doc_type_id: '',
        directory: '',
    };

    const {
        reset,
        trigger,
        control,
        resetField,
        getPropsForAlert,
        safelyHandleSubmit,
        formState: { errors, isDirty, isSubmitting, isSubmitSuccessful },
    } = useValidatedForm({
        mode: 'onChange',
        defaultValues,
    });
    const [isBulkFileIngest, communityID] = useWatch({ control, name: ['is_bulk_file_ingest', 'communityID'] });
    const hasErrors = Object.keys(errors).length > 0;

    const onSubmit = safelyHandleSubmit(async data => {
        let payload = data;
        // remove unnecessary fields from payload when "bulk file/edit ingest" mode is on
        if (data.is_bulk_file_ingest) {
            payload = {
                is_bulk_file_ingest: data.is_bulk_file_ingest,
                directory: data.directory,
            };
        }
        await dispatch(createBatchImport(payload));
    });

    // re-validate the form upon toggling "bulk file/edit ingest" option, to make sure that the
    // alert box (at the bottom of the form) displays a summary of errors for visible form fields only
    useLayoutEffect(() => {
        (async () => await trigger())();
    }, [trigger, isBulkFileIngest]);

    // display validation error for collection field when changing community
    useLayoutEffect(() => {
        resetField('collection_pid', { defaultValue: '', keepDirty: false, keepError: true, keepTouched: false });
        (async () => await trigger('collection_pid'))();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [communityID]);

    useEffect(() => {
        const alertProps = validation.getErrorAlertProps({
            alertLocale: {
                validationAlert: { ...publicationLocale.validationAlert },
                progressAlert: { ...batchImportTxt.submitProgressAlert },
                successAlert: { ...batchImportTxt.submitSuccessAlert },
                errorAlert: { ...batchImportTxt.submitFailureAlert },
            },
            ...getPropsForAlert(),
            submitSucceeded: isSubmitSuccessful,
            submitting: isSubmitting,
        });
        const actionProps = isSubmitSuccessful
            ? {
                  actionButtonLabel: batchImportTxt.postSubmitPrompt.confirmButtonLabel,
                  action: () => reset(),
              }
            : {};

        setValidationErrors(
            alertProps
                ? {
                      ...alertProps,
                      ...actionProps,
                  }
                : null,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(errors), isSubmitSuccessful, isSubmitting]);

    const abandonImport = () => {
        navigate(pathConfig.index);
    };

    return (
        <StandardPage title={batchImportTxt.title}>
            <ConfirmDiscardFormChanges dirty={isDirty} submitSucceeded={isSubmitSuccessful}>
                <form onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <StandardCard help={batchImportTxt.help}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="is_bulk_file_ingest"
                                            control={control}
                                            render={({ field }) => (
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            {...field}
                                                            checked={field.value}
                                                            onChange={e => field.onChange(e.target.checked)}
                                                        />
                                                    }
                                                    disabled={isSubmitting}
                                                    id="is-bulk-file-ingest-input"
                                                    data-testid="is-bulk-file-ingest-input"
                                                    {...batchImportTxt.formLabels.bulkFileIngest}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    {!isBulkFileIngest && (
                                        <Grid item xs={12}>
                                            <Controller
                                                name="communityID"
                                                control={control}
                                                rules={{ validate: validation.required }}
                                                render={({ field }) => (
                                                    <CommunitySelectField
                                                        {...field}
                                                        genericSelectFieldId="community-pid"
                                                        disabled={isSubmitting}
                                                        id="communityPID"
                                                        required
                                                        {...batchImportTxt.formLabels.community}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    )}
                                    {!isBulkFileIngest && !!communityID && (
                                        <Grid item xs={12}>
                                            <Controller
                                                name="collection_pid"
                                                control={control}
                                                rules={{ validate: validation.required }}
                                                render={({ field }) => (
                                                    <CollectionSelectField
                                                        {...field}
                                                        disabled={isSubmitting}
                                                        id="collectionPID"
                                                        genericSelectFieldId="collection-pid"
                                                        communityId={communityID}
                                                        required
                                                        {...batchImportTxt.formLabels.collection}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    )}
                                    {!isBulkFileIngest && (
                                        <Grid item xs={12}>
                                            <Controller
                                                name="doc_type_id"
                                                control={control}
                                                rules={{ validate: validation.required }}
                                                render={({ field }) => {
                                                    return (
                                                        <DocumentTypeSingleField
                                                            {...field}
                                                            disabled={isSubmitting}
                                                            id="doctypeID"
                                                            required
                                                            itemsList={csvIngestDoctypesList}
                                                            {...batchImportTxt.formLabels.docType}
                                                        />
                                                    );
                                                }}
                                            />
                                        </Grid>
                                    )}
                                    <Grid item xs={12}>
                                        <Controller
                                            name="directory"
                                            control={control}
                                            rules={{
                                                validate: validation.required,
                                            }}
                                            render={({ field }) => (
                                                <DirectorySelectField
                                                    {...field}
                                                    genericSelectFieldId="directory"
                                                    disabled={isSubmitting}
                                                    id="directory"
                                                    required
                                                    {...batchImportTxt.formLabels.directory}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        {validationErrors && (
                            <Grid item xs={12}>
                                <Alert alertId="batch-import-validation" {...validationErrors} />
                            </Grid>
                        )}
                        <Grid item xs={false} sm />
                        <Grid item xs={12} sm="auto">
                            <Button
                                aria-label={batchImportTxt.formLabels.cancelButtonLabel}
                                children={batchImportTxt.formLabels.cancelButtonLabel}
                                data-analyticsid="batch-import-cancel"
                                data-testid="batch-import-cancel"
                                disabled={isSubmitting}
                                fullWidth
                                id="cancelBatchImport"
                                onClick={abandonImport}
                                variant="contained"
                                color={'default'}
                            />
                        </Grid>
                        <Grid item xs={12} sm="auto">
                            <Button
                                type="submit"
                                aria-label={batchImportTxt.formLabels.submitButtonLabel}
                                children={batchImportTxt.formLabels.submitButtonLabel}
                                color="primary"
                                data-analyticsid="batch-import-submit"
                                data-testid="batch-import-submit"
                                disabled={isSubmitting || isSubmitSuccessful || hasErrors}
                                fullWidth
                                id="submitBatchImport"
                                variant="contained"
                            />
                        </Grid>
                    </Grid>
                </form>
            </ConfirmDiscardFormChanges>
        </StandardPage>
    );
};

export default React.memo(BatchImport);
