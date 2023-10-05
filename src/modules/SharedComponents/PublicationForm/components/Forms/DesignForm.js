import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';
import moment from 'moment';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';

import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { NtroFields } from 'modules/SharedComponents/Toolbox/NtroFields';

import { validation } from 'config';
import { default as formLocale } from 'locale/publicationForm';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default class DesignForm extends Component {
    static propTypes = {
        formValues: PropTypes.any,
        submitting: PropTypes.bool,
        subtype: PropTypes.string,
        isNtro: PropTypes.bool,
        isAuthorSelected: PropTypes.bool,
    };

    constructor(props) {
        super(props);
    }

    render() {
        // path to the locale data for each of the sections
        const txt = formLocale.design;

        const formValues = this.props.formValues && this.props.formValues.toJS();
        const startDate = formValues && formValues.rek_date;
        const endDate =
            formValues &&
            formValues.fez_record_search_key_end_date &&
            formValues.fez_record_search_key_end_date.rek_end_date;
        const dateError =
            !!startDate && !!endDate && moment(startDate).format() > moment(endDate).format()
                ? 'Date range is not valid'
                : '';

        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <StandardCard title={txt.information.title} help={txt.information.help}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    autoFocus={!this.props.isNtro}
                                    name="rek_title"
                                    type="text"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    {...txt.information.fieldLabels.articleTitle}
                                    required
                                    validate={[validation.required]}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_project_name.rek_project_name"
                                    type="text"
                                    fullWidth
                                    {...txt.information.fieldLabels.projectName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_location[0].rek_location"
                                    type="text"
                                    fullWidth
                                    {...txt.information.fieldLabels.location}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_publisher.rek_publisher"
                                    type="text"
                                    fullWidth
                                    required
                                    validate={[validation.required]}
                                    {...txt.information.fieldLabels.publisher}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_place_of_publication.rek_place_of_publication"
                                    type="text"
                                    fullWidth
                                    required
                                    validate={[validation.required]}
                                    {...txt.information.fieldLabels.placeOfPublication}
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
                                    partialDateFieldId="rek-project-start-date"
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_project_start_date.rek_project_start_date"
                                    allowPartial
                                    required
                                    className="requiredHintField"
                                    validate={[validation.required]}
                                    floatingTitle={txt.information.fieldLabels.projectStartDate.title}
                                    floatingTitleRequired
                                    hasError={dateError}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={PartialDateField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_end_date.rek_end_date"
                                    allowPartial
                                    floatingTitle={txt.information.fieldLabels.endDate.title}
                                    hasError={dateError}
                                    partialDateFieldId="rek-end-date"
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
                            locale={txt.authors.field}
                            disabled={this.props.submitting}
                            validate={[validation.authorRequired]}
                            isNtro={this.props.isNtro}
                        />
                    </StandardCard>
                </Grid>
                {this.props.isNtro && (
                    <NtroFields
                        canEdit
                        submitting={this.props.submitting}
                        showContributionStatement={this.props.isAuthorSelected}
                        hideIsmn
                        hideIsrc
                        hideVolume
                        hideIssue
                        hideStartPage
                        hideEndPage
                        hideAudienceSize
                    />
                )}
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
                                    rows={1}
                                    {...txt.optional.fieldLabels.notes}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    name="rek_link"
                                    type="text"
                                    disabled={this.props.submitting}
                                    fullWidth
                                    {...txt.optional.fieldLabels.url}
                                    validate={[validation.url]}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    name="rek_link_description"
                                    type="text"
                                    disabled={this.props.submitting}
                                    fullWidth
                                    label={'Link description'}
                                />
                            </Grid>
                        </Grid>
                    </StandardCard>
                </Grid>
            </Grid>
        );
    }
}
