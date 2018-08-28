import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Field} from 'redux-form/immutable';

import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {PartialDateField} from 'modules/SharedComponents/Toolbox/PartialDate';

import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {PublicationSubtypeField} from 'modules/SharedComponents/PublicationSubtype';

import {validation} from 'config';
import {locale} from 'locale';
import {default as formLocale} from 'locale/publicationForm';

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
        const txt = formLocale.journalArticle;

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
                                rows={1}
                                multiline
                                fullWidth
                                {...txt.information.fieldLabels.documentTitle}
                                required
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
                                required
                                fullWidth
                                {...txt.information.fieldLabels.journalTitle}
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
                    <div>{txt.authors.description}</div>
                    <Field
                        component={ContributorsEditorField}
                        showContributorAssignment
                        className="requiredField"
                        name="authors"
                        locale={txt.authors.field}
                        disabled={this.props.submitting}
                        validate={[validation.authorRequired]} />
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
                                label={txt.optional.fieldLabels.volume}/>
                        </div>
                        <div className="column">
                            <Field
                                component={TextField}
                                name="fez_record_search_key_issue_number.rek_issue_number"
                                type="text" fullWidth
                                disabled={this.props.submitting}
                                label={txt.optional.fieldLabels.issue}/>
                        </div>

                        <div className="column">
                            <Field
                                component={TextField}
                                name="fez_record_search_key_start_page.rek_start_page"
                                type="text"
                                fullWidth
                                disabled={this.props.submitting}
                                label={txt.optional.fieldLabels.startPage}/>
                        </div>
                        <div className="column">
                            <Field
                                component={TextField}
                                name="fez_record_search_key_end_page.rek_end_page"
                                type="text"
                                fullWidth
                                disabled={this.props.submitting}
                                label={txt.optional.fieldLabels.endPage}/>
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
                                label={txt.optional.fieldLabels.articleNumber}/>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                name="comments"
                                type="text"
                                disabled={this.props.submitting}
                                fullWidth
                                multiline
                                rows={1}
                                label={txt.optional.fieldLabels.notes}/>
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
                                label={txt.optional.fieldLabels.url}
                                validate={[validation.url]}
                            />
                        </div>
                    </div>
                </StandardCard>
            </div>
        );
    }
}
