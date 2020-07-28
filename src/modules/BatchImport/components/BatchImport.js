import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/lib/immutable';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { CommunitiesSelectField, DocumentTypeSingleField } from 'modules/SharedComponents/PublicationSubtype';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import DirectorySelectField from '../containers/DirectorySelectField';
import CollectionSelectField from '../containers/CollectionSelectField';
import { useFormErrorsContext } from 'context';

import { validation } from 'config';
import { pathConfig } from 'config/routes';
import { default as componentsLocale } from 'locale/components';
import { default as publicationLocale } from 'locale/publicationForm';

export const FORM_NAME = 'BatchImport';
export const BatchImport = ({
    communityID,
    dirty,
    disableSubmit,
    handleSubmit,
    history,
    loadItemsList,
    reset,
    resetCollectionField,
    submitSucceeded,
    submitting,
}) => {
    const [validationErrors, setValidationErrors] = useState(null);
    const batchImportTxt = componentsLocale.components.digiTeam.batchImport;

    const { formErrors } = useFormErrorsContext();

    useEffect(() => {
        // Branch tested in cypress
        /* istanbul ignore next */
        communityID && loadItemsList(communityID);
    }, [communityID, loadItemsList]);

    useEffect(() => {
        const alertProps = validation.getErrorAlertProps({
            alertLocale: {
                validationAlert: { ...publicationLocale.validationAlert },
                progressAlert: { ...batchImportTxt.submitProgressAlert },
                successAlert: { ...batchImportTxt.submitSuccessAlert },
                errorAlert: { ...batchImportTxt.submitFailureAlert },
            },
            formErrors,
            submitSucceeded,
            submitting,
        });
        const actionProps = submitSucceeded /* istanbul ignore next */ // Branch tested in cypress
            ? {
                  actionButtonLabel: batchImportTxt.postSubmitPrompt.confirmButtonLabel,
                  action: reset,
              }
            : {};

        setValidationErrors(
            alertProps /* istanbul ignore next */ // Branch tested in cypress
                ? {
                      ...alertProps,
                      ...actionProps,
                  }
                : null,
        );
    }, [batchImportTxt, formErrors, reset, submitSucceeded, submitting]);

    const _abandonImport = () => {
        history.push(pathConfig.index);
    };

    return (
        <StandardPage title={batchImportTxt.title}>
            <ConfirmDiscardFormChanges dirty={dirty} submitSucceeded={submitSucceeded}>
                <form>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <StandardCard help={batchImportTxt.help}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={CommunitiesSelectField}
                                            communitiesSelectFieldId="community-pid"
                                            disabled={submitting}
                                            error={formErrors.communityID}
                                            id="communityPID"
                                            name="communityID"
                                            onChange={resetCollectionField}
                                            required
                                            validate={[validation.required]}
                                            {...batchImportTxt.formLabels.community}
                                        />
                                    </Grid>
                                    {!!communityID && (
                                        // Branch tested in cypress
                                        /* istanbul ignore next */
                                        <Grid item xs={12}>
                                            <Field
                                                component={CollectionSelectField}
                                                disabled={submitting}
                                                error={formErrors.collection_pid}
                                                id="collectionPID"
                                                name="collection_pid"
                                                parentPid={communityID}
                                                required
                                                validate={[validation.required]}
                                                {...batchImportTxt.formLabels.collection}
                                            />
                                        </Grid>
                                    )}
                                </Grid>

                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={DocumentTypeSingleField}
                                            disabled={submitting}
                                            error={formErrors.doc_type_id}
                                            id="doctypePID"
                                            name="doc_type_id"
                                            required
                                            validate={[validation.required]}
                                            {...batchImportTxt.formLabels.docType}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={DirectorySelectField}
                                            disabled={submitting}
                                            error={formErrors.directory}
                                            id="directory"
                                            name="directory"
                                            required
                                            validate={[validation.required]}
                                            {...batchImportTxt.formLabels.directory}
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>

                        {validationErrors && (
                            // Branch tested in cypress
                            /* istanbul ignore next */
                            <Grid item xs={12}>
                                <Alert {...validationErrors} alertId="batch-import-validation" />
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
                            />
                        </Grid>
                        <Grid item xs={12} sm="auto">
                            <Button
                                aria-label={batchImportTxt.formLabels.submitButtonLabel}
                                children={batchImportTxt.formLabels.submitButtonLabel}
                                color="primary"
                                data-testid="batch-import-submit"
                                disabled={submitting || submitSucceeded || disableSubmit}
                                fullWidth
                                id="submitBatchImport"
                                onClick={handleSubmit}
                                variant="contained"
                            />
                        </Grid>
                    </Grid>
                </form>
            </ConfirmDiscardFormChanges>
        </StandardPage>
    );
};

BatchImport.propTypes = {
    collectionsList: PropTypes.array,
    communityID: PropTypes.string,
    dirty: PropTypes.bool,
    disableSubmit: PropTypes.bool,
    handleSubmit: PropTypes.func,
    history: PropTypes.object,
    loadItemsList: PropTypes.func,
    reset: PropTypes.func,
    resetCollectionField: PropTypes.func,
    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.bool,
};

export default React.memo(BatchImport);
