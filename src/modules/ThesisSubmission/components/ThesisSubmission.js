import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes } from 'redux-form/immutable';
import { Field } from 'redux-form/immutable';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
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
    };

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
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

    openDepositConfirmation = () => {
        this.depositConfirmationBox.showConfirmation();
        this.props.actions.clearSessionExpiredFlag();
    };

    setDepositConfirmation = ref => {
        this.depositConfirmationBox = ref;
    };

    render() {
        const txt = formLocale.thesis;
        const txtFoR = locale.components.fieldOfResearchForm;
        const txtSupervisors = locale.components.thesisSubmissionSupervisors;
        const thesisLocale = formLocale.thesisSubmission;
        const pageTitle = this.props.isHdrThesis ? thesisLocale.hdrTitle : thesisLocale.sbsTitle;

        if (this.props.submitSucceeded) {
            return (
                <StandardPage title={pageTitle}>
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <StandardCard title={thesisLocale.afterSubmitTitle}>
                                <Grid container spacing={24}>
                                    <Grid item xs={12}>
                                        <Typography>{thesisLocale.afterSubmitText}</Typography>
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    </Grid>
                    {this.props.newRecordFileUploadingOrIssueError && (
                        <Grid container spacing={24}>
                            <Grid item xs={12}>
                                <Alert {...thesisLocale.fileUpload.failedAlertLocale} />
                            </Grid>
                        </Grid>
                    )}
                    <Grid container spacing={16}>
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
        // customise error for thesis submission
        const alertProps = validation.getErrorAlertProps({
            ...this.props,
            alertLocale: {
                validationAlert: { ...formLocale.validationAlert },
                progressAlert: { ...formLocale.progressAlert },
                successAlert: { ...formLocale.successAlert },
                errorAlert: {
                    ...formLocale.errorAlert,
                    message: () => thesisLocale.depositFailedMessage,
                },
            },
        });
        return (
            <StandardPage title={pageTitle}>
                <form>
                    <NavigationDialogBox
                        when={this.props.dirty && !this.props.submitSucceeded}
                        txt={formLocale.cancelWorkflowConfirmation}
                    />

                    <ConfirmDialogBox
                        onRef={this.setDepositConfirmation}
                        onAction={this.props.handleSubmit}
                        locale={thesisLocale.depositConfirmation}
                    />
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <StandardCard title={txt.information.title} help={txt.information.help}>
                                <Grid container spacing={24}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={RichEditorField}
                                            disabled={this.props.submitting}
                                            height={50}
                                            name="thesisTitle"
                                            required
                                            title={txt.information.fieldLabels.documentTitle.placeholder}
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            {...txt.information.fieldLabels.author}
                                            component={TextField}
                                            disabled={this.props.submitting}
                                            fullWidth
                                            name="currentAuthor.0.nameAsPublished"
                                            required
                                            rows={1}
                                            type="text"
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={ThesisSubtypeField}
                                            disabled={this.props.submitting}
                                            id="thesis-subtype"
                                            itemsList={THESIS_SUBMISSION_SUBTYPES}
                                            name="rek_genre_type"
                                            required
                                            validate={[validation.required]}
                                            {...txt.information.fieldLabels.thesisType}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={OrgUnitNameField}
                                            disabled={this.props.submitting}
                                            name="fez_record_search_key_org_unit_name.rek_org_unit_name"
                                            required
                                            validate={[validation.required]}
                                            {...txt.information.fieldLabels.orgUnitName}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={RichEditorField}
                                            disabled={this.props.submitting}
                                            name="thesisAbstract"
                                            required
                                            title={txt.optional.fieldLabels.abstract.label}
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
                                    disabled={this.props.submitting}
                                    locale={txtSupervisors.field}
                                    name="supervisors"
                                    required
                                    validate={[validation.supervisorRequired]}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={txtFoR.title} help={txtFoR.help}>
                                <Typography>{txtFoR.text}</Typography>
                                <Field
                                    component={FilteredFieldOfResearchListField}
                                    disabled={this.props.submitting}
                                    distinctOnly
                                    hideReorder
                                    locale={txtFoR.field}
                                    maxCount={3}
                                    name="fieldOfResearch"
                                    required
                                    validate={[validation.forRequired]}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={txt.keywords.title} help={txt.keywords.help}>
                                <Typography>{txt.keywords.description}</Typography>
                                <Field
                                    component={ListEditorField}
                                    disabled={this.props.submitting}
                                    locale={locale.components.keywordsForm.field}
                                    maxCount={10}
                                    maxInputLength={111}
                                    name="fez_record_search_key_keywords"
                                    required
                                    searchKey={{
                                        order: 'rek_keywords_order',
                                        value: 'rek_keywords',
                                    }}
                                    validate={[validation.requiredList]}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard help={thesisLocale.fileUpload.help} title={thesisLocale.fileUpload.title}>
                                <Field
                                    component={FileUploadField}
                                    defaultQuickTemplateId={this.props.fileAccessId}
                                    disabled={this.props.submitting}
                                    locale={thesisLocale.fileUpload.locale}
                                    name="files"
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
                    <Grid container spacing={16}>
                        <Grid item xs={false} sm />
                        <Grid item xs={12} sm="auto">
                            <Button
                                children={thesisLocale.cancel}
                                disabled={this.props.submitting}
                                fullWidth
                                onClick={this.cancelSubmit}
                                variant="contained"
                            />
                        </Grid>
                        <Grid item xs={12} sm="auto">
                            <Button
                                children={thesisLocale.submit}
                                color="primary"
                                disabled={this.props.submitting || this.props.disableSubmit}
                                fullWidth
                                id="submit-thesis"
                                onClick={this.deposit}
                                variant="contained"
                            />
                        </Grid>
                    </Grid>
                </form>
            </StandardPage>
        );
    }
}
