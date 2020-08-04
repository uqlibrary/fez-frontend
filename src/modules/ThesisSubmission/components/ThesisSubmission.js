import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes } from 'redux-form/immutable';
import { Field } from 'redux-form/immutable';
import ReactHtmlParser from 'react-html-parser';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { ThesisSubtypeField } from 'modules/SharedComponents/PublicationSubtype';
import { OrgUnitNameField, FilteredFieldOfResearchListField } from 'modules/SharedComponents/LookupFields';
import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { ListEditorField } from 'modules/SharedComponents/Toolbox/ListEditor';
import { FileUploadField } from 'modules/SharedComponents/Toolbox/FileUploader';

import { validation } from 'config';
import locale from 'locale/components';
import { default as formLocale } from 'locale/publicationForm';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { THESIS_SUBMISSION_SUBTYPES } from 'config/general';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default class ThesisSubmission extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props
        actions: PropTypes.object.isRequired,
        author: PropTypes.object,
        disableSubmit: PropTypes.bool,
        fileAccessId: PropTypes.number,
        isHdrThesis: PropTypes.bool, // HDR thesis if true or SBS thesis if false
        isSessionValid: PropTypes.bool,
        newRecord: PropTypes.object,
        newRecordFileUploadingOrIssueError: PropTypes.bool,
        retryUpload: PropTypes.func,
    };

    constructor(props) {
        super(props);
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.isSessionValid && !nextProps.submitting) {
            this.openDepositConfirmation();
        }
    }

    deposit = () => {
        this.props.actions.checkSession();
    };

    cancelSubmit = () => {
        window.location.assign(formLocale.thesisSubmission.cancelLink);
    };

    afterSubmit = () => {
        window.location.assign(formLocale.thesisSubmission.afterSubmitLink);
    };

    retryUpload = () => {
        this.props.retryUpload(this.props.formValues);
    };

    openDepositConfirmation = () => {
        this.depositConfirmationBox.showConfirmation();
        this.props.actions.clearSessionExpiredFlag();
    };

    setDepositConfirmation = ref => {
        this.depositConfirmationBox = ref;
    };

    getfileUploadAlertProps = locale => {
        const { actionButtonLabel, type, title } = locale;
        const emailSubject = locale.emailSubject
            .replace('[studentFullName]', `${this.props.author.aut_fname} ${this.props.author.aut_lname}`)
            .replace('[studentNumber]', this.props.author.aut_org_student_id);
        const mailtoUri = `mailto:${locale.emailRecipient}?subject=${encodeURIComponent(emailSubject)}`;
        const message = ReactHtmlParser(
            locale.message.replace('[linkStart]', `<a href="${mailtoUri}">`).replace('[linkEnd]', '</a>'),
        );
        return { actionButtonLabel, type, title, message };
    };

    // customise error for thesis submission
    getFormSubmitAlertProps = () =>
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
        const thesisLocale = formLocale.thesisSubmission;
        const pageTitle = this.props.isHdrThesis ? thesisLocale.hdrTitle : thesisLocale.sbsTitle;

        if (this.props.submitSucceeded) {
            return (
                <StandardPage title={pageTitle}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <StandardCard title={thesisLocale.afterSubmitTitle}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography>{thesisLocale.afterSubmitText}</Typography>
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    </Grid>
                    {this.props.newRecordFileUploadingOrIssueError && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Alert
                                    {...this.getfileUploadAlertProps(thesisLocale.fileUpload.failedAlertLocale)}
                                    action={this.retryUpload}
                                />
                            </Grid>
                        </Grid>
                    )}
                    <Grid container spacing={2}>
                        <Grid item xs />
                        <Grid item>
                            <Button
                                children={thesisLocale.afterSubmit}
                                color={!this.props.newRecordFileUploadingOrIssueError ? 'primary' : 'default'}
                                fullWidth
                                onClick={this.afterSubmit}
                                variant={'contained'}
                            />
                        </Grid>
                    </Grid>
                </StandardPage>
            );
        }

        const alertProps = this.getFormSubmitAlertProps();

        return (
            <StandardPage title={pageTitle}>
                <ConfirmDiscardFormChanges dirty={this.props.dirty} submitSucceeded={this.props.submitSucceeded}>
                    <form>
                        <NavigationDialogBox
                            when={this.props.dirty && !this.props.submitSucceeded}
                            txt={formLocale.cancelWorkflowConfirmation}
                        />

                        <ConfirmDialogBox
                            confirmDialogBoxId="thesis"
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
                                                title={txt.information.fieldLabels.documentTitle.placeholder}
                                                disabled={this.props.submitting}
                                                height={50}
                                                required
                                                validate={[validation.required]}
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
                                                component={ThesisSubtypeField}
                                                id="thesis-subtype"
                                                itemsList={THESIS_SUBMISSION_SUBTYPES}
                                                name="rek_genre_type"
                                                disabled={this.props.submitting}
                                                validate={[validation.required]}
                                                {...txt.information.fieldLabels.thesisType}
                                                required
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
                                                component={RichEditorField}
                                                disabled={this.props.submitting}
                                                title={txt.optional.fieldLabels.abstract.label}
                                                name="thesisAbstract"
                                                required
                                                validate={[validation.required]}
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
                                        required
                                        maxCount={10}
                                        validate={[validation.requiredList]}
                                        maxInputLength={111}
                                        searchKey={{
                                            value: 'rek_keywords',
                                            order: 'rek_keywords_order',
                                        }}
                                        listEditorId="rek-keywords"
                                        locale={locale.components.keywordsForm.field}
                                        disabled={this.props.submitting}
                                    />
                                </StandardCard>
                            </Grid>
                            <Grid item xs={12}>
                                <StandardCard
                                    title={formLocale.thesisSubmission.fileUpload.title}
                                    help={formLocale.thesisSubmission.fileUpload.help}
                                >
                                    <Field
                                        name="files"
                                        component={FileUploadField}
                                        disabled={this.props.submitting}
                                        locale={formLocale.thesisSubmission.fileUpload.locale}
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
                                    variant="contained"
                                    fullWidth
                                    children={formLocale.thesisSubmission.cancel}
                                    disabled={this.props.submitting}
                                    onClick={this.cancelSubmit}
                                />
                            </Grid>
                            <Grid item xs={12} sm="auto">
                                <Button
                                    variant="contained"
                                    id="submit-thesis"
                                    data-testid="deposit-thesis"
                                    color="primary"
                                    fullWidth
                                    children={formLocale.thesisSubmission.submit}
                                    onClick={this.deposit}
                                    disabled={this.props.submitting || this.props.disableSubmit}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </ConfirmDiscardFormChanges>
            </StandardPage>
        );
    }
}
