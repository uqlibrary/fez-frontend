import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import { ThesisSubtypeSelectField } from 'modules/SharedComponents/SelectFields';
import { OrgNameField, OrgUnitNameField, FieldOfResearchListField } from 'modules/SharedComponents/LookupFields';
import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';

import { validation } from 'config';
import { locale } from 'locale';
import { default as formLocale } from 'locale/publicationForm';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export const ThesisForm = ({ submitting }) => {
    const getNumbersOnly = value => {
        return value.replace(/[^\d]/g, '');
    };

    const txt = formLocale.thesis;
    const authortxt = formLocale.journalArticle;
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <StandardCard title={txt.information.title} help={txt.information.help}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Alert
                                message={txt.information.message}
                                type="warning"
                                alertId="alert-warning-rdm-redirect"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                disabled={submitting}
                                autoFocus
                                name="rek_title"
                                textFieldId="rek-title"
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                {...txt.information.fieldLabels.documentTitle}
                                required
                                validate={[validation.required, validation.maxLength1000Validator]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={OrgUnitNameField}
                                name="fez_record_search_key_org_unit_name.rek_org_unit_name"
                                disabled={submitting}
                                validate={[validation.required, validation.maxLength255Validator]}
                                required
                                {...txt.information.fieldLabels.orgUnitName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={OrgNameField}
                                disabled={submitting}
                                name="fez_record_search_key_org_name.rek_org_name"
                                required
                                validate={[validation.required, validation.maxLength255Validator]}
                                {...txt.information.fieldLabels.orgName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={ThesisSubtypeSelectField}
                                name="rek_genre_type"
                                disabled={submitting}
                                validate={[validation.required]}
                                {...txt.information.fieldLabels.thesisType}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={PartialDateField}
                                partialDateFieldId="rek-date"
                                disabled={submitting}
                                name="rek_date"
                                allowPartial
                                required
                                className="requiredHintField"
                                validate={[validation.required]}
                                floatingTitle={txt.information.fieldLabels.date.title}
                                floatingTitleRequired
                            />
                        </Grid>
                        {/* <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    disabled={submitting}
                                    name="currentAuthor.0.nameAsPublished"
                                    textFieldId="rek-author-0"
                                    type="text"
                                    fullWidth
                                    rows={1}
                                    {...txt.information.fieldLabels.author}
                                    required
                                    validate={[validation.required]}
                                />
                            </Grid> */}
                    </Grid>
                </StandardCard>
            </Grid>
            {/* New Authors field */}
            <Grid item xs={12}>
                <StandardCard title={authortxt.authors.title} help={authortxt.authors.help}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography>{authortxt.authors.description}</Typography>
                            <Field
                                component={ContributorsEditorField}
                                canEdit
                                forceSelectable
                                maintainSelected
                                hideUqIDFields
                                contributorEditorId="authors"
                                showContributorAssignment
                                name="authors"
                                locale={authortxt.authors.field}
                                disabled={submitting}
                                validate={[validation.authorRequired]}
                                required
                            />
                        </Grid>
                    </Grid>
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.supervisors.title} help={txt.supervisors.help}>
                    <Field
                        component={ContributorsEditorField}
                        canEdit
                        // forceSelectable
                        hideUqIDFields
                        maintainSelected
                        contributorEditorId="supervisors"
                        required
                        name="supervisors"
                        validate={[validation.supervisorRequired]}
                        locale={txt.supervisors.field}
                        disabled={submitting}
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
                        disabled={submitting}
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
                                disabled={submitting}
                                name="fez_record_search_key_doi.rek_doi"
                                textFieldId="rek-doi"
                                type="text"
                                validate={[validation.doi]}
                                fullWidth
                                {...txt.optional.fieldLabels.doi}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                disabled={submitting}
                                name="fez_record_search_key_total_pages.rek_total_pages"
                                textFieldId="rek-total-pages"
                                type="text"
                                fullWidth
                                normalize={getNumbersOnly}
                                {...txt.optional.fieldLabels.totalPages}
                                validate={[validation.maxLength255Validator]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="fez_record_search_key_description.rek_description"
                                textFieldId="rek-description"
                                type="text"
                                disabled={submitting}
                                fullWidth
                                multiline
                                {...txt.optional.fieldLabels.abstract}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="comments"
                                textFieldId="comments"
                                type="text"
                                disabled={submitting}
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
};
ThesisForm.propTypes = {
    submitting: PropTypes.bool,
};
export default ThesisForm;
