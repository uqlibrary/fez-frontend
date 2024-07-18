import React from 'react';
import PropTypes from 'prop-types';
import { propTypes } from 'redux-form/immutable';
import { Field } from 'redux-form/immutable';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { ThesisSubtypeSelectField } from 'modules/SharedComponents/SelectFields';
import {
    OrgUnitNameField,
    FilteredFieldOfResearchListField,
    OrgNameField,
} from 'modules/SharedComponents/LookupFields';
import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { ListEditorField } from 'modules/SharedComponents/Toolbox/ListEditor';
import { FileUploadField } from 'modules/SharedComponents/Toolbox/FileUploader';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';

import { validation } from 'config';
import locale from 'locale/components';
import { default as formLocale } from 'locale/publicationForm';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { THESIS_SUBMISSION_SUBTYPES } from 'config/general';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

/**
 * TODO:: Can be replaced by ThesisSubmission component?
 */
export const SbsSubmission = ({
    actions,
    disableSubmit,
    fileAccessId,
    isSessionValid,
    newRecordFileUploadingOrIssueError,
    ...props
}) => {
    const depositConfirmationBox = React.useRef();

    React.useEffect(() => {
        if (isSessionValid && !props.submitting) {
            depositConfirmationBox.current?.showConfirmation?.();
            actions.clearSessionExpiredFlag();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSessionValid, props.submitting]);

    const deposit = () => {
        actions.checkSession();
    };

    const cancelSubmit = () => {
        window.location.reload();
    };

    /* istanbul ignore next */
    // const afterSubmit = () => {
    //     window.location.assign(formLocale.thesisSubmission.afterSubmitLink);
    // };

    const setDepositConfirmation = React.useCallback(node => {
        depositConfirmationBox.current = node; // TODO: Add check that this worked
    }, []);

    /* istanbul ignore next */
    const afterFailedSubmit = () => {
        // Clears the current state completely and reloads the form
        window.location.reload();
    };

    // customise error for thesis submission
    const getAlertProps = () =>
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

    const txt = formLocale.thesis;
    const txtFoR = locale.components.fieldOfResearchForm;
    const txtSupervisors = locale.components.thesisSubmissionSupervisors;
    const thesisLocale = formLocale.sbsSubmission;

    if (props.submitSucceeded) {
        return (
            <StandardPage title={formLocale.sbsSubmission.sbsTitle}>
                <Grid container spacing={3}>
                    {newRecordFileUploadingOrIssueError ? (
                        <Grid item xs={12}>
                            <Alert {...thesisLocale.fileUpload.failedAlertLocale} action={afterFailedSubmit} />
                        </Grid>
                    ) : (
                        <Grid item xs={12}>
                            <StandardCard title={formLocale.sbsSubmission.afterSubmitTitle}>
                                <Typography>{formLocale.sbsSubmission.afterSubmitText}</Typography>
                            </StandardCard>
                        </Grid>
                    )}
                </Grid>
            </StandardPage>
        );
    }

    const alertProps = getAlertProps();

    return (
        <StandardPage title={formLocale.sbsSubmission.sbsTitle}>
            <ConfirmDiscardFormChanges dirty={props.dirty} submitSucceeded={props.submitSucceeded}>
                <form>
                    <NavigationDialogBox
                        when={props.dirty && !props.submitSucceeded}
                        txt={formLocale.cancelWorkflowConfirmation}
                    />

                    <ConfirmDialogBox
                        onRef={setDepositConfirmation}
                        onAction={props.handleSubmit}
                        locale={formLocale.thesisSubmission.depositConfirmation}
                    />
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <StandardCard title={txt.information.title} help={txt.information.help}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={RichEditorField}
                                            name="thesisTitle"
                                            disabled={props.submitting}
                                            height={50}
                                            title={txt.information.fieldLabels.documentTitle.placeholder}
                                            required
                                            validate={[validation.required]}
                                            richEditorId="rek-title"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            disabled={props.submitting}
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
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={ThesisSubtypeSelectField}
                                            id="thesis-subtype"
                                            itemsList={THESIS_SUBMISSION_SUBTYPES}
                                            name="rek_genre_type"
                                            genericSelectFieldId="rek-genre-type"
                                            disabled={props.submitting}
                                            validate={[validation.required]}
                                            {...txt.information.fieldLabels.thesisType}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={OrgNameField}
                                            name="fez_record_search_key_org_name.rek_org_name"
                                            disabled={props.submitting}
                                            validate={[validation.required]}
                                            required
                                            {...txt.information.fieldLabels.orgName}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={OrgUnitNameField}
                                            name="fez_record_search_key_org_unit_name.rek_org_unit_name"
                                            disabled={props.submitting}
                                            validate={[validation.required]}
                                            required
                                            {...txt.information.fieldLabels.orgUnitName}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={PartialDateField}
                                            disabled={props.submitting}
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
                                    <Grid item xs={12}>
                                        <Field
                                            component={RichEditorField}
                                            disabled={props.submitting}
                                            name="thesisAbstract"
                                            title={txt.optional.fieldLabels.abstract.label}
                                            required
                                            validate={[validation.required]}
                                            richEditorId="rek-description"
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={txtSupervisors.title} help={txtSupervisors.help}>
                                <Field
                                    component={ContributorsEditorField}
                                    contributorEditorId="rek-supervisor"
                                    required
                                    name="supervisors"
                                    validate={[validation.supervisorRequired]}
                                    locale={txtSupervisors.field}
                                    disabled={props.submitting}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
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
                                    disabled={props.submitting}
                                    locale={txtFoR.field}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={txt.keywords.title} help={txt.keywords.help}>
                                <Typography>{txt.keywords.description}</Typography>
                                <Field
                                    component={ListEditorField}
                                    name="fez_record_search_key_keywords"
                                    maxCount={10}
                                    searchKey={{ value: 'rek_keywords', order: 'rek_keywords_order' }}
                                    locale={locale.components.keywordsForm.field}
                                    listEditorId="rek-keywords"
                                    disabled={props.submitting}
                                />
                            </StandardCard>
                        </Grid>

                        <Grid item xs={12}>
                            <StandardCard title={txt.optional.fieldLabels.notes.title} help={txt.keywords.help}>
                                <Field
                                    component={TextField}
                                    disabled={props.submitting}
                                    name="comments"
                                    type="text"
                                    fullWidth
                                    rows={3}
                                    multiline
                                    {...txt.optional.fieldLabels.notes}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard
                                title={formLocale.sbsSubmission.fileUpload.title}
                                help={formLocale.sbsSubmission.fileUpload.help}
                            >
                                <Field
                                    name="files"
                                    component={FileUploadField}
                                    disabled={props.submitting}
                                    locale={formLocale.sbsSubmission.fileUpload.locale}
                                    defaultQuickTemplateId={fileAccessId}
                                    validate={[validation.fileUploadRequired]}
                                />
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
                                children={formLocale.thesisSubmission.cancel}
                                disabled={props.submitting}
                                fullWidth
                                data-testid="cancel-submit-thesis"
                                onClick={cancelSubmit}
                                variant="contained"
                            />
                        </Grid>
                        <Grid item xs={12} sm="auto">
                            <Button
                                children={formLocale.thesisSubmission.submit}
                                color="primary"
                                disabled={props.submitting || disableSubmit}
                                fullWidth
                                id="submit-thesis"
                                data-analyticsid="submit-thesis"
                                data-testid="submit-thesis"
                                onClick={deposit}
                                variant="contained"
                            />
                        </Grid>
                    </Grid>
                </form>
            </ConfirmDiscardFormChanges>
        </StandardPage>
    );
};
SbsSubmission.propTypes = {
    ...propTypes, // all redux-form props
    actions: PropTypes.object,
    author: PropTypes.object,
    disableSubmit: PropTypes.bool,
    fileAccessId: PropTypes.number,
    isSessionValid: PropTypes.bool,
    newRecord: PropTypes.object,
    newRecordFileUploadingOrIssueError: PropTypes.bool,
};
export default SbsSubmission;
