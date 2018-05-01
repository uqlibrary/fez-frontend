import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form/immutable';

import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {PartialDateField} from 'modules/SharedComponents/Toolbox/PartialDate';

import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {JournalNameField} from 'modules/SharedComponents/LookupFields';

import {validation} from 'config';
import {default as formLocale} from 'locale/publicationForm';

export default class NewspaperArticleForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool
    };

    constructor(props) {
        super(props);
    }

    render() {
        const txt = formLocale.newspaperArticle;
        return (
            <div>
                <StandardCard title={txt.information.title} help={txt.information.help}>
                    <div className="columns">
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
                                {...txt.information.fieldLabels.documentTitle}
                                validate={[validation.required]}
                            />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={JournalNameField}
                                name="fez_record_search_key_newspaper.rek_newspaper"
                                disabled={this.props.submitting}
                                {...txt.information.fieldLabels.newspaperName}
                                className="requiredField"
                                validate={[validation.required]}
                            />
                        </div>
                    </div>

                    <div className="columns">
                        <div className="column is-3-tablet">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_start_page.rek_start_page"
                                type="text"
                                fullWidth
                                {...txt.information.fieldLabels.startPage}
                                className="requiredField"
                                validate={[validation.required]}
                            />
                        </div>
                        <div className="column is-3-tablet">
                            <Field
                                component={TextField}
                                disabled={this.props.submitting}
                                name="fez_record_search_key_end_page.rek_end_page"
                                type="text"
                                fullWidth
                                {...txt.information.fieldLabels.endPage}
                                className="requiredField"
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
                        disabled={this.props.submitting}/>
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
