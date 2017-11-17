import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Field} from 'redux-form/immutable';

import {TextField, StandardCard, PartialDateField} from 'uqlibrary-react-toolbox';
import {OrgNameField, OrgUnitNameField, SeriesField} from 'modules/SharedComponents/LookupFields';

import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {validation, locale} from 'config';

export default class SeminarPaperForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool,
    };

    constructor(props) {
        super(props);
    }

    render() {
        // path to the locale data for each of the sections
        const txt = locale.forms.publicationForm.seminarPaper;

        return (
            <div>
                <StandardCard title={txt.information.title} help={txt.information.help}>
                    <div className="columns">
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
                                validate={[validation.required]} />
                        </div>
                    </div>

                    <div className="columns">
                        <div className="column">
                            <Field
                                component={OrgUnitNameField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_org_unit_name.rek_org_unit_name"
                                {...txt.information.fieldLabels.orgUnitName} />
                        </div>
                        <div className="column">
                            <Field
                                component={OrgNameField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_org_name.rek_org_name"
                                {...txt.information.fieldLabels.orgName} />
                        </div>
                    </div>

                    <div className="columns">
                        <div className="column">
                            <Field
                                component={SeriesField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_series.rek_series"
                                {...txt.information.fieldLabels.series} />
                        </div>
                        <div className="column">
                            <Field
                                component={PartialDateField}
                                disabled={this.props.submitting}
                                name="rek_date"
                                allowPartial
                                className="requiredHintField"
                                validate={[validation.required]}
                                floatingTitle={txt.information.fieldLabels.seminarDate.title}
                                floatingTitleRequired
                            />
                        </div>
                    </div>
                </StandardCard>

                <StandardCard title={txt.authors.title} help={txt.authors.help}>
                    <div>{txt.authors.description}</div>
                    <Field
                        component={ContributorsEditorField}
                        showContributorAssignment
                        className="requiredField"
                        name="authors"
                        validate={[validation.authorRequired]}
                        locale={txt.authors.field}
                        disabled={this.props.submitting}
                    />
                </StandardCard>

                <StandardCard title={txt.optional.title} help={txt.optional.help}>
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
                                {...txt.optional.fieldLabels.notes} />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                name="fez_record_search_key_link[0].rek_link"
                                type="text"
                                disabled={this.props.submitting}
                                fullWidth
                                {...txt.optional.fieldLabels.url}
                                validate={[validation.url]} />
                        </div>
                    </div>
                </StandardCard>
            </div>
        );
    }
}
