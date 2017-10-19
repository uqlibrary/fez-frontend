import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Field} from 'redux-form/immutable';

import {TextField, StandardCard, PartialDateField} from 'uqlibrary-react-toolbox';
import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {PublicationSubtypeField} from 'modules/SharedComponents/PublicationSubtype';
import {validation, locale} from 'config';

export default class JournalArticleForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool,
        subtypeVocabId: PropTypes.number
    };

    constructor(props) {
        super(props);
    }

    render() {
        // path to the locale data for each of the sections
        const txt = locale.components.publicationForm.journalArticle;

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
                                floatingLabelText={txt.information.fieldLabels.articleTitle}
                                className="requiredField"
                                validate={[validation.required]}
                            />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_journal_name.rek_journal_name"
                                type="text"
                                className="requiredField"
                                fullWidth
                                floatingLabelText={txt.information.fieldLabels.journalTitle}
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
                                component={PublicationSubtypeField}
                                name="rek_subtype"
                                disabled={this.props.submitting}
                                vocabId={this.props.subtypeVocabId}
                                className="requiredField"
                                locale={{label: txt.information.fieldLabels.subtype, loading: locale.global.loading}}
                                validate={[validation.required]}
                            />
                        </div>
                    </div>
                </StandardCard>

                <StandardCard title={txt.authors.title} help={txt.authors.help}>
                    <Field
                        component={ContributorsEditorField}
                        showContributorAssignment
                        className="requiredField"
                        name="authors"
                        locale={txt.authors.field}
                        disabled={this.props.submitting}
                    />
                </StandardCard>

                <StandardCard title={txt.optional.title} help={txt.optional.help}>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                name="fez_record_search_key_volume_number.rek_volume_number"
                                type="text"
                                fullWidth
                                disabled={this.props.submitting}
                                floatingLabelText={txt.optional.fieldLabels.volume}/>
                        </div>
                        <div className="column">
                            <Field
                                component={TextField}
                                name="fez_record_search_key_issue_number.rek_issue_number"
                                type="text" fullWidth
                                disabled={this.props.submitting}
                                floatingLabelText={txt.optional.fieldLabels.issue}/>
                        </div>

                        <div className="column">
                            <Field
                                component={TextField}
                                name="fez_record_search_key_start_page.rek_start_page"
                                type="text"
                                fullWidth
                                disabled={this.props.submitting}
                                floatingLabelText={txt.optional.fieldLabels.startPage}/>
                        </div>
                        <div className="column">
                            <Field
                                component={TextField}
                                name="fez_record_search_key_end_page.rek_end_page"
                                type="text"
                                fullWidth
                                disabled={this.props.submitting}
                                floatingLabelText={txt.optional.fieldLabels.endPage}/>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                name="fez_record_search_key_article_number.rek_article_number"
                                type="text"
                                fullWidth
                                disabled={this.props.submitting}
                                floatingLabelText={txt.optional.fieldLabels.articleNumber}/>
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
                                floatingLabelText={txt.optional.fieldLabels.notes}/>
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
                                floatingLabelText={txt.optional.fieldLabels.url}
                                validate={[validation.url, validation.maxLength255]}
                            />
                        </div>
                    </div>
                </StandardCard>
            </div>
        );
    }
}
