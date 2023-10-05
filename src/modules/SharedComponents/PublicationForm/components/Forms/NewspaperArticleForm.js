import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';

import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { NewspaperNameField } from 'modules/SharedComponents/LookupFields';

import { validation } from 'config';
import { default as formLocale } from 'locale/publicationForm';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default class NewspaperArticleForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const txt = formLocale.newspaperArticle;
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <StandardCard title={txt.information.title} help={txt.information.help}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    autoFocus
                                    disabled={this.props.submitting}
                                    name="rek_title"
                                    required
                                    type="text"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    {...txt.information.fieldLabels.documentTitle}
                                    validate={[validation.required]}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={NewspaperNameField}
                                    name="fez_record_search_key_newspaper.rek_newspaper"
                                    disabled={this.props.submitting}
                                    {...txt.information.fieldLabels.newspaperName}
                                    required
                                    validate={[validation.required]}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_start_page.rek_start_page"
                                    type="text"
                                    fullWidth
                                    {...txt.information.fieldLabels.startPage}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_end_page.rek_end_page"
                                    type="text"
                                    fullWidth
                                    {...txt.information.fieldLabels.endPage}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={PartialDateField}
                                    partialDateFieldId="rek-date"
                                    disabled={this.props.submitting}
                                    name="rek_date"
                                    allowPartial
                                    required
                                    className="requiredHintField"
                                    validate={[validation.required]}
                                    floatingTitle={txt.information.fieldLabels.date.title}
                                    floatingTitleRequired
                                />
                            </Grid>
                        </Grid>
                    </StandardCard>
                </Grid>
                <Grid item xs={12}>
                    <StandardCard title={txt.authors.title} help={txt.authors.help}>
                        <Typography>{txt.authors.description}</Typography>
                        <Field
                            component={ContributorsEditorField}
                            canEdit
                            forceSelectable
                            contributorEditorId="authors"
                            name="authors"
                            locale={txt.authors.field}
                            showContributorAssignment
                            required
                            validate={[validation.authorRequired]}
                            disabled={this.props.submitting}
                        />
                    </StandardCard>
                </Grid>
                <Grid item xs={12}>
                    <StandardCard title={txt.optional.title} help={txt.optional.help}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="comments"
                                    type="text"
                                    fullWidth
                                    rows={1}
                                    multiline
                                    {...txt.optional.fieldLabels.notes}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="rek_link"
                                    type="text"
                                    fullWidth
                                    {...txt.optional.fieldLabels.url}
                                    validate={[validation.url]}
                                />
                            </Grid>
                        </Grid>
                    </StandardCard>
                </Grid>
            </Grid>
        );
    }
}
