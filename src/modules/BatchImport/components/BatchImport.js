import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import { Field, change, formValueSelector, reduxForm, SubmissionError, getFormSyncErrors } from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';

import { PUBLICATION_TYPE_DESIGN } from 'config/general';
import { createBatchImport } from 'actions';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
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

export const FORM_NAME = 'BatchImport';
const selector = formValueSelector(FORM_NAME);

const onSubmit = (values, dispatch) => {
    const data = { ...values.toJS() };
    return dispatch(createBatchImport(data)).catch(error => {
        throw new SubmissionError({ _error: error.message });
    });
};

const onChange = (values, dispatch, props, prevValues) => {
    if (values.get('communityID') !== prevValues.get('communityID')) {
        dispatch(change(FORM_NAME, 'collection_pid', null));
    }
};

export const BatchImport = ({ dirty, error, handleSubmit, reset, submitSucceeded, submitting, history }) => {
    const [validationErrors, setValidationErrors] = useState(null);
    const batchImportTxt = componentsLocale.components.digiTeam.batchImport;
    const communityID = useSelector(state => selector(state, 'communityID'));
    const isDesignType = useSelector(state => selector(state, 'doc_type_id')) === PUBLICATION_TYPE_DESIGN;
    const isBulkFileIngest = useSelector(state => selector(state, 'is_bulk_file_ingest'));
    const designSubtypes = isDesignType ? publicationTypes(null, true)[PUBLICATION_TYPE_DESIGN].subtypes : null;
    const formErrors = useSelector(state => getFormSyncErrors(FORM_NAME)(state));
    const disableSubmit = !!formErrors && !(formErrors instanceof Immutable.Map) && Object.keys(formErrors).length > 0;

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
                                            component={props => (
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            {...props}
                                                            name="checkedB"
                                                            color="primary"
                                                            // eslint-disable-next-line react/prop-types
                                                            checked={isBulkFileIngest}
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
                                    {!isBulkFileIngest && (
                                        <Grid item xs={12}>
                                            <Field
                                                component={CommunitySelectField}
                                                genericSelectFieldId="community-pid"
                                                disabled={submitting}
                                                id="communityPID"
                                                name="communityID"
                                                required
                                                validate={[validation.required]}
                                                {...batchImportTxt.formLabels.community}
                                            />
                                        </Grid>
                                    )}
                                    {!isBulkFileIngest && !!communityID && (
                                        <Grid item xs={12}>
                                            <Field
                                                component={CollectionSelectField}
                                                disabled={submitting}
                                                id="collectionPID"
                                                name="collection_pid"
                                                genericSelectFieldId="collection-pid"
                                                communityId={communityID}
                                                required
                                                validate={[validation.required]}
                                                {...batchImportTxt.formLabels.collection}
                                            />
                                        </Grid>
                                    )}
                                    {!isBulkFileIngest && (
                                        <Grid item xs={12}>
                                            <Field
                                                component={DocumentTypeSingleField}
                                                disabled={submitting}
                                                id="doctypeID"
                                                name="doc_type_id"
                                                required
                                                validate={[validation.required]}
                                                {...batchImportTxt.formLabels.docType}
                                            />
                                        </Grid>
                                    )}
                                    {!isBulkFileIngest && !!isDesignType && (
                                        <Grid item xs={12}>
                                            <Field
                                                component={NewGenericSelectField}
                                                disabled={submitting}
                                                id="subtype"
                                                genericSelectFieldId="subtype"
                                                name="subtype"
                                                required
                                                validate={[validation.required]}
                                                itemsList={designSubtypes.map(item => ({ text: item, value: item }))}
                                                {...batchImportTxt.formLabels.subType}
                                            />
                                        </Grid>
                                    )}
                                    <Grid item xs={12}>
                                        <Field
                                            component={DirectorySelectField}
                                            genericSelectFieldId="directory"
                                            disabled={submitting}
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
                            <Grid item xs={12}>
                                <Alert alertId="batch-import-validation" {...validationErrors} />
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
    dirty: PropTypes.bool,
    error: PropTypes.string,
    handleSubmit: PropTypes.func,
    history: PropTypes.object,
    reset: PropTypes.func,
    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.bool,
};

const BatchImportReduxForm = reduxForm({
    form: FORM_NAME,
    onSubmit,
    onChange,
})(BatchImport);

export default React.memo(BatchImportReduxForm);
