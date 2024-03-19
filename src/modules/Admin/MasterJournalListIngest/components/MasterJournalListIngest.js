import React, { useState, useEffect } from 'react';
import Immutable from 'immutable';
import { useSelector } from 'react-redux';
import { Field, reduxForm, SubmissionError, getFormSyncErrors } from 'redux-form/immutable';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { DirectorySelectField } from 'modules/SharedComponents/SelectFields';

import { requestMJLIngest } from 'actions';
import { validation, pathConfig } from 'config';
import { default as componentsLocale } from 'locale/components';
import { default as publicationLocale } from 'locale/publicationForm';
import { useNavigate } from 'react-router-dom';

export const FORM_NAME = 'MasterJournalListIngest';

const onSubmit = (values, dispatch) => {
    const data = { ...values.toJS() };
    return dispatch(requestMJLIngest(data)).catch(error => {
        throw new SubmissionError({ _error: error.message });
    });
};

const MasterJournalListIngest = ({ error, handleSubmit, submitSucceeded, submitting }) => {
    const navigate = useNavigate();
    const [validationErrors, setValidationErrors] = useState(null);
    const txt = componentsLocale.components.MasterJournalListIngest;
    const formErrors = useSelector(state => getFormSyncErrors(FORM_NAME)(state));
    const disableSubmit = !!formErrors && !(formErrors instanceof Immutable.Map) && Object.keys(formErrors).length > 0;

    useEffect(() => {
        const alertProps = validation.getErrorAlertProps({
            alertLocale: {
                validationAlert: { ...publicationLocale.validationAlert },
                progressAlert: { ...txt.submitProgressAlert },
                successAlert: { ...txt.submitSuccessAlert },
                errorAlert: { ...txt.submitFailureAlert },
            },
            error,
            formErrors,
            submitSucceeded,
            submitting,
        });

        setValidationErrors(alertProps);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, formErrors, submitSucceeded, submitting]);

    const cancelIngest = () => {
        navigate(pathConfig.index);
    };

    return (
        <StandardPage title={txt.title}>
            <form>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <StandardCard help={txt.help}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Field
                                        component={DirectorySelectField}
                                        genericSelectFieldId="directory"
                                        disabled={submitting}
                                        id="directory"
                                        name="directory"
                                        required
                                        validate={[validation.required]}
                                        {...txt.formLabels.directory}
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
                    <Grid item xs={12} sm="auto">
                        <Button
                            aria-label={txt.formLabels.cancelButtonLabel}
                            children={txt.formLabels.cancelButtonLabel}
                            data-analyticsid="master-journal-list-ingest-cancel"
                            data-testid="master-journal-list-ingest-cancel"
                            disabled={submitting}
                            fullWidth
                            id="cancelIngest"
                            onClick={cancelIngest}
                            variant="contained"
                            color={'default'}
                        />
                    </Grid>
                    <Grid item xs={12} sm="auto">
                        <Button
                            aria-label={txt.formLabels.submitButtonLabel}
                            children={txt.formLabels.submitButtonLabel}
                            color="primary"
                            data-analyticsid="master-journal-list-ingest-submit"
                            data-testid="master-journal-list-ingest-submit"
                            disabled={submitting || submitSucceeded || disableSubmit}
                            fullWidth
                            id="submitIngest"
                            onClick={handleSubmit}
                            variant="contained"
                        />
                    </Grid>
                </Grid>
            </form>
        </StandardPage>
    );
};

MasterJournalListIngest.propTypes = {
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    handleSubmit: PropTypes.func,
    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.bool,
};

const MasterJournalListIngestForm = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(MasterJournalListIngest);

export default MasterJournalListIngestForm;
