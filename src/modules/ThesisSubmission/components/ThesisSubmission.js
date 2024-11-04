import React, { useRef } from 'react';
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

import { validation, TRANSITION_COHORT, general } from 'config';
import locale from 'locale/components';
import { default as formLocale } from 'locale/publicationForm';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { THESIS_SUBMISSION_SUBTYPES, THESIS_UPLOAD_RETRIES } from 'config/general';

import { useAccountContext } from 'context';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useValidatedForm } from '../../../hooks';
import { createConfirmDialogBoxRefAssigner } from '../../SharedComponents/Toolbox/ConfirmDialogBox/components/ConfirmDialogBox';
import { Field } from '../../SharedComponents/Toolbox/ReactHookForm';
import * as actions from 'actions';

export const cancelSubmit = () => {
    window.location.assign(formLocale.thesisSubmission.cancelLink);
};

export const afterSubmit = () => {
    window.location.assign(formLocale.thesisSubmission.afterSubmitLink);
};

const FORM_NAME = 'ThesisSubmission';

export const getFileUploadAlertProps = (locale, author, showRetries) => {
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
export const getFormSubmitAlertProps = props =>
    validation.getErrorAlertProps({
        ...props,
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

export const ThesisSubmission = () => {
    const dispatch = useDispatch();
    const [retries, setRetries] = React.useState(0);
    const { account } = useAccountContext();
    // to allow confirmDialogBox control
    const confirmDialogBoxRef = useRef();
    // app state
    const { author, isSessionExpired } = useSelector(state => state.get('accountReducer'));
    const { newRecordFileUploadingOrIssueError, newRecord } = useSelector(state => state.get('createRecordReducer'));
    const { fullyUploadedFiles, isUploadInProgress } = useSelector(state => state.get('fileUploadReducer'));
    // constants
    const txt = formLocale.thesis;
    const txtFoR = locale.components.fieldOfResearchForm;
    const txtSupervisors = locale.components.thesisSubmissionSupervisors;
    const thesisLocale = formLocale.thesisSubmission;
    const userIsAllowed = TRANSITION_COHORT.includes(account.id);
    const pageTitle = thesisLocale.hdrTitle;
    const fileAccessId = general.HDR_THESIS_DEFAULT_VALUES.fileAccessId;

    // form
    const {
        control,
        getPropsForAlert,
        safelyHandleSubmit,
        mergeWithFormValues,
        formState: { isDirty, isSubmitting, isSubmitSuccessful, hasValidationError },
    } = useValidatedForm({
        values: {
            thesisTitle: '',
            currentAuthor: [
                {
                    nameAsPublished: author?.aut_display_name,
                    authorId: author?.aut_id,
                },
            ],
            rek_genre_type: '',
            rek_org_unit_name: '',
            thesisAbstract: '',
            supervisors: '',
            fieldOfResearch: '',
            fez_record_search_key_keywords: '',
            files: '',
        },
    });

    const retryUpload = async () => {
        setRetries(retries + 1);
        dispatch(actions.submitThesis(mergeWithFormValues(), newRecord, FORM_NAME, fullyUploadedFiles))
            .then(() => {
                dispatch({
                    type: 'CREATE_RECORD_SUCCESS',
                    payload: {
                        newRecord,
                        fileUploadOrIssueFailed: false,
                    },
                });
            })
            .catch(() => {});
    };

    React.useEffect(() => {
        if (isSessionExpired === false && !isSubmitting && confirmDialogBoxRef.current) {
            confirmDialogBoxRef.current?.showConfirmation?.();
            dispatch(actions.clearSessionExpiredFlag());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSessionExpired, isSubmitting, confirmDialogBoxRef.current]);

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

    if (isSubmitSuccessful) {
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
                                    {...getFileUploadAlertProps(
                                        thesisLocale.fileUpload.failedAlertLocale,
                                        author,
                                        retries < THESIS_UPLOAD_RETRIES,
                                    )}
                                    disableAlertClick
                                    action={(retries < THESIS_UPLOAD_RETRIES && retryUpload) || undefined}
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

    const alertProps = getFormSubmitAlertProps(getPropsForAlert());
    const onPreSubmit = async () => await dispatch(actions.checkSession());
    const onSubmit = safelyHandleSubmit(async () => {
        const today = new Date();
        const data = mergeWithFormValues({
            ...general.HDR_THESIS_DEFAULT_VALUES,
            rek_date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
            isHdrThesis: true,
        });
        // fix org unit name
        data.fez_record_search_key_org_unit_name = { rek_org_unit_name: data.rek_org_unit_name };
        delete data.rek_org_unit_name;
        dd(data);
        await dispatch(actions.submitThesis(data, {}, FORM_NAME));
    });

    return (
        <StandardPage title={pageTitle} standardPageId="rhd-submission">
            <ConfirmDiscardFormChanges dirty={isDirty} isSubmitSuccessful={isSubmitSuccessful}>
                <form>
                    <NavigationDialogBox
                        when={isDirty && !isSubmitSuccessful}
                        txt={formLocale.cancelWorkflowConfirmation}
                    />

                    <ConfirmDialogBox
                        confirmDialogBoxId="thesis"
                        onRef={createConfirmDialogBoxRefAssigner(confirmDialogBoxRef)}
                        onAction={onSubmit}
                        locale={formLocale.thesisSubmission.depositConfirmation}
                    />
                    <Grid container spacing={3}>
                        <Grid xs={12}>
                            <StandardCard title={txt.information.title} help={txt.information.help}>
                                <Grid container spacing={3}>
                                    <Grid xs={12}>
                                        <Field
                                            control={control}
                                            component={RichEditorField}
                                            name="thesisTitle"
                                            title={txt.information.fieldLabels.documentTitle.placeholder}
                                            disabled={isSubmitting}
                                            height={50}
                                            required
                                            validate={[validation.required]}
                                            richEditorId="rek-title"
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <Field
                                            control={control}
                                            component={TextField}
                                            disabled={isSubmitting}
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
                                            control={control}
                                            component={ThesisSubtypeSelectField}
                                            id="thesis-subtype"
                                            itemsList={THESIS_SUBMISSION_SUBTYPES}
                                            name="rek_genre_type"
                                            disabled={isSubmitting}
                                            validate={[validation.required]}
                                            {...txt.information.fieldLabels.thesisType}
                                            required
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Field
                                            control={control}
                                            component={OrgUnitNameField}
                                            name="rek_org_unit_name"
                                            disabled={isSubmitting}
                                            validate={[validation.required]}
                                            required
                                            {...txt.information.fieldLabels.orgUnitName}
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Field
                                            control={control}
                                            component={RichEditorField}
                                            disabled={isSubmitting}
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
                                    control={control}
                                    component={ContributorsEditorField}
                                    contributorEditorId="rek-supervisor"
                                    required
                                    name="supervisors"
                                    validate={[validation.supervisorRequired]}
                                    locale={txtSupervisors.field}
                                    disabled={isSubmitting}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard title={txtFoR.title} help={txtFoR.help}>
                                <Typography>{txtFoR.text}</Typography>
                                <Field
                                    control={control}
                                    component={FilteredFieldOfResearchListField}
                                    listEditorId="rek-subject"
                                    name="fieldOfResearch"
                                    required
                                    validate={[validation.forRequired]}
                                    hideReorder
                                    distinctOnly
                                    maxCount={3}
                                    disabled={isSubmitting}
                                    locale={txtFoR.field}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard title={txt.keywords.title} help={txt.keywords.help}>
                                <Typography>{txt.keywords.description}</Typography>
                                <Field
                                    control={control}
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
                                    disabled={isSubmitting}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard
                                title={formLocale.thesisSubmission.fileUpload.title}
                                help={formLocale.thesisSubmission.fileUpload.help}
                            >
                                <Field
                                    control={control}
                                    name="files"
                                    component={FileUploadField}
                                    disabled={isSubmitting}
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
                                disabled={isSubmitting}
                                onClick={cancelSubmit}
                            />
                        </Grid>
                        <Grid xs={12} sm="auto">
                            <Button
                                type="button"
                                variant="contained"
                                id="submit-thesis"
                                data-testid="deposit-thesis"
                                color="primary"
                                fullWidth
                                children={formLocale.thesisSubmission.submit}
                                onClick={onPreSubmit}
                                disabled={isSubmitting || hasValidationError}
                            />
                        </Grid>
                    </Grid>
                </form>
            </ConfirmDiscardFormChanges>
        </StandardPage>
    );
};

export default ThesisSubmission;
