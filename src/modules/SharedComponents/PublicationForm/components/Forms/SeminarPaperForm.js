import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Field} from 'redux-form/immutable';

import {TextField, StandardCard, PartialDateField} from 'uqlibrary-react-toolbox';
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
        const txt = locale.components.publicationForm.seminarPaper;

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
                                floatingLabelText={txt.information.fieldLabels.documentTitle.title}
                                hintText={txt.information.fieldLabels.documentTitle.hint}
                                className="requiredField"
                                validate={[validation.required]}
                            />
                        </div>
                    </div>

                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_org_unit_name.rek_org_unit_name"
                                type="text"
                                fullWidth
                                floatingLabelText={txt.information.fieldLabels.orgUnit.title}
                                hintText={txt.information.fieldLabels.orgUnit.hint}
                            />
                        </div>
                        <div className="column">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_org_name.rek_org_name"
                                type="text"
                                fullWidth
                                floatingLabelText={txt.information.fieldLabels.institution.title}
                                hintText={txt.information.fieldLabels.institution.hint}
                            />
                        </div>
                    </div>

                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_series.rek_series"
                                type="text"
                                fullWidth
                                floatingLabelText={txt.information.fieldLabels.series.title}
                                hintText={txt.information.fieldLabels.series.hint}
                                className="input-long-hint"
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
                                floatingLabelText={txt.optional.fieldLabels.notes.title}
                                hintText={txt.optional.fieldLabels.notes.hint}
                            />
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
                                floatingLabelText={txt.optional.fieldLabels.url.title}
                                hintText={txt.optional.fieldLabels.url.hint}
                                validate={[validation.url, validation.maxLength255]}
                            />
                            <Field
                                component={TextField}
                                name="fez_record_search_key_link_description[0].rek_link_description"
                                type="text"
                                disabled={this.props.submitting}
                                fullWidth
                                floatingLabelText="testing"
                            />
                        </div>
                    </div>
                </StandardCard>
            </div>
        );
    }
}
