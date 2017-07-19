import React, {Component} from 'react';

import {Field} from 'redux-form/immutable';
import MenuItem from 'material-ui/MenuItem';

import {TextField, SelectField, StandardCard} from 'uqlibrary-react-toolbox';
import {ContributorsEditorField} from 'modules/SharedComponents';
import {validation, locale} from 'config';

export default class JournalArticleForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        // path to the locale data for each of the sections
        const txt = locale.components.publicationForm.journalArticle;

        // TODO: get publication sub types for this publication type
        const renderSubTypeItems = [];

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
                                   validate={[validation.required]}
                                   style={{marginBottom: '-12px'}}
                            />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-two-thirds">
                            <Field component={TextField}
                                   name="fez_record_search_key_journal_name.rek_journal_name"
                                   type="text" fullWidth
                                   floatingLabelText={txt.information.fieldLabels.journalTitle}
                                   validate={[validation.required]}
                            />
                        </div>
                        <div className="column">
                            <div className="columns">
                                <div className="column">
                                    <Field component={TextField}
                                           name="partialDateDay"
                                           maxLength="2"
                                           type="text"
                                           style={{marginTop: '12px'}}
                                           fullWidth
                                           floatingLabelText={txt.information.fieldLabels.date.day}
                                           floatingLabelFixed
                                           validate={[validation.dateTimeDay]}
                                    />
                                </div>
                                <div className="form-spacer"/>
                                <div className="column">
                                    <Field component={SelectField}
                                           name="partialDateMonth"
                                           fullWidth
                                           style={{marginTop: '12px'}}
                                           floatingLabelText={txt.information.fieldLabels.date.month}
                                           floatingLabelFixed>
                                        <MenuItem key={-1} value="-1" primaryText=""/>
                                        <MenuItem key={0} value="0" primaryText="January"/>
                                        <MenuItem key={1} value="1" primaryText="February"/>
                                        <MenuItem key={2} value="2" primaryText="March"/>
                                        <MenuItem key={3} value="3" primaryText="April"/>
                                        <MenuItem key={4} value="4" primaryText="May"/>
                                        <MenuItem key={5} value="5" primaryText="June"/>
                                        <MenuItem key={6} value="6" primaryText="July"/>
                                        <MenuItem key={7} value="7" primaryText="August"/>
                                        <MenuItem key={8} value="8" primaryText="September"/>
                                        <MenuItem key={9} value="9" primaryText="October"/>
                                        <MenuItem key={10} value="10" primaryText="November"/>
                                        <MenuItem key={11} value="11" primaryText="December"/>
                                    </Field>
                                </div>
                                <div className="form-spacer"/>
                                <div className="column">
                                    <Field component={TextField}
                                           name="partialDateYear"
                                           type="text"
                                           fullWidth
                                           style={{marginTop: '12px'}}
                                           maxLength="4"
                                           floatingLabelText={txt.information.fieldLabels.date.year}
                                           floatingLabelFixed
                                           validate={[validation.dateTimeYear]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <Field component={SelectField}
                                   name="rek_subtype"
                                   fullWidth
                                   floatingLabelText={txt.information.fieldLabels.subtype}>
                                <MenuItem
                                    primaryText={txt.information.fieldLabels.subtype}
                                    disabled/>
                                {renderSubTypeItems}
                            </Field>
                        </div>
                    </div>
                </StandardCard>

                <StandardCard title={txt.authors.title} help={txt.authors.help}>
                    <Field component={ContributorsEditorField} name="authors"/>
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
