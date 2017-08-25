import React, {Component} from 'react';
import {Field} from 'redux-form/immutable';

import {TextField, StandardCard, ListEditorField} from 'uqlibrary-react-toolbox';
import {ContributorsEditorField, PublicationSubtypeField} from 'modules/SharedComponents';
import {validation, locale} from 'config';
import PropTypes from 'prop-types';

export default class BookForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool,
        vocabId: PropTypes.number
    }

    constructor(props) {
        super(props);
    }

    render() {
        const txt = locale.components.publicationForm.book;
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
                        <div className="column">
                            <Field
                                component={PublicationSubtypeField}
                                name="rek_subtype"
                                disabled={this.props.submitting}
                                vocabId={this.props.vocabId}
                                className="requiredField"
                                locale={{label: txt.information.fieldLabels.subtype, loading: locale.global.loading}}
                                validate={[validation.required]} />
                        </div>
                    </div>
                </StandardCard>

                <StandardCard title={txt.authors.title} help={txt.authors.help}>
                    <Field
                        component={ContributorsEditorField}
                        name="authors"
                        showIdentifierLookup
                        locale={txt.authors.field}
                        showContributorAssignment
                        className="requiredField"
                        validate={[validation.isValidContributor]}
                        disabled={this.props.submitting} />
                </StandardCard>

                <StandardCard title={txt.editors.title} help={txt.editors.help}>
                    <Field
                        component={ContributorsEditorField}
                        showContributorAssignment
                        name="editors"
                        locale={txt.editors.field}
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
            </div>
        );
    }
}
