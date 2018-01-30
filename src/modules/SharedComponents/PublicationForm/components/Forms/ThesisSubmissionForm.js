import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form/immutable';

import {TextField} from 'uqlibrary-react-toolbox/build/TextField';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {PartialDateField} from 'uqlibrary-react-toolbox/build/PartialDate';

import {ThesisSubtypeField} from 'modules/SharedComponents/PublicationSubtype';
import {OrgNameField, OrgUnitNameField, FieldOfResearchListField} from 'modules/SharedComponents/LookupFields';
import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {ListEditorField} from 'uqlibrary-react-toolbox/build/ListEditor';
import {FileUploadField} from 'uqlibrary-react-toolbox/build/FileUploader';

import {validation} from 'config';
import {locale} from 'locale';
import {default as formLocale} from 'locale/publicationForm';

export default class ThesisForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool
    };
    constructor(props) {
        super(props);
    }
    render() {
        const txt = formLocale.thesis;
        return (
            <div>
                <StandardCard title={txt.information.title} help={txt.information.help}>
                    <div className="columns" style={{marginTop: '-12px'}}>
                        <div className="column">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                autoFocus
                                name="rek_title"
                                type="text"
                                fullWidth
                                multiLine
                                rows={1}
                                {...txt.information.fieldLabels.documentTitle}
                                className="requiredField"
                                validate={[validation.required]}
                            />
                        </div>
                    </div>
                    <div className="columns">
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
                        <div className="column is-half">
                            <Field
                                component={ThesisSubtypeField}
                                name="rek_genre_type"
                                disabled={this.props.submitting}
                                validate={[validation.required]}
                                locale={txt.information.fieldLabels.thesisType}
                                className="requiredField" />
                        </div>
                        <div className="column">
                            <Field
                                component={PartialDateField}
                                disabled={this.props.submitting}
                                name="rek_date"
                                allowPartial
                                className="requiredHintField"
                                validate={[validation.required]}
                                floatingTitle={txt.information.fieldLabels.date.title}
                                floatingTitleRequired />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="currentAuthor.0.nameAsPublished"
                                type="text"
                                fullWidth
                                rows={1}
                                {...txt.information.fieldLabels.author}
                                className="requiredField"
                                validate={[validation.required]} />
                        </div>
                    </div>
                </StandardCard>
                <StandardCard title={txt.supervisors.title} help={txt.supervisors.help}>
                    <div>{txt.supervisors.description}</div>
                    <Field
                        component={ContributorsEditorField}
                        className="requiredField"
                        name="supervisors"
                        validate={[validation.supervisorRequired]}
                        locale={txt.supervisors.field}
                        disabled={this.props.submitting}
                    />
                </StandardCard>

                <StandardCard title={txt.fieldOfResearch.title} help={txt.fieldOfResearch.help}>
                    <div>{txt.fieldOfResearch.description}</div>
                    <Field
                        component={FieldOfResearchListField}
                        name="fieldOfResearch"
                        className="requiredField"
                        validate={[validation.forRequired]}
                        hideReorder
                        distinctOnly
                        maxCount={3}
                        disabled={this.props.submitting}
                        locale={locale.components.fieldOfResearchForm.field} />
                </StandardCard>

                <StandardCard title={txt.keywords.title} help={txt.keywords.help}>
                    <div>{txt.keywords.description}</div>
                    <Field
                        component={ListEditorField}
                        name="fez_record_search_key_keywords"
                        maxCount={0}
                        validate={[validation.requiredList]}
                        searchKey={{value: 'rek_keywords', order: 'rek_keywords_order'}}
                        locale={locale.components.keywordsForm.field}
                        disabled={this.props.submitting} />
                </StandardCard>

                <StandardCard title={txt.optional.title} help={txt.optional.help}>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                name="fez_record_search_key_description.rek_description"
                                type="text"
                                disabled={this.props.submitting}
                                fullWidth
                                multiLine
                                rows={3}
                                {...txt.optional.fieldLabels.abstract} />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                name="fez_record_search_key_notes.rek_notes"
                                type="text"
                                disabled={this.props.submitting}
                                fullWidth
                                multiLine
                                rows={2}
                                {...txt.optional.fieldLabels.notes} />
                        </div>
                    </div>
                </StandardCard>

                <StandardCard title={formLocale.fileUpload.title} help={formLocale.fileUpload.help}>
                    <Field
                        name="files"
                        component={FileUploadField}
                        disabled={this.props.submitting}
                        validate={[validation.fileUploadRequired]} />
                </StandardCard>
            </div>
        );
    }
}
