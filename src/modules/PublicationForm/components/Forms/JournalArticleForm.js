import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Field} from 'redux-form/immutable';

import { TextField, StandardCard, PartialDateField } from 'uqlibrary-react-toolbox';
import {ContributorsEditorField, PublicationSubtypeField} from 'modules/SharedComponents';
import {validation, locale} from 'config';

export default class JournalArticleForm extends Component {
    static propTypes = {
        vocabId: PropTypes.number
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
                    <div className="columns" style={{marginTop: '-12px'}}>
                        <div className="column">
                            <Field component={TextField}
                                   autoFocus
                                   name="rek_title"
                                   type="text"
                                   fullWidth
                                   multiLine
                                   rows={1}
                                   floatingLabelText={txt.information.fieldLabels.articleTitle}
                                   className="requiredField"
                                   validate={[validation.required]}
                                   style={{marginBottom: '-12px'}}
                            />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-two-thirds">
                            <Field component={TextField}
                                   name="fez_record_search_key_journal_name.rek_journal_name"
                                   type="text"
                                   className="requiredField"
                                   fullWidth
                                   floatingLabelText={txt.information.fieldLabels.journalTitle}
                                   validate={[validation.required]}
                            />
                        </div>
                        <div className="column">
                            <Field name="rek_date" component={ PartialDateField } allowPartial />
                        </div>
                    </div>
                    <div className="columns">
                        <Field component={ PublicationSubtypeField } vocabId={ this.props.vocabId } />
                    </div>
                </StandardCard>

                <StandardCard title={txt.authors.title} help={txt.authors.help}>
                    <Field component={ContributorsEditorField} name="authors" locale={{contributorSuffix: txt.authors.suffix}} />
                </StandardCard>

                <StandardCard title={txt.optional.title} help={txt.optional.help}>
                    <div className="columns">
                        <div className="column">
                            <Field component={TextField}
                                   name="fez_record_search_key_volume_number.rek_volume_number" type="text"
                                   fullWidth
                                   floatingLabelText={txt.optional.fieldLabels.volume}/>
                        </div>
                        <div className="column">
                            <Field component={TextField} name="fez_record_search_key_issue_number.rek_issue_number"
                                   type="text" fullWidth
                                   floatingLabelText={txt.optional.fieldLabels.issue}/>
                        </div>

                        <div className="column">
                            <Field component={TextField} name="fez_record_search_key_start_page.rek_start_page"
                                   type="text" fullWidth
                                   floatingLabelText={txt.optional.fieldLabels.startPage}/>
                        </div>
                        <div className="column">
                            <Field component={TextField} name="fez_record_search_key_end_page.rek_end_page"
                                   type="text" fullWidth
                                   floatingLabelText={txt.optional.fieldLabels.endPage}/>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <Field component={TextField}
                                   name="fez_record_search_key_article_number.rek_article_number"
                                   type="text" fullWidth multiLine
                                   floatingLabelText={txt.optional.fieldLabels.articleNumber}/>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <Field component={TextField} name="fez_record_search_key_notes.rek_notes" type="text"
                                   fullWidth multiLine
                                   rows={1} floatingLabelText={txt.optional.fieldLabels.notes}/>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <Field component={TextField}
                                   name="publicationUrl"
                                   type="text"
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
