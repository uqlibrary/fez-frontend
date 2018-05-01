import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Field} from 'redux-form/immutable';

import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {PartialDateField} from 'modules/SharedComponents/Toolbox/PartialDate';

import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {validation} from 'config';
import {default as formLocale} from 'locale/publicationForm';

export default class GenericDocumentForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool,
        subtypeVocabId: PropTypes.number
    };

    constructor(props) {
        super(props);
    }

    render() {
        // path to the locale data for each of the sections
        const txt = formLocale.generic;
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
                                multiLine
                                rows={1}
                                {...txt.information.fieldLabels.documentTitle}
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
                                {...txt.information.fieldLabels.publicationPlace}
                            />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_publisher.rek_publisher"
                                type="text"
                                fullWidth
                                {...txt.information.fieldLabels.publisher}
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
                                name="rek_description"
                                type="text"
                                fullWidth
                                rows={3}
                                multiLine
                                {...txt.information.fieldLabels.abstract}
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
                        validate={[validation.authorRequired]}
                        disabled={this.props.submitting} />
                </StandardCard>

                <StandardCard title={txt.optional.title} help={txt.optional.help}>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="comments"
                                type="text"
                                fullWidth
                                rows={1}
                                multiLine
                                {...txt.optional.fieldLabels.notes}
                            />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="rek_link"
                                type="text"
                                fullWidth
                                {...txt.optional.fieldLabels.url}
                                validate={[validation.url]}
                            />
                        </div>
                    </div>
                </StandardCard>
            </div>
        );
    }
}
