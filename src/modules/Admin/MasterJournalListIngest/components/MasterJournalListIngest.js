import React from 'react';
import { useValidatedForm } from 'hooks';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { useDispatch } from 'react-redux';

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

const MasterJournalListIngest = () => {
    const [apiError, setApiError] = React.useState('');
    const dispatch = useDispatch();
    const onSubmit = async data => {
        console.log('data', data);
        return dispatch(requestMJLIngest(data)).catch(error => {
            setApiError(error.message);
        });
    };

    const {
        handleSubmit,
        control,
        formState: { isSubmitting: submitting, isSubmitSuccessful: submitSucceeded, errors: formErrors },
    } = useValidatedForm({
        // use values instead of defaultValues, as the first triggers a re-render upon updates
        values: {},
    });

    const navigate = useNavigate();
    // const [validationErrors, setValidationErrors] = useState(null);
    const txt = componentsLocale.components.MasterJournalListIngest;
    const disableSubmit = !!formErrors && Object.keys(formErrors).length > 0;

    const alertProps = validation.getErrorAlertProps({
        alertLocale: {
            validationAlert: { ...publicationLocale.validationAlert },
            progressAlert: { ...txt.submitProgressAlert },
            successAlert: { ...txt.submitSuccessAlert },
            errorAlert: { ...txt.submitFailureAlert },
        },
        error: apiError,
        formErrors,
        submitSucceeded: submitSucceeded && !!!apiError,
        submitting,
    });

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
                    {alertProps && (
                        <Grid item xs={12}>
                            <Alert alertId="batch-import-validation" {...alertProps} />
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

MasterJournalListIngest.propTypes = {};

export default MasterJournalListIngest;
