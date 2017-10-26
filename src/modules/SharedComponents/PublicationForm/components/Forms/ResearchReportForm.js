import React, {Component} from 'react';
import {Field} from 'redux-form/immutable';

import {TextField, StandardCard, ListEditorField, PartialDateField} from 'uqlibrary-react-toolbox';
import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {SeriesField} from 'modules/SharedComponents/AutoSuggestField';
import {validation, locale} from 'config';
import PropTypes from 'prop-types';

export default class ResearchReportForm extends Component {
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
        const txt = locale.components.publicationForm.researchReport;
        return (
            <div>
                <StandardCard title={txt.information.title} help={txt.information.help}>
                    <div className="columns" style={{marginTop: '-12px'}}>
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
                                floatingLabelText={txt.information.fieldLabels.documentTitle.title}
                                hintText={txt.information.fieldLabels.documentTitle.hint}
                                validate={[validation.required]}
                                style={{marginBottom: '-12px'}}
                            />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_place_of_publication.rek_place_of_publication"
                                type="text"
                                fullWidth
                                floatingLabelText={txt.information.fieldLabels.publicationPlace.title}
                                hintText={txt.information.fieldLabels.publicationPlace.hint}
                            />
                        </div>
                        <div className="column">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_publisher.rek_publisher"
                                type="text"
                                fullWidth
                                floatingLabelText={txt.information.fieldLabels.publisher.title}
                                hintText={txt.information.fieldLabels.publisher.hint}
                            />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half">
                            <Field
                                component={TextField}
                                name="fez_record_search_key_total_pages.rek_total_pages"
                                type="text"
                                disabled={this.props.submitting}
                                fullWidth
                                className="requiredField"
                                floatingLabelText={txt.information.fieldLabels.totalPages.title}
                                hintText={txt.information.fieldLabels.totalPages.hint}
                                normalize={this.getNumbersOnly}
                                validate={[validation.required]}
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
                                component={SeriesField}
                                name="fez_record_search_key_series.rek_series"
                                disabled={this.props.submitting}
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

                <StandardCard title={locale.components.isbnForm.title} help={locale.components.isbnForm.title.help}>
                    <div>{locale.components.isbnForm.text}</div>
                    <Field
                        component={ListEditorField}
                        name="fez_record_search_key_isbn"
                        isValid={validation.isValidIsbn}
                        maxCount={5}
                        searchKey={{value: 'rek_isbn', order: 'rek_isbn_order'}}
                        locale={locale.components.isbnForm.field}
                        disabled={this.props.submitting}
                    />
                </StandardCard>

                <StandardCard title={locale.components.issnForm.title} help={locale.components.issnForm.title.help}>
                    <div>{locale.components.issnForm.text}</div>
                    <Field
                        component={ListEditorField}
                        isValid={validation.isValidIssn}
                        name="fez_record_search_key_issn"
                        maxCount={5}
                        locale={locale.components.issnForm.field}
                        searchKey={{value: 'rek_issn', order: 'rek_issn_order'}}
                        disabled={this.props.submitting}
                    />
                </StandardCard>

                <StandardCard title={txt.other.title} help={txt.other.help}>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                name="rek_description"
                                type="text"
                                disabled={this.props.submitting}
                                fullWidth
                                multiLine
                                rows={1}
                                floatingLabelText={txt.other.fieldLabels.abstract.title}
                                hintText={txt.other.fieldLabels.abstract.hint}
                            />
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
                                floatingLabelText={txt.other.fieldLabels.notes.title}
                                hintText={txt.other.fieldLabels.notes.hint}
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
                                floatingLabelText={txt.other.fieldLabels.url.title}
                                hintText={txt.other.fieldLabels.url.hint}
                                validate={[validation.url, validation.maxLength255]}
                            />
                        </div>
                    </div>
                </StandardCard>
            </div>
        );
    }
}
