import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';

import { OrgNameField, OrgUnitNameField, SeriesField } from 'modules/SharedComponents/LookupFields';
import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';

import { validation } from 'config';
import { default as formLocale } from 'locale/publicationForm';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default class SeminarPaperForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool,
    };

    constructor(props) {
        super(props);
    }

    render() {
        // path to the locale data for each of the sections
        const txt = formLocale.seminarPaper;

        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <StandardCard title={txt.information.title} help={txt.information.help}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    autoFocus
                                    name="rek_title"
                                    type="text"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    {...txt.information.fieldLabels.documentTitle}
                                    required
                                    validate={[validation.required]}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={OrgUnitNameField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_org_unit_name.rek_org_unit_name"
                                    {...txt.information.fieldLabels.orgUnitName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={OrgNameField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_org_name.rek_org_name"
                                    {...txt.information.fieldLabels.orgName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={SeriesField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_series.rek_series"
                                    {...txt.information.fieldLabels.series}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_doi.rek_doi"
                                    textFieldId="rek-doi"
                                    type="text"
                                    fullWidth
                                    validate={[validation.doi]}
                                    {...txt.information.fieldLabels.doi}
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
                                    floatingTitle={txt.information.fieldLabels.seminarDate.title}
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
                            hideUqIDFields
                            contributorEditorId="authors"
                            showContributorAssignment
                            required
                            name="authors"
                            validate={[validation.authorRequired]}
                            locale={txt.authors.field}
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
                                    name="comments"
                                    type="text"
                                    disabled={this.props.submitting}
                                    fullWidth
                                    multiline
                                    {...txt.optional.fieldLabels.notes}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    name="fez_record_search_key_link[0].rek_link"
                                    type="text"
                                    disabled={this.props.submitting}
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
