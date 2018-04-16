import React, {Component} from 'react';
import {Field} from 'redux-form/immutable';

import {TextField} from 'uqlibrary-react-toolbox/build/TextField';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {PartialDateField} from 'uqlibrary-react-toolbox/build/PartialDate';
import {ListEditorField} from 'uqlibrary-react-toolbox/build/ListEditor';

import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {PublicationSubtypeField} from 'modules/SharedComponents/PublicationSubtype';
import {validation} from 'config';
import {locale} from 'locale';
import {default as formLocale} from 'locale/publicationForm';

import PropTypes from 'prop-types';

export default class BookChapterForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool,
        subtypeVocabId: PropTypes.number
    }

    constructor(props) {
        super(props);
    }

    render() {
        const txt = formLocale.bookChapter;
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
                                floatingLabelText={txt.information.fieldLabels.bookChapterTitle}
                                validate={[validation.required]}
                                style={{marginBottom: '-12px'}} />
                        </div>
                    </div>
                    <div className="columns" style={{marginTop: '-12px'}}>
                        <div className="column">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_book_title.rek_book_title"
                                className="requiredField"
                                type="text"
                                fullWidth
                                multiLine
                                rows={1}
                                floatingLabelText={txt.information.fieldLabels.bookTitle}
                                validate={[validation.required]}
                                style={{marginBottom: '-12px'}} />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_place_of_publication.rek_place_of_publication"
                                type="text"
                                className="requiredField"
                                fullWidth
                                floatingLabelText={txt.information.fieldLabels.publicationPlace}
                                validate={[validation.required]} />
                        </div>
                        <div className="column">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_publisher.rek_publisher"
                                type="text"
                                fullWidth
                                className="requiredField"
                                validate={[validation.required]}
                                floatingLabelText={txt.information.fieldLabels.publisher} />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half">
                            <Field
                                component={PublicationSubtypeField}
                                name="rek_subtype"
                                disabled={this.props.submitting}
                                vocabId={this.props.subtypeVocabId}
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
                                className="requiredHintField"
                                validate={[validation.required]}
                                floatingTitle={txt.information.fieldLabels.date.title}
                                floatingTitleRequired
                            />
                        </div>
                    </div>
                </StandardCard>

                <StandardCard title={txt.authors.title} help={txt.authors.help}>
                    <Field
                        component={ContributorsEditorField}
                        name="authors"
                        locale={txt.authors.field}
                        showContributorAssignment
                        className="requiredField"
                        validate={[validation.authorRequired]}
                        disabled={this.props.submitting} />
                </StandardCard>

                <StandardCard title={txt.editors.title} help={txt.editors.help}>
                    <Field
                        component={ContributorsEditorField}
                        name="editors"
                        locale={txt.editors.field}
                        disabled={this.props.submitting} />
                </StandardCard>

                <StandardCard title={locale.components.isbnForm.title} help={locale.components.isbnForm.title.help}>
                    <div>{locale.components.isbnForm.text}</div>
                    <Field
                        component={ListEditorField}
                        remindToAdd
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
                        remindToAdd
                        isValid={validation.isValidIssn}
                        name="fez_record_search_key_issn"
                        maxCount={5}
                        locale={locale.components.issnForm.field}
                        searchKey={{value: 'rek_issn', order: 'rek_issn_order'}}
                        disabled={this.props.submitting} />
                </StandardCard>

                <StandardCard title={txt.other.title} help={txt.other.help}>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                name="fez_record_search_key_edition.rek_edition"
                                type="text"
                                fullWidth
                                disabled={this.props.submitting}
                                floatingLabelText={txt.other.fieldLabels.edition}/>
                        </div>

                        <div className="column">
                            <Field
                                component={TextField}
                                name="fez_record_search_key_start_page.rek_start_page"
                                type="text"
                                fullWidth
                                disabled={this.props.submitting}
                                className="requiredField"
                                validate={[validation.required]}
                                floatingLabelText={txt.other.fieldLabels.startPage}/>
                        </div>
                        <div className="column">
                            <Field
                                component={TextField}
                                name="fez_record_search_key_end_page.rek_end_page"
                                type="text"
                                fullWidth
                                disabled={this.props.submitting}
                                className="requiredField"
                                validate={[validation.required]}
                                floatingLabelText={txt.other.fieldLabels.endPage}/>
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
                                validate={[validation.url]}
                            />
                        </div>
                    </div>
                </StandardCard>
            </div>
        );
    }
}
