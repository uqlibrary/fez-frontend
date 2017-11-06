import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form/immutable';
import {ThesisSubtypeField} from 'modules/SharedComponents/PublicationSubtype';
import {TextField, StandardCard, PartialDateField} from 'uqlibrary-react-toolbox';
import {OrgUnitsField} from 'modules/SharedComponents/AutoSuggestField';
import {validation, locale} from 'config';
import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';

export default class ThesisForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool
    }
    constructor(props) {
        super(props);
    }

    render() {
        const txt = locale.components.publicationForm.thesis;
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
                                floatingLabelText={txt.information.fieldLabels.documentTitle.title}
                                hintText={txt.information.fieldLabels.documentTitle.hint}
                                className="requiredField"
                                validate={[validation.required]}
                            />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half">
                            <Field
                                component={OrgUnitsField}
                                name="fez_record_search_key_org_unit_name.rek_org_unit_name"
                                disabled={this.props.submitting}
                                validate={[validation.required]}
                                className="requiredField"
                                floatingLabelText={txt.information.fieldLabels.orgUnit.title}
                            />
                        </div>
                        <div className="column is-half">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_org_name.rek_org_name"
                                type="text"
                                fullWidth
                                className="requiredField"
                                validate={[validation.required]}
                                floatingLabelText={txt.information.fieldLabels.institution.title}/>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half">
                            <Field
                                component={PartialDateField}
                                disabled={this.props.submitting}
                                name="rek_date"
                                allowPartial
                                className="requiredHintField"
                                validate={[validation.required]}
                                floatingTitle={txt.information.fieldLabels.date.title}
                                floatingTitleRequired
                            />
                        </div>
                        <div className="column is-half">
                            <Field
                                component={ThesisSubtypeField}
                                name="rek_genre_type"
                                disabled={this.props.submitting}
                                validate={[validation.required]}
                                locale={{label: txt.information.fieldLabels.thesisType.title, loading: locale.global.loading}}
                                className="requiredField" />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                autoFocus
                                name="fez_record_search_key_author.rek_author"
                                type="text"
                                fullWidth
                                multiLine
                                rows={1}
                                floatingLabelText={txt.information.fieldLabels.author.title}
                                hintText={txt.information.fieldLabels.date.hint}
                                className="requiredField"
                                validate={[validation.required]}
                            />
                        </div>
                    </div>
                </StandardCard>
                <StandardCard title={txt.supervisors.title} help={txt.supervisors.help}>
                    <div>{txt.supervisors.description}</div>
                    <Field
                        component={ContributorsEditorField}
                        showContributorAssignment
                        className="requiredField"
                        name="supervisors"
                        locale={txt.supervisors.field}
                        disabled={this.props.submitting}
                        validate={[validation.authorRequired]} />
                </StandardCard>
                <StandardCard title={txt.optional.title} help={txt.optional.help}>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_subject.rek_subject"
                                type="text"
                                fullWidth
                                floatingLabelText={txt.information.fieldLabels.fieldOfResearch.title}/>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_doi.rek_doi"
                                type="text"
                                fullWidth
                                floatingLabelText={txt.information.fieldLabels.DOI.title}/>
                        </div>
                        <div className="column is-half">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_total_pages.rek_total_pages"
                                type="text"
                                fullWidth
                                floatingLabelText={txt.information.fieldLabels.totalPages.title}/>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                name="fez_record_search_key_description.rek_description"
                                type="text"
                                disabled={this.props.submitting}
                                fullWidth
                                multiLine
                                rows={1}
                                floatingLabelText={txt.information.fieldLabels.abstract.title}/>
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
                                rows={1}
                                floatingLabelText={txt.information.fieldLabels.notes.title}/>
                        </div>
                    </div>
                </StandardCard>
            </div>
        );
    }
}
