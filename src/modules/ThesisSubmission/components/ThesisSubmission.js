import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';

import {Alert} from 'uqlibrary-react-toolbox/build/Alert';
import {NavigationDialogBox} from 'uqlibrary-react-toolbox/build/NavigationPrompt';

import RaisedButton from 'material-ui/RaisedButton';
import {TextField} from 'uqlibrary-react-toolbox/build/TextField';
import {StandardPage} from 'uqlibrary-react-toolbox/build/StandardPage';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';

import {ThesisSubtypeField} from 'modules/SharedComponents/PublicationSubtype';
import {OrgNameField, OrgUnitNameField, FilteredFieldOfResearchListField} from 'modules/SharedComponents/LookupFields';
import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {ListEditorField} from 'uqlibrary-react-toolbox/build/ListEditor';
import {FileUploadField} from 'uqlibrary-react-toolbox/build/FileUploader';

import {validation} from 'config';
import {locale} from 'locale';
import {default as formLocale} from 'locale/publicationForm';
import {RichEditorField} from 'modules/SharedComponents/RichEditor';
import {thesisSubmissionSubtypes} from 'config/general';

export default class ThesisSubmission extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props
        author: PropTypes.object,
        isHdrThesis: PropTypes.bool // HDR thesis if true or SBS thesis if false
    };

    static contextTypes = {
        selectFieldMobileOverrides: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    getAlert = ({submitFailed = false, dirty = false, invalid = false, submitting = false, error, submitSucceeded = false, alertLocale = {}}) => {
        let alertProps = null;
        if (submitFailed && error) {
            alertProps = {
                ...alertLocale.errorAlert,
                message: alertLocale.errorAlert.message ? alertLocale.errorAlert.message(error) : error
            };
        } else if (dirty && invalid) {
            const message = (
                <span>
                    {alertLocale.validationAlert.message}
                    <ul>
                        {
                            error && error.length > 0 && error.map((item, index) => (
                                <li key={`validation-${index}`}>{item}</li>
                            ))
                        }
                    </ul>
                </span>);

            alertProps = {...alertLocale.validationAlert, message: message};
        } else if (submitting) {
            alertProps = {...alertLocale.progressAlert};
        } else if (submitSucceeded) {
            alertProps = {...alertLocale.successAlert};
        }
        return alertProps ? (<Alert {...alertProps} />) : null;
    };

    cancelSubmit = () => {
        window.location.assign(formLocale.thesisSubmission.cancelLink);
    }

    afterSubmit = () => {
        window.location.assign(formLocale.thesisSubmission.afterSubmitLink);
    }

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
                                onTouchTap={this.afterSubmit}/>
                        </div>
                    </div>
                </StandardPage>
            );
        }
        return (
            <StandardPage title={this.props.isHdrThesis ? formLocale.thesisSubmission.hdrTitle : formLocale.thesisSubmission.sbsTitle}>
                <p>{formLocale.thesisSubmission.text}</p>
                <form>
                    <NavigationDialogBox
                        when={this.props.dirty && !this.props.submitSucceeded}
                        txt={formLocale.cancelWorkflowConfirmation}/>

                    <StandardCard title={txt.information.title} help={txt.information.help}>
                        <div className="columns">
                            <div className="column requiredField">
                                <label htmlFor="thesisTitle">{txt.information.fieldLabels.documentTitle.floatingLabelText}</label>
                                <Field
                                    component={RichEditorField}
                                    name="thesisTitle"
                                    disabled={this.props.submitting}
                                    height={50}
                                />
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
                        <div className="columns" style={{marginTop: '-12px'}}>
                            <div className="column is-half">
                                <Field
                                    component={OrgUnitNameField}
                                    name="fez_record_search_key_org_unit_name.rek_org_unit_name"
                                    disabled={this.props.submitting}
                                    validate={[validation.required]}
                                    className="requiredField"
                                    {...txt.information.fieldLabels.orgUnitName}
                                />
                            </div>
                            <div className="column">
                                <Field
                                    component={OrgNameField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_org_name.rek_org_name"
                                    className="requiredField"
                                    validate={[validation.required]}
                                    {...txt.information.fieldLabels.orgName}/>
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column requiredField">
                                <label htmlFor="thesisAbstract">{txt.optional.fieldLabels.abstract.floatingLabelText}</label>
                                <Field
                                    component={RichEditorField}
                                    disabled={this.props.submitting}
                                    name="thesisAbstract"
                                />
                            </div>
                        </div>
                    </StandardCard>


                    <StandardCard title={txtSupervisors.title} help={txtSupervisors.help}>
                        <div>{txtSupervisors.description}</div>
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
                            defaultQuickTemplateId={3}
                            validate={[validation.fileUploadRequired]}/>
                    </StandardCard>

                    {
                        this.getAlert({...this.props, alertLocale: formLocale})
                    }

                    <div className="columns action-buttons">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                fullWidth
                                label={formLocale.thesisSubmission.cancel}
                                disabled={this.props.submitting}
                                onTouchTap={this.cancelSubmit}/>
                        </div>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                secondary
                                fullWidth
                                label={formLocale.thesisSubmission.submit}
                                onTouchTap={this.props.handleSubmit}
                                disabled={this.props.submitting || (!(this.props.submitFailed && this.props.error) && this.props.invalid)}
                            />
                        </div>
                    </div>
                </form>
            </StandardPage>
        );
    }
}
