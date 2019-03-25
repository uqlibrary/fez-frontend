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
import {OrgUnitNameField, FilteredFieldOfResearchListField} from 'modules/SharedComponents/LookupFields';
import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {ListEditorField} from 'modules/SharedComponents/Toolbox/ListEditor';
import {FileUploadField} from 'modules/SharedComponents/Toolbox/FileUploader';

import {validation} from 'config';
import locale from 'locale/components';
import {default as formLocale} from 'locale/publicationForm';
import {RichEditorField} from 'modules/SharedComponents/RichEditor';
import {thesisSubmissionSubtypes} from 'config/general';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {routes} from 'config';

export default class ThesisSubmission extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props
        actions: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        author: PropTypes.object,
        isHdrThesis: PropTypes.bool, // HDR thesis if true or SBS thesis if false
        disableSubmit: PropTypes.bool,
        fileAccessId: PropTypes.number,
        isSessionValid: PropTypes.bool,
        newRecordFileUploadingOrIssueError: PropTypes.bool,
        newRecord: PropTypes.object
    };

    static contextTypes = {
        selectFieldMobileOverrides: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

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
        window.location.assign(formLocale.thesisSubmission.cancelLink);
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

    fixRecord = () => {
        console.log(this.props.newRecord);
        if (this.props.newRecord) {
            this.props.history.push(routes.pathConfig.records.fix(this.props.newRecord.rek_pid));
            this.props.actions.setFixRecord(this.props.newRecord);
        }
    };

    render() {
        const txt = formLocale.thesis;
        const txtFoR = locale.components.fieldOfResearchForm;
        const txtSupervisors = locale.components.thesisSubmissionSupervisors;

        if (this.props.submitSucceeded) {
            return (
                <StandardPage title={this.props.isHdrThesis ? formLocale.thesisSubmission.hdrTitle : formLocale.thesisSubmission.sbsTitle}>
                    <Grid container spacing={24}>
                        {
                            this.props.newRecordFileUploadingOrIssueError &&
                            <Grid item xs={12}>
                                <Alert
                                    {...formLocale.thesisSubmission.fileUpload.failedAlertLocale}
                                    action={this.fixRecord}
                                />
                            </Grid>
                        }
                        <Grid item xs={12}>
                            <StandardCard title={formLocale.thesisSubmission.afterSubmitTitle}>
                                <Typography>{formLocale.thesisSubmission.afterSubmitText}</Typography>
                            </StandardCard>
                        </Grid>
                    </Grid>
                    <Grid container spacing={16}>
                        <Grid item xs/>
                        <Grid item>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                fullWidth
                                children={formLocale.thesisSubmission.afterSubmit}
                                onClick={this.afterSubmit}/>
                        </Grid>
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
            <StandardPage title={this.props.isHdrThesis ? formLocale.thesisSubmission.hdrTitle : formLocale.thesisSubmission.sbsTitle}>
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
                                            title={txt.information.fieldLabels.documentTitle.placeholder}
                                            disabled={this.props.submitting}
                                            height={50}
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
                                    required
                                    maxCount={10}
                                    validate={[validation.requiredList]}
                                    maxInputLength={111}
                                    searchKey={{value: 'rek_keywords', order: 'rek_keywords_order'}}
                                    locale={locale.components.keywordsForm.field}
                                    disabled={this.props.submitting}/>
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={formLocale.thesisSubmission.fileUpload.title} help={formLocale.thesisSubmission.fileUpload.help}>
                                <Field
                                    name="files"
                                    component={FileUploadField}
                                    disabled={this.props.submitting}
                                    locale={formLocale.thesisSubmission.fileUpload.locale}
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
