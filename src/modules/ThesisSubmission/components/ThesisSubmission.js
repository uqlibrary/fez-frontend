import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';
import { parseHtmlToJSX } from 'helpers/general';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { OrgUnitNameField, FilteredFieldOfResearchListField } from 'modules/SharedComponents/LookupFields';
import { ThesisSubtypeSelectField } from 'modules/SharedComponents/SelectFields';
import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { ListEditorField } from 'modules/SharedComponents/Toolbox/ListEditor';
import { FileUploadField } from 'modules/SharedComponents/Toolbox/FileUploader';

import { validation, TRANSITION_COHORT } from 'config';
import locale from 'locale/components';
import { default as formLocale } from 'locale/publicationForm';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { THESIS_SUBMISSION_SUBTYPES, THESIS_UPLOAD_RETRIES } from 'config/general';

import { useAccountContext } from 'context';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

export const cancelSubmit = () => {
    window.location.assign(formLocale.thesisSubmission.cancelLink);
};

export const afterSubmit = () => {
    window.location.assign(formLocale.thesisSubmission.afterSubmitLink);
};

export const getfileUploadAlertProps = (locale, author, showRetries) => {
    const { actionButtonLabel, type, title } = locale;
    const emailSubject = locale.emailSubject
        .replace('[studentFullName]', `${author.aut_fname} ${author.aut_lname}`)
        .replace('[studentNumber]', author.aut_org_student_id);
    const mailtoUri = `mailto:${locale.emailRecipient}?subject=${encodeURIComponent(emailSubject)}`;
    const message = parseHtmlToJSX(
        (showRetries ? locale.messageWithRetry : locale.message)
            .replace('[linkStart]', `<a href="${mailtoUri}">`)
            .replace('[linkEnd]', '</a>'),
    );
    return { actionButtonLabel, type, title, message };
};

// customise error for thesis submission
export const getFormSubmitAlertProps = ({ submitting, error, formErrors, submitSucceeded }) =>
    validation.getErrorAlertProps({
        submitting,
        error,
        formErrors,
        submitSucceeded,
        alertLocale: {
            validationAlert: { ...formLocale.validationAlert },
            progressAlert: { ...formLocale.progressAlert },
            successAlert: { ...formLocale.successAlert },
            errorAlert: {
                ...formLocale.errorAlert,
                message: () => formLocale.thesisSubmission.depositFailedMessage,
            },
        },
    });

export const ThesisSubmission = ({
    actions,
    author,
    dirty,
    disableSubmit,
    error,
    fileAccessId,
    formErrors,
    formValues,
    fullyUploadedFiles,
    handleSubmit,
    isHdrThesis,
    isSessionValid,
    isUploadInProgress,
    newRecord,
    newRecordFileUploadingOrIssueError,
    retryUpload,
    submitSucceeded,
    submitting,
}) => {
    const deposit = () => {
        actions.checkSession();
    };

    const [retries, setRetries] = React.useState(0);

    /* istanbul ignore next */
    const _retryUpload = () => {
        setRetries(retries + 1);
        retryUpload(formValues, newRecord, fullyUploadedFiles);
    };

    const depositConfirmationRef = React.useRef();
    const setDepositConfirmation = React.useCallback(
        /* istanbul ignore next */ node => {
            depositConfirmationRef.current = node;
        },
        [],
    );

    const openDepositConfirmation = () => {
        depositConfirmationRef.current.showConfirmation();
        actions.clearSessionExpiredFlag();
    };

    React.useEffect(() => {
        if (isSessionValid && !submitting) {
            openDepositConfirmation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSessionValid, submitting]);

    const txt = formLocale.thesis;
    const txtFoR = locale.components.fieldOfResearchForm;
    const txtSupervisors = locale.components.thesisSubmissionSupervisors;
    const thesisLocale = formLocale.thesisSubmission;
    const pageTitle = isHdrThesis ? thesisLocale.hdrTitle : thesisLocale.sbsTitle;

    const { account } = useAccountContext();
    const userIsAllowed = TRANSITION_COHORT.includes(account.id);

    if (!userIsAllowed) {
        return (
            <StandardPage title={pageTitle} standardPageId="rhd-submission-user-blocked">
                <Grid container spacing={3}>
                    <Grid xs={12}>
                        <Alert
                            message={formLocale.thesisSubmission.message}
                            type="info"
                            alertId="alert-info-rdm-redirect"
                        />
                    </Grid>
                </Grid>
            </StandardPage>
        );
    }

    if (submitSucceeded) {
        return (
            <StandardPage title={pageTitle} standardPageId="rhd-submission-succeeded">
                <Grid container spacing={3}>
                    <Grid xs={12}>
                        <StandardCard title={thesisLocale.afterSubmitTitle}>
                            <Grid container spacing={3}>
                                <Grid xs={12}>
                                    <Typography>{thesisLocale.afterSubmitText}</Typography>
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>
                </Grid>
                {(newRecordFileUploadingOrIssueError || retries > 0) && (
                    <Grid container spacing={3}>
                        <Grid xs={12}>
                            {newRecordFileUploadingOrIssueError && (
                                <Alert
                                    {...getfileUploadAlertProps(
                                        thesisLocale.fileUpload.failedAlertLocale,
                                        author,
                                        retries < THESIS_UPLOAD_RETRIES,
                                    )}
                                    disableAlertClick
                                    action={(retries < THESIS_UPLOAD_RETRIES && _retryUpload) || undefined}
                                    showLoader={isUploadInProgress}
                                />
                            )}
                            {!newRecordFileUploadingOrIssueError && retries > 0 && (
                                <Alert {...thesisLocale.fileUpload.retrySuccessLocale} />
                            )}
                        </Grid>
                    </Grid>
                )}
                <Grid container spacing={2}>
                    <Grid xs />
                    <Grid>
                        <Button
                            children={thesisLocale.afterSubmit}
                            color={!newRecordFileUploadingOrIssueError ? 'primary' : 'inherit'}
                            fullWidth
                            onClick={afterSubmit}
                            variant={'contained'}
                        />
                    </Grid>
                </Grid>
            </StandardPage>
        );
    }

    const alertProps = getFormSubmitAlertProps({
        submitting,
        error,
        formErrors,
        submitSucceeded,
    });

    return (
        <StandardPage title={pageTitle} standardPageId="rhd-submission">
            <ConfirmDiscardFormChanges dirty={dirty} submitSucceeded={submitSucceeded}>
                <form>
                    <NavigationDialogBox when={dirty && !submitSucceeded} txt={formLocale.cancelWorkflowConfirmation} />

                    <ConfirmDialogBox
                        confirmDialogBoxId="thesis"
                        onRef={setDepositConfirmation}
                        onAction={handleSubmit}
                        locale={formLocale.thesisSubmission.depositConfirmation}
                    />
                    <Grid container spacing={3}>
                        <Grid xs={12}>
                            <StandardCard title={txt.information.title} help={txt.information.help}>
                                <Grid container spacing={3}>
                                    <Grid xs={12}>
                                        <Field
                                            component={RichEditorField}
                                            name="thesisTitle"
                                            title={txt.information.fieldLabels.documentTitle.placeholder}
                                            disabled={submitting}
                                            height={50}
                                            required
                                            validate={[validation.required]}
                                            richEditorId="rek-title"
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            disabled={submitting}
                                            name="currentAuthor.0.nameAsPublished"
                                            type="text"
                                            fullWidth
                                            rows={1}
                                            {...txt.information.fieldLabels.author}
                                            required
                                            validate={[validation.required]}
                                            textFieldId="rek-author"
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <Field
                                            component={ThesisSubtypeSelectField}
                                            id="thesis-subtype"
                                            itemsList={THESIS_SUBMISSION_SUBTYPES}
                                            name="rek_genre_type"
                                            disabled={submitting}
                                            validate={[validation.required]}
                                            {...txt.information.fieldLabels.thesisType}
                                            required
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Field
                                            component={OrgUnitNameField}
                                            name="fez_record_search_key_org_unit_name.rek_org_unit_name"
                                            disabled={submitting}
                                            validate={[validation.required]}
                                            required
                                            {...txt.information.fieldLabels.orgUnitName}
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Field
                                            component={RichEditorField}
                                            disabled={submitting}
                                            title={txt.optional.fieldLabels.abstract.label}
                                            name="thesisAbstract"
                                            required
                                            validate={[validation.required]}
                                            richEditorId="rek-description"
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard title={txtSupervisors.title} help={txtSupervisors.help}>
                                <Field
                                    component={ContributorsEditorField}
                                    contributorEditorId="rek-supervisor"
                                    required
                                    name="supervisors"
                                    validate={[validation.supervisorRequired]}
                                    locale={txtSupervisors.field}
                                    disabled={submitting}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard title={txtFoR.title} help={txtFoR.help}>
                                <Typography>{txtFoR.text}</Typography>
                                <Field
                                    component={FilteredFieldOfResearchListField}
                                    listEditorId="rek-subject"
                                    name="fieldOfResearch"
                                    required
                                    validate={[validation.forRequired]}
                                    hideReorder
                                    distinctOnly
                                    maxCount={3}
                                    disabled={submitting}
                                    locale={txtFoR.field}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard title={txt.keywords.title} help={txt.keywords.help}>
                                <Typography>{txt.keywords.description}</Typography>
                                <Field
                                    component={ListEditorField}
                                    name="fez_record_search_key_keywords"
                                    required
                                    maxCount={10}
                                    validate={[validation.requiredList]}
                                    searchKey={{
                                        value: 'rek_keywords',
                                        order: 'rek_keywords_order',
                                    }}
                                    isValid={validation.isValidKeyword(111)}
                                    listEditorId="rek-keywords"
                                    locale={locale.components.keywordsForm.field}
                                    disabled={submitting}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard
                                title={formLocale.thesisSubmission.fileUpload.title}
                                help={formLocale.thesisSubmission.fileUpload.help}
                            >
                                <Field
                                    name="files"
                                    component={FileUploadField}
                                    disabled={submitting}
                                    locale={formLocale.thesisSubmission.fileUpload.locale}
                                    defaultQuickTemplateId={fileAccessId}
                                    validate={[validation.fileUploadRequired]}
                                />
                            </StandardCard>
                        </Grid>

                        {alertProps && (
                            <Grid xs={12}>
                                <Alert {...alertProps} alertId="thesis-submission-validation" />
                            </Grid>
                        )}
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid xs={false} sm />
                        <Grid xs={12} sm="auto">
                            <Button
                                data-testid="cancel-deposit-thesis"
                                variant="contained"
                                fullWidth
                                aria-label={formLocale.thesisSubmission.cancel}
                                children={formLocale.thesisSubmission.cancel}
                                disabled={submitting}
                                onClick={cancelSubmit}
                            />
                        </Grid>
                        <Grid xs={12} sm="auto">
                            <Button
                                variant="contained"
                                id="submit-thesis"
                                data-testid="deposit-thesis"
                                color="primary"
                                fullWidth
                                children={formLocale.thesisSubmission.submit}
                                onClick={deposit}
                                disabled={submitting || disableSubmit}
                            />
                        </Grid>
                    </Grid>
                </form>
            </ConfirmDiscardFormChanges>
        </StandardPage>
    );
};

ThesisSubmission.propTypes = {
    actions: PropTypes.object.isRequired,
    author: PropTypes.object,
    dirty: PropTypes.bool,
    disableSubmit: PropTypes.bool,
    error: PropTypes.any,
    fileAccessId: PropTypes.number,
    formErrors: PropTypes.object,
    formValues: PropTypes.object,
    fullyUploadedFiles: PropTypes.array,
    handleSubmit: PropTypes.func,
    isHdrThesis: PropTypes.bool, // HDR thesis if true or SBS thesis if false
    isSessionValid: PropTypes.bool,
    isUploadInProgress: PropTypes.bool,
    newRecord: PropTypes.object,
    newRecordFileUploadingOrIssueError: PropTypes.bool,
    retryUpload: PropTypes.func,
    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.bool,
};

export default ThesisSubmission;
