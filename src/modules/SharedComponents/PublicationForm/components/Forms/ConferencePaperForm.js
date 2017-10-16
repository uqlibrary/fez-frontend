import React, {Component} from 'react';
import {Field} from 'redux-form/immutable';

import {TextField, StandardCard, ListEditorField, PartialDateField} from 'uqlibrary-react-toolbox';
import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {PublicationSubtypeField} from 'modules/SharedComponents/PublicationSubtype';
import {validation, locale} from 'config';
import PropTypes from 'prop-types';

export default class ConferencePaperForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool,
        vocabId: PropTypes.number
    }

    constructor(props) {
        super(props);
    }

    render() {
        const txt = locale.components.publicationForm.conferencePaper;
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
                                floatingLabelText={txt.information.fieldLabels.title}
                                validate={[validation.required]}
                                style={{marginBottom: '-12px'}} />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_conference_name.rek_conference_name"
                                type="text"
                                className="requiredField"
                                fullWidth
                                floatingLabelText={txt.information.fieldLabels.conferenceName}
                                validate={[validation.required]} />
                        </div>
                        <div className="column">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_conference_location.rek_conference_location"
                                type="text"
                                fullWidth
                                className="requiredField"
                                validate={[validation.required]}
                                floatingLabelText={txt.information.fieldLabels.conferenceLocation} />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_conference_dates.rek_conference_dates"
                                type="text"
                                fullWidth
                                className="requiredField"
                                validate={[validation.required]}
                                floatingLabelText={txt.information.fieldLabels.conferenceDates} />
                        </div>
                        <div className="column">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_proceedings_title.rek_proceedings_title"
                                type="text"
                                fullWidth
                                floatingLabelText={txt.information.fieldLabels.proceedingsTitle} />
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
                                floatingLabelText={txt.information.fieldLabels.publicationPlace} />
                        </div>
                        <div className="column">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_publisher.rek_publisher"
                                type="text"
                                fullWidth
                                floatingLabelText={txt.information.fieldLabels.publisher} />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half">
                            <Field
                                component={PublicationSubtypeField}
                                name="rek_subtype"
                                disabled={this.props.submitting}
                                vocabId={this.props.vocabId}
                                className="requiredField"
                                locale={{label: txt.information.fieldLabels.subtype, loading: locale.global.loading}}
                                validate={[validation.required]} />
                        </div>
                        <div className="column">
                            <Field
                                component={PartialDateField}
                                disabled={this.props.submitting}
                                name="rek_date"
                                allowPartial
                                className="requiredField"
                                validate={[validation.required]}
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
                        disabled={this.props.submitting} />
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
                        disabled={this.props.submitting} />
                </StandardCard>

                <StandardCard title={txt.other.title} help={txt.other.help}>
                    <div className="columns">
                        <div className="column is-half">
                            <Field
                                component={TextField}
                                name="fez_record_search_key_start_page.rek_start_page"
                                type="text"
                                fullWidth
                                disabled={this.props.submitting}
                                floatingLabelText={txt.other.fieldLabels.startPage}/>
                        </div>
                        <div className="column">
                            <Field
                                component={TextField}
                                name="fez_record_search_key_end_page.rek_end_page"
                                type="text"
                                fullWidth
                                disabled={this.props.submitting}
                                floatingLabelText={txt.other.fieldLabels.endPage}/>
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
                                floatingLabelText={txt.other.fieldLabels.notes}/>
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
                                floatingLabelText={txt.other.fieldLabels.url}
                                validate={[validation.url, validation.maxLength255]}
                            />
                        </div>
                    </div>
                </StandardCard>
            </div>
        );
    }
}
