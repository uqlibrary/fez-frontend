// import React, { useEffect, useState } from 'react';
import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { Field, Form } from 'react-final-form';

import Grid from '@mui/material/Grid';
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
// import { default as publicationLocale } from 'locale/publicationForm';

const csvIngestDoctypesList = Object.values(publicationTypes(false))
    .filter(item => CSV_INGEST_DOCUMENT_TYPES.includes(item.id))
    .map(item => ({
        value: item.id,
        text: item.name,
    }));

// eslint-disable-next-line react/prop-types
const Condition = ({ when, is, children }) => (
    <Field name={when} subscription={{ value: true }}>
        {({ input: { value } }) => (value === is ? children : null)}
    </Field>
);

export const BatchImport = ({ history }) => {
    // const [validationErrors, setValidationErrors] = useState(null);
    const batchImportTxt = componentsLocale.components.digiTeam.batchImport;
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
            formErrors,
            submitSucceeded,
            submitting,
        });
        const actionProps = submitSucceeded
            ? {
                  actionButtonLabel: batchImportTxt.postSubmitPrompt.confirmButtonLabel,
                  action: reset,
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
    }, [batchImportTxt, error, formErrors, reset, submitSucceeded, submitting]);
    */

    const dispatch = useDispatch();
    const onSubmit = values => {
        return dispatch(createBatchImport(values));
    };

    const _abandonImport = () => {
        history.push(pathConfig.index);
    };

    return (
        <StandardPage title={batchImportTxt.title}>
            <Form onSubmit={onSubmit} initialValues={{ is_bulk_file_ingest: false }}>
                {({ handleSubmit, submitting, submitSucceeded, errors, dirty, invalid, values }) => (
                    <ConfirmDiscardFormChanges dirty={dirty} submitSucceeded={submitSucceeded}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <StandardCard help={batchImportTxt.help}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Field
                                                    component={props => (
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    {...props}
                                                                    name="checkedB"
                                                                    // eslint-disable-next-line react/prop-types
                                                                    onChange={props.input.onChange}
                                                                />
                                                            }
                                                            {...batchImportTxt.formLabels.bulkFileIngest}
                                                        />
                                                    )}
                                                    disabled={submitting}
                                                    id="is-bulk-file-ingest-input"
                                                    data-testid="is-bulk-file-ingest-input"
                                                    name="is_bulk_file_ingest"
                                                    required
                                                />
                                            </Grid>
                                            <Condition when="is_bulk_file_ingest" is={false}>
                                                <Grid item xs={12}>
                                                    <Field
                                                        component={CommunitySelectField}
                                                        genericSelectFieldId="community-pid"
                                                        disabled={submitting}
                                                        id="communityPID"
                                                        name="communityID"
                                                        required
                                                        validate={validation.required}
                                                        {...batchImportTxt.formLabels.community}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Field
                                                        component={CollectionSelectField}
                                                        disabled={submitting}
                                                        id="collectionPID"
                                                        name="collection_pid"
                                                        genericSelectFieldId="collection-pid"
                                                        required
                                                        validate={validation.required}
                                                        {...batchImportTxt.formLabels.collection}
                                                    />
                                                </Grid>
                                            </Condition>

                                            <Condition when="is_bulk_file_ingest" is="false">
                                                <Grid item xs={12}>
                                                    <Field
                                                        component={DocumentTypeSingleField}
                                                        disabled={submitting}
                                                        id="doctypeID"
                                                        name="doc_type_id"
                                                        required
                                                        validate={validation.required}
                                                        itemsList={csvIngestDoctypesList}
                                                        {...batchImportTxt.formLabels.docType}
                                                    />
                                                </Grid>
                                            </Condition>
                                            <Grid item xs={12}>
                                                <Field
                                                    component={DirectorySelectField}
                                                    genericSelectFieldId="directory"
                                                    disabled={submitting}
                                                    id="directory"
                                                    name="directory"
                                                    required
                                                    validate={validation.required}
                                                    {...batchImportTxt.formLabels.directory}
                                                />
                                            </Grid>
                                        </Grid>
                                    </StandardCard>
                                </Grid>
                                <pre>{JSON.stringify(values)}</pre>
                                {errors && (
                                    <Grid item xs={12}>
                                        <Alert alertId="batch-import-validation" {...errors} />
                                    </Grid>
                                )}
                                <Grid item xs={false} sm />
                                <Grid item xs={12} sm="auto">
                                    <Button
                                        aria-label={batchImportTxt.formLabels.cancelButtonLabel}
                                        children={batchImportTxt.formLabels.cancelButtonLabel}
                                        data-testid="batch-import-cancel"
                                        disabled={submitting}
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
                                        disabled={submitting || submitSucceeded || invalid}
                                        fullWidth
                                        id="submitBatchImport"
                                        onClick={handleSubmit}
                                        variant="contained"
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </ConfirmDiscardFormChanges>
                )}
            </Form>
        </StandardPage>
    );
};

BatchImport.propTypes = {
    history: PropTypes.object,
};

export default React.memo(BatchImport);
