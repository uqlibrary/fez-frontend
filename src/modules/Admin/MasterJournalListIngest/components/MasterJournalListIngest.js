import React, { useState, useEffect } from 'react';
import Immutable from 'immutable';
// import { useSelector } from 'react-redux';
// import { Field, reduxForm, SubmissionError, getFormSyncErrors } from 'redux-form/immutable';
import { useValidatedForm } from 'hooks';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { useDispatch } from 'react-redux';

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

// export const FORM_NAME = 'MasterJournalListIngest';

const MasterJournalListIngest = () => {
    const [apiError, setApiError] = React.useState('');
    const dispatch = useDispatch();
    const onSubmit = async data => {
        console.log('data', data);
        return dispatch(requestMJLIngest(data)).catch(error => {
            // throw new SubmissionError({ _error: error.message });
            setApiError(error.message);
        });
    };

    // { error, handleSubmit, submitSucceeded, submitting }
    const {
        handleSubmit,
        // watch,
        // reset: resetForm,
        control,
        formState: { isSubmitting: submitting, isSubmitSuccessful: submitSucceeded, errors: formErrors },
    } = useValidatedForm({
        // use values instead of defaultValues, as the first triggers a re-render upon updates
        values: {},
    });

    const navigate = useNavigate();
    const [validationErrors, setValidationErrors] = useState(null);
    const txt = componentsLocale.components.MasterJournalListIngest;
    // const formErrors = useSelector(state => getFormSyncErrors(FORM_NAME)(state));
    const disableSubmit = !!formErrors && !(formErrors instanceof Immutable.Map) && Object.keys(formErrors).length > 0;

    useEffect(() => {
        const alertProps = validation.getErrorAlertProps({
            alertLocale: {
                validationAlert: { ...publicationLocale.validationAlert },
                progressAlert: { ...txt.submitProgressAlert },
                successAlert: { ...txt.submitSuccessAlert },
                errorAlert: { ...txt.submitFailureAlert },
            },
            apiError,
            formErrors,
            submitSucceeded,
            submitting,
        });

        setValidationErrors(alertProps);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiError, formErrors, submitSucceeded, submitting]);

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
                                        control={control}
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
                    {!!apiError && (
                        <Grid xs={12}>
                            <Alert alertId="api-error-alert" type="error_outline" message={apiError} />
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
                            onClick={handleSubmit(onSubmit)}
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

// const MasterJournalListIngestForm = reduxForm({
//     form: FORM_NAME,
//     onSubmit,
// })(MasterJournalListIngest);

export default MasterJournalListIngest;
