import React, { Component } from 'react';
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
export default class SbsSubmission extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props
        actions: PropTypes.object,
        author: PropTypes.object,
        disableSubmit: PropTypes.bool,
        fileAccessId: PropTypes.number,
        history: PropTypes.object,
        isSessionValid: PropTypes.bool,
        newRecord: PropTypes.object,
        newRecordFileUploadingOrIssueError: PropTypes.bool,
    };

    /* istanbul ignore next */
    componentDidUpdate() {
        if (this.props.isSessionValid && !this.props.submitting) {
            this.openDepositConfirmation();
        }
    }

    deposit = () => {
        this.props.actions.checkSession();
    };

    cancelSubmit = () => {
        window.location.reload();
    };
    /* istanbul ignore next */
    afterSubmit = () => {
        window.location.assign(formLocale.thesisSubmission.afterSubmitLink);
    };
    /* istanbul ignore next */
    openDepositConfirmation = () => {
        this.depositConfirmationBox.showConfirmation();
        this.props.actions.clearSessionExpiredFlag();
    };

    setDepositConfirmation = ref => {
        this.depositConfirmationBox = ref;
    };
    /* istanbul ignore next */
    afterFailedSubmit = () => {
        // Clears the current state completely and reloads the form
        window.location.reload();
    };

    // customise error for thesis submission
    getAlertProps = () =>
        validation.getErrorAlertProps({
            ...this.props,
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

    render() {
        const txt = formLocale.thesis;
        const txtFoR = locale.components.fieldOfResearchForm;
        const txtSupervisors = locale.components.thesisSubmissionSupervisors;
        const thesisLocale = formLocale.sbsSubmission;

        if (this.props.submitSucceeded) {
            return (
                <StandardPage title={formLocale.sbsSubmission.sbsTitle}>
                    <Grid container spacing={3}>
                        {this.props.newRecordFileUploadingOrIssueError ? (
                            <Grid item xs={12}>
                                <Alert {...thesisLocale.fileUpload.failedAlertLocale} action={this.afterFailedSubmit} />
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

        const alertProps = this.getAlertProps();

        return (
            <StandardPage title={formLocale.sbsSubmission.sbsTitle}>
                <ConfirmDiscardFormChanges dirty={this.props.dirty} submitSucceeded={this.props.submitSucceeded}>
                    <form>
                        <NavigationDialogBox
                            when={this.props.dirty && !this.props.submitSucceeded}
                            txt={formLocale.cancelWorkflowConfirmation}
                        />

                        <ConfirmDialogBox
                            onRef={this.setDepositConfirmation}
                            onAction={this.props.handleSubmit}
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
                                                disabled={this.props.submitting}
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
                                                disabled={this.props.submitting}
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
                                                disabled={this.props.submitting}
                                                validate={[validation.required]}
                                                {...txt.information.fieldLabels.thesisType}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field
                                                component={OrgNameField}
                                                name="fez_record_search_key_org_name.rek_org_name"
                                                disabled={this.props.submitting}
                                                validate={[validation.required]}
                                                required
                                                {...txt.information.fieldLabels.orgName}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field
                                                component={OrgUnitNameField}
                                                name="fez_record_search_key_org_unit_name.rek_org_unit_name"
                                                disabled={this.props.submitting}
                                                validate={[validation.required]}
                                                required
                                                {...txt.information.fieldLabels.orgUnitName}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field
                                                component={PartialDateField}
                                                disabled={this.props.submitting}
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
                                                disabled={this.props.submitting}
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
                                        disabled={this.props.submitting}
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
                                        disabled={this.props.submitting}
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
                                        disabled={this.props.submitting}
                                    />
                                </StandardCard>
                            </Grid>

                            <Grid item xs={12}>
                                <StandardCard title={txt.optional.fieldLabels.notes.title} help={txt.keywords.help}>
                                    <Field
                                        component={TextField}
                                        disabled={this.props.submitting}
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
                                        disabled={this.props.submitting}
                                        locale={formLocale.sbsSubmission.fileUpload.locale}
                                        defaultQuickTemplateId={this.props.fileAccessId}
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
                                    disabled={this.props.submitting}
                                    fullWidth
                                    data-testid="cancel-submit-thesis"
                                    onClick={this.cancelSubmit}
                                    variant="contained"
                                />
                            </Grid>
                            <Grid item xs={12} sm="auto">
                                <Button
                                    children={formLocale.thesisSubmission.submit}
                                    color="primary"
                                    disabled={this.props.submitting || this.props.disableSubmit}
                                    fullWidth
                                    id="submit-thesis"
                                    data-analyticsid="submit-thesis"
                                    data-testid="submit-thesis"
                                    onClick={this.deposit}
                                    variant="contained"
                                />
                            </Grid>
                        </Grid>
                    </form>
                </ConfirmDiscardFormChanges>
            </StandardPage>
        );
    }
}
