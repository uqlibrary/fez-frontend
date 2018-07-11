import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';

import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {NavigationDialogBox} from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import {ConfirmDialogBox} from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import RaisedButton from 'material-ui/RaisedButton';
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

export default class ThesisSubmission extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props
        author: PropTypes.object,
        isHdrThesis: PropTypes.bool, // HDR thesis if true or SBS thesis if false
        disableSubmit: PropTypes.bool,
        fileAccessId: PropTypes.number,
        actions: PropTypes.object,
        isSessionValid: PropTypes.bool
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
        this.props.actions.checkSession('form');
    }

    cancelSubmit = () => {
        window.location.assign(formLocale.thesisSubmission.cancelLink);
    }

    afterSubmit = () => {
        window.location.assign(formLocale.thesisSubmission.afterSubmitLink);
    }

    openDepositConfirmation = () => {
        this.depositConfirmationBox.showConfirmation();
    };

    setDepositConfirmation = (ref) => {
        this.depositConfirmationBox = ref;
    };

    render() {
        const txt = formLocale.thesis;
        const txtFoR = locale.components.fieldOfResearchForm;
        const txtSupervisors = locale.components.thesisSubmissionSupervisors;

        if (this.props.submitSucceeded) {
            return (
                <StandardPage title={this.props.isHdrThesis ? formLocale.thesisSubmission.hdrTitle : formLocale.thesisSubmission.sbsTitle}>
                    <StandardCard>
                        {formLocale.thesisSubmission.afterSubmitText}
                    </StandardCard>
                    <div className="columns action-buttons">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                secondary
                                fullWidth
                                label={formLocale.thesisSubmission.afterSubmit}
                                onClick={this.afterSubmit}/>
                        </div>
                    </div>
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
                <p>{formLocale.thesisSubmission.text}</p>
                <form>
                    <NavigationDialogBox
                        when={this.props.dirty && !this.props.submitSucceeded}
                        txt={formLocale.cancelWorkflowConfirmation}/>

                    <ConfirmDialogBox
                        onRef={this.setDepositConfirmation}
                        onAction={this.props.handleSubmit}
                        locale={formLocale.thesisSubmission.depositConfirmation}
                    />

                    <StandardCard title={txt.information.title} help={txt.information.help}>
                        <div className="columns" style={{marginTop: '6px'}}>
                            <div className="column requiredField">
                                <label htmlFor="thesisTitle">{txt.information.fieldLabels.documentTitle.floatingLabelText}</label>
                                <Field
                                    component={RichEditorField}
                                    name="thesisTitle"
                                    disabled={this.props.submitting}
                                    height={50}
                                    validate={[validation.required]}/>
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column is-half">
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="currentAuthor.0.nameAsPublished"
                                    type="text"
                                    fullWidth
                                    rows={1}
                                    {...txt.information.fieldLabels.author}
                                    className="requiredField"
                                    validate={[validation.required]}/>
                            </div>
                            <div className="column ">
                                <Field
                                    component={ThesisSubtypeField}
                                    itemsList={thesisSubmissionSubtypes}
                                    name="rek_genre_type"
                                    disabled={this.props.submitting}
                                    validate={[validation.required]}
                                    locale={txt.information.fieldLabels.thesisType}
                                    className="requiredField"/>
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                <Field
                                    component={OrgUnitNameField}
                                    name="fez_record_search_key_org_unit_name.rek_org_unit_name"
                                    disabled={this.props.submitting}
                                    validate={[validation.required]}
                                    className="requiredField"
                                    {...txt.information.fieldLabels.orgUnitName}
                                />
                            </div>
                        </div>
                        <div className="columns" style={{marginTop: '6px'}}>
                            <div className="column requiredField">
                                <label htmlFor="thesisAbstract">{txt.optional.fieldLabels.abstract.floatingLabelText}</label>
                                <Field
                                    component={RichEditorField}
                                    disabled={this.props.submitting}
                                    name="thesisAbstract"
                                    validate={[validation.required]}/>
                            </div>
                        </div>
                    </StandardCard>


                    <StandardCard title={txtSupervisors.title} help={txtSupervisors.help}>
                        <Field
                            component={ContributorsEditorField}
                            className="requiredField"
                            name="supervisors"
                            validate={[validation.supervisorRequired]}
                            locale={txtSupervisors.field}
                            disabled={this.props.submitting}
                        />
                    </StandardCard>

                    <StandardCard title={txtFoR.title} help={txtFoR.help}>
                        <div>{txtFoR.text}</div>
                        <Field
                            component={FilteredFieldOfResearchListField}
                            name="fieldOfResearch"
                            className="requiredField"
                            validate={[validation.forRequired]}
                            hideReorder
                            distinctOnly
                            maxCount={3}
                            disabled={this.props.submitting}
                            locale={txtFoR.field}/>
                    </StandardCard>

                    <StandardCard title={txt.keywords.title} help={txt.keywords.help}>
                        <div>{txt.keywords.description}</div>
                        <Field
                            component={ListEditorField}
                            name="fez_record_search_key_keywords"
                            className="requiredField"
                            maxCount={10}
                            validate={[validation.requiredList]}
                            searchKey={{value: 'rek_keywords', order: 'rek_keywords_order'}}
                            locale={locale.components.keywordsForm.field}
                            disabled={this.props.submitting}/>
                    </StandardCard>

                    <StandardCard title={formLocale.thesisSubmission.fileUpload.title} help={formLocale.thesisSubmission.fileUpload.help}>
                        <Field
                            name="files"
                            component={FileUploadField}
                            disabled={this.props.submitting}
                            locale={formLocale.thesisSubmission.fileUpload.locale}
                            defaultQuickTemplateId={this.props.fileAccessId}
                            validate={[validation.fileUploadRequired]}/>
                    </StandardCard>

                    {
                        alertProps &&
                        <Alert {...alertProps} />
                    }

                    <div className="columns action-buttons">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                fullWidth
                                label={formLocale.thesisSubmission.cancel}
                                disabled={this.props.submitting}
                                onClick={this.cancelSubmit}/>
                        </div>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                secondary
                                fullWidth
                                label={formLocale.thesisSubmission.submit}
                                onClick={this.deposit}
                                disabled={this.props.submitting || this.props.disableSubmit}/>
                        </div>
                    </div>
                </form>
            </StandardPage>
        );
    }
}
