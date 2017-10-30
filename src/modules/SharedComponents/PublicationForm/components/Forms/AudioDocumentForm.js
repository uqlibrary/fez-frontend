import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Field} from 'redux-form/immutable';

import {TextField, StandardCard, PartialDateField} from 'uqlibrary-react-toolbox';
import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {validation, locale} from 'config';

export default class AudioDocumentForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool
    };

    constructor(props) {
        super(props);
    }

    render() {
        // path to the locale data for each of the sections
        const txt = locale.components.publicationForm.audioDocument;

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
                                name="fez_record_search_key_place_of_publication.rek_place_of_publication"
                                type="text"
                                fullWidth
                                className="requiredField"
                                floatingLabelText={txt.information.fieldLabels.publicationPlace.title}
                                hintText={txt.information.fieldLabels.publicationPlace.hint}
                                validate={[validation.required]}
                            />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_publisher.rek_publisher"
                                type="text"
                                fullWidth
                                className="requiredField input-long-hint"
                                floatingLabelText={txt.information.fieldLabels.publisher.title}
                                hintText={txt.information.fieldLabels.publisher.hint}
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
                                component={TextField}
                                disabled={this.props.submitting}
                                name="rek_formatted_abstract"
                                type="text"
                                fullWidth
                                rows={3}
                                multiLine
                                floatingLabelText={txt.information.fieldLabels.abstract.title}
                                hintText={txt.information.fieldLabels.abstract.hint}
                            />
                        </div>
                    </div>
                </StandardCard>

                <StandardCard title={txt.creator.title} help={txt.creator.help}>
                    <div>{txt.creator.description}</div>
                    <Field
                        component={ContributorsEditorField}
                        showContributorAssignment
                        className="requiredField"
                        name="authors"
                        locale={txt.creator.field}
                        disabled={this.props.submitting}
                    />
                </StandardCard>

                <StandardCard title={txt.contributor.title} help={txt.contributor.help}>
                    <div>{txt.contributor.description}</div>
                    <Field
                        component={ContributorsEditorField}
                        showContributorAssignment
                        name="editors"
                        locale={txt.contributor.field}
                        disabled={this.props.submitting}
                    />
                </StandardCard>

                <StandardCard title={txt.optional.title} help={txt.optional.help}>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_notes.rek_notes"
                                type="text"
                                fullWidth
                                rows={1}
                                multiLine
                                floatingLabelText={txt.optional.fieldLabels.notes.title}
                                hintText={txt.optional.fieldLabels.notes.hint}
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
                                floatingLabelText={txt.optional.fieldLabels.url.title}
                                hintText={txt.optional.fieldLabels.url.hint}
                                validate={[validation.url]}
                            />
                        </div>
                    </div>
                </StandardCard>
            </div>
        );
    }
}
