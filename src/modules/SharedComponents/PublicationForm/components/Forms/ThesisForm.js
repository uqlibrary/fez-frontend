import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';

import { ThesisSubtypeField } from 'modules/SharedComponents/PublicationSubtype';
import { OrgNameField, OrgUnitNameField, FieldOfResearchListField } from 'modules/SharedComponents/LookupFields';
import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';

import { validation } from 'config';
import { locale } from 'locale';
import { default as formLocale } from 'locale/publicationForm';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default class ThesisForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool,
    };
    constructor(props) {
        super(props);
    }

    getNumbersOnly = value => {
        return value.replace(/[^\d]/g, '');
    };

    render() {
        const txt = formLocale.thesis;
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
                                    rows={1}
                                    {...txt.information.fieldLabels.documentTitle}
                                    required
                                    validate={[validation.required]}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={OrgUnitNameField}
                                    name="fez_record_search_key_org_unit_name.rek_org_unit_name"
                                    disabled={this.props.submitting}
                                    validate={[validation.required]}
                                    required
                                    {...txt.information.fieldLabels.orgUnitName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={OrgNameField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_org_name.rek_org_name"
                                    required
                                    validate={[validation.required]}
                                    {...txt.information.fieldLabels.orgName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={ThesisSubtypeField}
                                    name="rek_genre_type"
                                    disabled={this.props.submitting}
                                    validate={[validation.required]}
                                    locale={txt.information.fieldLabels.thesisType}
                                    required
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
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="currentAuthor.0.nameAsPublished"
                                    type="text"
                                    fullWidth
                                    rows={1}
                                    {...txt.information.fieldLabels.author}
                                    required
                                    validate={[validation.required]}
                                />
                            </Grid>
                        </Grid>
                    </StandardCard>
                </Grid>
                <Grid item xs={12}>
                    <StandardCard title={txt.supervisors.title} help={txt.supervisors.help}>
                        <Field
                            component={ContributorsEditorField}
                            contributorEditorId="supervisors"
                            required
                            name="supervisors"
                            validate={[validation.supervisorRequired]}
                            locale={txt.supervisors.field}
                            disabled={this.props.submitting}
                        />
                    </StandardCard>
                </Grid>
                <Grid item xs={12}>
                    <StandardCard title={txt.fieldOfResearch.title} help={txt.fieldOfResearch.help}>
                        <Typography>{txt.fieldOfResearch.description}</Typography>
                        <Field
                            component={FieldOfResearchListField}
                            name="fieldOfResearch"
                            hideReorder
                            distinctOnly
                            maxCount={3}
                            disabled={this.props.submitting}
                            locale={locale.components.fieldOfResearchForm.field}
                        />
                    </StandardCard>
                </Grid>
                <Grid item xs={12}>
                    <StandardCard title={txt.optional.title} help={txt.optional.help}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_doi.rek_doi"
                                    type="text"
                                    validate={[validation.doi]}
                                    fullWidth
                                    {...txt.optional.fieldLabels.doi}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_total_pages.rek_total_pages"
                                    type="text"
                                    fullWidth
                                    normalize={this.getNumbersOnly}
                                    {...txt.optional.fieldLabels.totalPages}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    name="fez_record_search_key_description.rek_description"
                                    type="text"
                                    disabled={this.props.submitting}
                                    fullWidth
                                    multiline
                                    {...txt.optional.fieldLabels.abstract}
                                />
                            </Grid>
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
                        </Grid>
                    </StandardCard>
                </Grid>
            </Grid>
        );
    }
}
