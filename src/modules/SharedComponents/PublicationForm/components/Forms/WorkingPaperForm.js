import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form/immutable';

import {TextField} from 'uqlibrary-react-toolbox/build/TextField';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {PartialDateField} from 'uqlibrary-react-toolbox/build/PartialDate';

import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {OrgUnitNameField, SeriesField, ReportNumberField, OrgNameField} from 'modules/SharedComponents/LookupFields';

import {validation} from 'config';
import {default as formLocale} from 'config/locale.forms.PublicationForm';

export default class WorkingPaperForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool
    };

    constructor(props) {
        super(props);
    }
    getNumbersOnly = (value) => {
        return value.replace(/[^\d]/g, '');
    };

    render() {
        const txt = formLocale.workingPaper;
        return (
            <div>
                <StandardCard title={txt.information.title} help={txt.information.help}>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                autoFocus
                                disabled={this.props.submitting}
                                name="rek_title"
                                className="requiredField"
                                type="text"
                                fullWidth
                                multiLine
                                rows={1}
                                {...txt.information.fieldLabels.documentTitle}
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
                                {...txt.information.fieldLabels.orgUnitName}
                            />
                        </div>
                        <div className="column">
                            <Field
                                component={OrgNameField}
                                name="fez_record_search_key_org_name.rek_org_name"
                                disabled={this.props.submitting}
                                {...txt.information.fieldLabels.orgName}

                            />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half">
                            <Field
                                component={SeriesField}
                                name="fez_record_search_key_series.rek_series"
                                disabled={this.props.submitting}
                                {...txt.information.fieldLabels.series}
                            />
                        </div>
                        <div className="column">
                            <Field
                                component={ReportNumberField}
                                name="fez_record_search_key_report_number.rek_report_number"
                                disabled={this.props.submitting}
                                {...txt.information.fieldLabels.paperNumber}
                            />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_total_pages.rek_total_pages"
                                type="text"
                                fullWidth
                                normalize={this.getNumbersOnly}
                                {...txt.information.fieldLabels.totalPages}
                            />
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
                                floatingTitleRequired
                            />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="rek_description"
                                type="text"
                                rows={3}
                                multiLine
                                fullWidth
                                {...txt.information.fieldLabels.abstract}
                            />
                        </div>
                    </div>
                </StandardCard>

                <StandardCard title={txt.authors.title} help={txt.authors.help}>
                    <div>{txt.authors.description}</div>
                    <Field
                        component={ContributorsEditorField}
                        name="authors"
                        locale={txt.authors.field}
                        showContributorAssignment
                        className="requiredField"
                        validate={[validation.authorRequired]}
                        disabled={this.props.submitting} />
                </StandardCard>

                <StandardCard title={txt.other.title} help={txt.other.help}>
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
                                {...txt.other.fieldLabels.notes}
                            />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                name="rek_link"
                                type="text"
                                disabled={this.props.submitting}
                                fullWidth
                                {...txt.other.fieldLabels.url}
                                validate={[validation.url]}
                            />
                        </div>
                    </div>
                </StandardCard>
            </div>
        );
    }
}
