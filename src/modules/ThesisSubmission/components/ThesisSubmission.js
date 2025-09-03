import React, { useMemo, useRef } from 'react';
import { parseHtmlToJSX } from 'helpers/general';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import {
    OrgUnitNameField,
    FilteredFieldOfResearchListField,
    OrgNameField,
} from 'modules/SharedComponents/LookupFields';
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
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useValidatedForm } from '../../../hooks';
import PropTypes from 'prop-types';
import { createConfirmDialogBoxRefAssigner } from '../../SharedComponents/Toolbox/ConfirmDialogBox/components/ConfirmDialogBox';
import { Field } from '../../SharedComponents/Toolbox/ReactHookForm';
import * as actions from 'actions';
import { PartialDateField } from '../../SharedComponents/Toolbox/PartialDate';

export const getFormConstants = (account, author, isHdrThesis) => {
    const today = new Date();
    const rekDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    if (isHdrThesis) {
        const thesisLocale = formLocale.thesisSubmission;
        return {
            FORM_NAME: 'ThesisSubmission',
            thesisLocale,
            pageTitle: thesisLocale.title,
            fileAccessId: general.HDR_THESIS_DEFAULT_VALUES.fileAccessId,
            cancelSubmit: () => window.location.assign(thesisLocale.cancelLink),
            afterSubmit: () => window.location.assign(thesisLocale.afterSubmitLink),
            userIsAllowed: TRANSITION_COHORT.includes(account.id),
            values: {
                thesisTitle: '',
                currentAuthor: [
                    {
                        nameAsPublished: author?.aut_display_name,
                        authorId: author?.aut_id,
                    },
                ],
                rek_genre_type: '',
                fez_record_search_key_org_unit_name: {
                    rek_org_unit_name: '',
                },
                thesisAbstract: '',
                supervisors: '',
                fieldOfResearch: '',
                fez_record_search_key_keywords: '',
                files: '',
            },
            defaultValues: {
                ...general.HDR_THESIS_DEFAULT_VALUES,
                rek_date: rekDate,
                isHdrThesis,
            },
        };
    }

    const thesisLocale = formLocale.sbsSubmission;
    return {
        FORM_NAME: 'SbsSubmission',
        thesisLocale,
        pageTitle: thesisLocale.title,
        fileAccessId: general.SBS_THESIS_DEFAULT_VALUES.fileAccessId,
        cancelSubmit: () => window.location.reload(),
        afterSubmit: () => window.location.reload(),
        userIsAllowed: true,
        values: {
            thesisTitle: '',
            currentAuthor: [
                {
                    nameAsPublished: author?.aut_display_name,
                    authorId: author?.aut_id,
                },
            ],
            rek_genre_type: 'Professional Doctorate',
            fez_record_search_key_org_name: general.SBS_THESIS_DEFAULT_VALUES.fez_record_search_key_org_name,
            fez_record_search_key_org_unit_name: {
                rek_org_unit_name: '',
            },
            rek_date: rekDate,
            thesisAbstract: '',
            supervisors: '',
            fieldOfResearch: '',
            fez_record_search_key_keywords: '',
            files: '',
        },
        defaultValues: {
            ...general.SBS_THESIS_DEFAULT_VALUES,
            isHdrThesis,
        },
    };
};

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

export const ThesisSubmission = ({ isHdrThesis }) => {
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
    const {
        FORM_NAME,
        thesisLocale,
        pageTitle,
        fileAccessId,
        cancelSubmit,
        afterSubmit,
        userIsAllowed,
        values,
        defaultValues,
    } = useMemo(() => getFormConstants(account, author, isHdrThesis), [account, author, isHdrThesis]);

    // form
    const {
        control,
        getPropsForAlert,
        safelyHandleSubmit,
        mergeWithFormValues,
        formState: { isDirty, isSubmitting, isSubmitSuccessful, hasValidationError },
    } = useValidatedForm({
        values,
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
                        <Alert message={thesisLocale.notAllowedMessage} type="info" alertId="alert-info-rdm-redirect" />
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
                {isHdrThesis && thesisLocale.afterSubmit && (
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
                )}
            </StandardPage>
        );
    }

    const alertProps = getFormSubmitAlertProps(getPropsForAlert());
    const onPreSubmit = async () => await dispatch(actions.checkSession());
    const onSubmit = safelyHandleSubmit(async () => {
        const data = mergeWithFormValues(defaultValues);
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
                        locale={thesisLocale.depositConfirmation}
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
                                    {!isHdrThesis && (
                                        <Grid xs={12}>
                                            <Field
                                                control={control}
                                                component={OrgNameField}
                                                name="fez_record_search_key_org_name.rek_org_name"
                                                disabled={isSubmitting}
                                                validate={[validation.required]}
                                                required
                                                {...txt.information.fieldLabels.orgName}
                                            />
                                        </Grid>
                                    )}
                                    <Grid xs={12}>
                                        <Field
                                            control={control}
                                            component={OrgUnitNameField}
                                            name="fez_record_search_key_org_unit_name.rek_org_unit_name"
                                            disabled={isSubmitting}
                                            validate={[validation.required]}
                                            required
                                            {...txt.information.fieldLabels.orgUnitName}
                                        />
                                    </Grid>
                                    {!isHdrThesis && (
                                        <Grid xs={12}>
                                            <Field
                                                control={control}
                                                component={PartialDateField}
                                                disabled={isSubmitting}
                                                partialDateFieldId="rek-date"
                                                name="rek_date"
                                                allowPartial
                                                className="requiredHintField"
                                                validate={[validation.required]}
                                                floatingTitle={txt.information.fieldLabels.date.title}
                                                floatingTitleRequired
                                                required
                                            />
                                        </Grid>
                                    )}
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
                                    maxCount={10}
                                    searchKey={{
                                        value: 'rek_keywords',
                                        order: 'rek_keywords_order',
                                    }}
                                    locale={locale.components.keywordsForm.field}
                                    listEditorId="rek-keywords"
                                    disabled={isSubmitting}
                                    isValid={validation.isValidKeyword(111)}
                                    {...(isHdrThesis
                                        ? {
                                              required: true,
                                              validate: [validation.requiredList],
                                          }
                                        : {})}
                                />
                            </StandardCard>
                        </Grid>
                        {!isHdrThesis && (
                            <Grid xs={12}>
                                <StandardCard title={txt.optional.fieldLabels.notes.title} help={txt.keywords.help}>
                                    <Field
                                        control={control}
                                        component={TextField}
                                        disabled={isSubmitting}
                                        name="comments"
                                        type="text"
                                        fullWidth
                                        rows={3}
                                        multiline
                                        {...txt.optional.fieldLabels.notes}
                                    />
                                </StandardCard>
                            </Grid>
                        )}
                        <Grid xs={12}>
                            <StandardCard title={thesisLocale.fileUpload.title} help={thesisLocale.fileUpload.help}>
                                <Field
                                    control={control}
                                    name="files"
                                    component={FileUploadField}
                                    disabled={isSubmitting}
                                    locale={thesisLocale.fileUpload.locale}
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
                                aria-label={thesisLocale.cancel}
                                children={thesisLocale.cancel}
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
                                children={thesisLocale.submit}
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

ThesisSubmission.propTypes = {
    isHdrThesis: PropTypes.bool,
};

export default ThesisSubmission;
