import React from 'react';
import { useValidatedForm } from 'hooks';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { getNotesSectionSearchKeys } from 'actions/transformers';
import { useDispatch } from 'react-redux';
import { createCommunity } from 'actions';
import { useSelector } from 'react-redux';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { NewListEditorField, KeywordsForm } from 'modules/SharedComponents/Toolbox/ListEditor';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { validation } from 'config';
import { default as formLocale } from 'locale/publicationForm';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { pathConfig } from 'config/pathConfig';

const newRecordSelector = state => {
    const createCommunityReducer = state?.createCommunityReducer || state?.get?.('createCommunityReducer');
    return createCommunityReducer?.newRecord || createCommunityReducer?.get?.('newRecord') || null;
};

const authorSelector = state => {
    const accountReducer = state?.accountReducer || state?.get?.('accountReducer');
    return accountReducer?.author || accountReducer?.get?.('author') || null;
};
export const CommunityForm = () => {
    const newRecord = useSelector(newRecordSelector);
    const author = useSelector(authorSelector);

    const [apiError, setApiError] = React.useState('');
    const dispatch = useDispatch();

    const onSubmit = async values => {
        const formData = { ...values };
        const data = { ...formData, ...getNotesSectionSearchKeys(formData) };

        delete data.internalNotes; // transformed above to fez_internal_notes: {ain_detail}

        const currentAuthor = author;
        return dispatch(createCommunity(data, currentAuthor?.aut_id)).catch(error => {
            setApiError(error);
        });
    };

    const {
        handleSubmit,
        control,
        formState: { isSubmitting, isDirty, isSubmitSuccessful, errors: formErrors },
    } = useValidatedForm({
        // use values instead of defaultValues, as the first triggers a re-render upon updates
        values: {},
    });

    const disableSubmit = !!formErrors && Object.keys(formErrors).length > 0;

    const cancelSubmit = () => {
        window.location.assign(pathConfig.index);
    };

    const reloadForm = () => {
        window.location.reload();
    };

    const txt = formLocale.addACommunity;
    if (isSubmitSuccessful && newRecord) {
        return (
            <StandardPage title={txt.title}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <StandardCard title={txt.afterSubmitTitle}>
                            <Typography>{txt.afterSubmitText}</Typography>
                        </StandardCard>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs />
                    <Grid item>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={cancelSubmit}
                            data-analyticsid="after-submit-community"
                            data-testid="after-submit-community"
                        >
                            {txt.afterSubmitButton}
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={reloadForm}
                            data-analyticsid="reload-community"
                            data-testid="reload-community"
                        >
                            {txt.AddAnotherButton}
                        </Button>
                    </Grid>
                </Grid>
            </StandardPage>
        );
    }
    // customise error for submission
    const alertProps = validation.getErrorAlertProps({
        error: apiError,
        formErrors,
        alertLocale: {
            validationAlert: { ...formLocale.validationAlert },
            progressAlert: { ...formLocale.progressAlert },
            successAlert: { ...formLocale.successAlert },
            errorAlert: {
                ...formLocale.errorAlert,
                alertId: 'alert-error-community',
                message: formLocale.addACommunity.addFailedMessage,
            },
        },
    });
    return (
        <StandardPage title={txt.title}>
            <ConfirmDiscardFormChanges dirty={isDirty} submitSucceeded={isSubmitSuccessful}>
                <form>
                    <NavigationDialogBox when={isDirty && !isSubmitSuccessful} txt={txt.cancelWorkflowConfirmation} />
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Grid item xs={12}>
                                <StandardCard title={txt.details.title} help={txt.details.help}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Field
                                                control={control}
                                                component={TextField}
                                                textFieldId="rek-title"
                                                disabled={isSubmitting}
                                                autoFocus
                                                name="rek_title"
                                                type="text"
                                                fullWidth
                                                {...txt.formLabels.title}
                                                required
                                                validate={[validation.required]}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Field
                                                control={control}
                                                component={TextField}
                                                textFieldId="rek-description"
                                                disabled={isSubmitting}
                                                name="rek_description"
                                                fullWidth
                                                multiline
                                                rows={5}
                                                {...txt.formLabels.description}
                                                validate={[validation.required]}
                                                required
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography>{txt.formLabels.keywords.description}</Typography>
                                            <Field
                                                control={control}
                                                component={NewListEditorField}
                                                name="fez_record_search_key_keywords"
                                                maxCount={10}
                                                // isValid={validation.isValidKeyword(111)}
                                                searchKey={{ value: 'rek_keywords', order: 'rek_keywords_order' }}
                                                listEditorId="rek-keywords"
                                                locale={txt.formLabels.keywords.field}
                                                disabled={isSubmitting}
                                                ListEditorForm={KeywordsForm}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography>{txt.formLabels.internalNotes.label}</Typography>
                                            <Field
                                                control={control}
                                                component={RichEditorField}
                                                richEditorId="internalNotes"
                                                disabled={isSubmitting}
                                                name="internalNotes"
                                                fullWidth
                                                multiline
                                                rows={5}
                                                {...txt.formLabels.internalNotes}
                                            />
                                        </Grid>
                                    </Grid>
                                </StandardCard>
                            </Grid>
                            {alertProps && (
                                <Grid item xs={12}>
                                    <Alert {...alertProps} />
                                </Grid>
                            )}
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={false} sm />
                            <Grid item xs={12} sm="auto">
                                <Button
                                    data-analyticsid="cancel-community"
                                    data-testid="cancel-community"
                                    variant="contained"
                                    fullWidth
                                    disabled={isSubmitting}
                                    onClick={cancelSubmit}
                                >
                                    {txt.cancel}
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm="auto">
                                <Button
                                    data-analyticsid="submit-community"
                                    data-testid="submit-community"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={isSubmitting || disableSubmit}
                                >
                                    {txt.submit}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </ConfirmDiscardFormChanges>
        </StandardPage>
    );
};
export default CommunityForm;
