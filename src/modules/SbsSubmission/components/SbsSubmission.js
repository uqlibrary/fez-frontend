import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';

import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {NavigationDialogBox} from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import {ConfirmDialogBox} from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {ThesisSubtypeField} from 'modules/SharedComponents/PublicationSubtype';
import {OrgUnitNameField, FilteredFieldOfResearchListField, OrgNameField} from 'modules/SharedComponents/LookupFields';
import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {ListEditorField} from 'modules/SharedComponents/Toolbox/ListEditor';
import {FileUploadField} from 'modules/SharedComponents/Toolbox/FileUploader';
import {PartialDateField} from 'modules/SharedComponents/Toolbox/PartialDate';

import {validation} from 'config';
import locale from 'locale/components';
import {default as formLocale} from 'locale/publicationForm';
import {RichEditorField} from 'modules/SharedComponents/RichEditor';
import {thesisSubmissionSubtypes} from 'config/general';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default class SbsSubmission extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props
        author: PropTypes.object,
        isHdrThesis: PropTypes.bool, // HDR thesis if true or SBS thesis if false
        disableSubmit: PropTypes.bool,
        fileAccessId: PropTypes.number,
        actions: PropTypes.object,
        history: PropTypes.object,
        isSessionValid: PropTypes.bool,
        newRecordFileUploadingOrIssueError: PropTypes.bool,
        newRecord: PropTypes.object
    };

    static contextTypes = {
        selectFieldMobileOverrides: PropTypes.object
    };

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.isSessionValid &&
            !nextProps.submitting
        ) {
            this.openDepositConfirmation();
        }
    }

    deposit = () => {
        this.props.actions.checkSession();
    }

    cancelSubmit = () => {
        window.location.reload();
    }

    afterSubmit = () => {
        window.location.assign(formLocale.thesisSubmission.afterSubmitLink);
    }

    openDepositConfirmation = () => {
        this.depositConfirmationBox.showConfirmation();
        this.props.actions.clearSessionExpiredFlag();
    };

    setDepositConfirmation = (ref) => {
        this.depositConfirmationBox = ref;
    };

    afterFailedSubmit = () => {
        // Clears the current state completely and reloads the form
        window.location.reload();
    }

    render() {
        const txt = formLocale.thesis;
        const txtFoR = locale.components.fieldOfResearchForm;
        const txtSupervisors = locale.components.thesisSubmissionSupervisors;

        if (this.props.submitSucceeded) {
            return (
                <StandardPage title={formLocale.sbsSubmission.sbsTitle}>
                    <Grid container spacing={24}>
                        {
                            this.props.newRecordFileUploadingOrIssueError ?
                                <Grid item xs={12}>
                                    <Alert
                                        {...formLocale.thesisSubmission.fileUpload.failedAlertLocale}
                                        action={this.afterFailedSubmit}
                                    />
                                </Grid>
                                :
                                <Grid item xs={12}>
                                    <StandardCard title={formLocale.sbsSubmission.afterSubmitTitle}>
                                        <Typography>{formLocale.sbsSubmission.afterSubmitText}</Typography>
                                    </StandardCard>
                                </Grid>
                        }
                    </Grid>
                </StandardPage>
            );
        }
        // customise error for thesis submission
        const alertProps = validation.getErrorAlertProps({
            ...this.props,
            alertLocale: {
                validationAlert: {...formLocale.validationAlert},
                progressAlert: {...formLocale.progressAlert},
                successAlert: {...formLocale.successAlert},
                errorAlert: {
                    ...formLocale.errorAlert,
                    message: formLocale.thesisSubmission.depositFailedMessage
                }
            }});
        return (
            <StandardPage title={formLocale.sbsSubmission.sbsTitle}>
                <form>
                    <NavigationDialogBox
                        when={this.props.dirty && !this.props.submitSucceeded}
                        txt={formLocale.cancelWorkflowConfirmation}/>

                    <ConfirmDialogBox
                        onRef={this.setDepositConfirmation}
                        onAction={this.props.handleSubmit}
                        locale={formLocale.thesisSubmission.depositConfirmation}
                    />
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <StandardCard title={txt.information.title} help={txt.information.help}>
                                <Grid container spacing={24}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={RichEditorField}
                                            name="thesisTitle"
                                            disabled={this.props.submitting}
                                            height={50}
                                            title={txt.information.fieldLabels.documentTitle.placeholder}
                                            validate={[validation.required]}/>
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
                                            validate={[validation.required]}/>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={ThesisSubtypeField}
                                            itemsList={thesisSubmissionSubtypes}
                                            name="rek_genre_type"
                                            disabled={this.props.submitting}
                                            validate={[validation.required]}
                                            locale={txt.information.fieldLabels.thesisType}
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
                                            validate={[validation.required]}/>
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={txtSupervisors.title} help={txtSupervisors.help}>
                                <Field
                                    component={ContributorsEditorField}
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
                                    name="fieldOfResearch"
                                    required
                                    validate={[validation.forRequired]}
                                    hideReorder
                                    distinctOnly
                                    maxCount={3}
                                    disabled={this.props.submitting}
                                    locale={txtFoR.field}/>
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={txt.keywords.title} help={txt.keywords.help}>
                                <Typography>{txt.keywords.description}</Typography>
                                <Field
                                    component={ListEditorField}
                                    name="fez_record_search_key_keywords"
                                    maxCount={10}
                                    searchKey={{value: 'rek_keywords', order: 'rek_keywords_order'}}
                                    locale={locale.components.keywordsForm.field}
                                    disabled={this.props.submitting}/>
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
                            <StandardCard title={formLocale.sbsSubmission.fileUpload.title} help={formLocale.sbsSubmission.fileUpload.help}>
                                <Field
                                    name="files"
                                    component={FileUploadField}
                                    disabled={this.props.submitting}
                                    locale={formLocale.sbsSubmission.fileUpload.locale}
                                    defaultQuickTemplateId={this.props.fileAccessId}
                                    validate={[validation.fileUploadRequired]}/>
                            </StandardCard>
                        </Grid>

                        {
                            alertProps &&
                            <Grid item xs={12}>
                                <Alert {...alertProps} />
                            </Grid>
                        }
                    </Grid>
                    <Grid container spacing={16}>
                        <Grid item xs={false} sm />
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                variant={'contained'}
                                fullWidth
                                children={formLocale.thesisSubmission.cancel}
                                disabled={this.props.submitting}
                                onClick={this.cancelSubmit}/>
                        </Grid>
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                fullWidth
                                children={formLocale.thesisSubmission.submit}
                                onClick={this.deposit}
                                disabled={this.props.submitting || this.props.disableSubmit}/>
                        </Grid>
                    </Grid>
                </form>
            </StandardPage>
        );
    }
}
