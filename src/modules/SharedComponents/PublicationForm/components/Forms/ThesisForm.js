import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

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

import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';
import { numbersOnly } from 'helpers/general';
import { CONTRIBUTOR_NAMES_FORM_GIVEN_NAME_FIRST } from '../../../../../config/general';

export const ThesisForm = ({ isSubmitting, control }) => {
    const txt = formLocale.thesis;
    const authorTxt = formLocale.journalArticle;
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
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
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
                                control={control}
                                component={OrgUnitNameField}
                                name="fez_record_search_key_org_unit_name.rek_org_unit_name"
                                disabled={isSubmitting}
                                validate={[validation.required, validation.maxLength255Validator]}
                                required
                                {...txt.information.fieldLabels.orgUnitName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={OrgNameField}
                                disabled={isSubmitting}
                                name="fez_record_search_key_org_name.rek_org_name"
                                required
                                validate={[validation.required, validation.maxLength255Validator]}
                                {...txt.information.fieldLabels.orgName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={ThesisSubtypeSelectField}
                                name="rek_genre_type"
                                disabled={isSubmitting}
                                validate={[validation.required]}
                                {...txt.information.fieldLabels.thesisType}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={PartialDateField}
                                partialDateFieldId="rek-date"
                                disabled={isSubmitting}
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
            {/* New Authors field */}
            <Grid item xs={12}>
                <StandardCard title={authorTxt.authors.title} help={authorTxt.authors.help}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography>{authorTxt.authors.description}</Typography>
                            <Field
                                control={control}
                                component={ContributorsEditorField}
                                canEdit
                                forceSelectable
                                maintainSelected
                                hideUqIDFields
                                contributorEditorId="authors"
                                showContributorAssignment
                                name="authors"
                                locale={authorTxt.authors.field}
                                disabled={isSubmitting}
                                validate={[validation.authorRequired]}
                                required
                                namesFormFieldOrdering={CONTRIBUTOR_NAMES_FORM_GIVEN_NAME_FIRST}
                            />
                        </Grid>
                    </Grid>
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.supervisors.title} help={txt.supervisors.help}>
                    <Field
                        control={control}
                        component={ContributorsEditorField}
                        canEdit
                        hideUqIDFields
                        maintainSelected
                        contributorEditorId="supervisors"
                        required
                        name="supervisors"
                        validate={[validation.supervisorRequired]}
                        locale={txt.supervisors.field}
                        disabled={isSubmitting}
                    />
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.fieldOfResearch.title} help={txt.fieldOfResearch.help}>
                    <Typography>{txt.fieldOfResearch.description}</Typography>
                    <Field
                        control={control}
                        component={FieldOfResearchListField}
                        name="fieldOfResearch"
                        hideReorder
                        distinctOnly
                        maxCount={3}
                        disabled={isSubmitting}
                        locale={locale.components.fieldOfResearchForm.field}
                    />
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.optional.title} help={txt.optional.help}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
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
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
                                name="fez_record_search_key_total_pages.rek_total_pages"
                                textFieldId="rek-total-pages"
                                type="text"
                                fullWidth
                                normalize={numbersOnly}
                                {...txt.optional.fieldLabels.totalPages}
                                validate={[validation.maxLength255Validator]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                control={control}
                                component={TextField}
                                name="fez_record_search_key_description.rek_description"
                                textFieldId="rek-description"
                                type="text"
                                disabled={isSubmitting}
                                fullWidth
                                multiline
                                {...txt.optional.fieldLabels.abstract}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                control={control}
                                component={TextField}
                                name="comments"
                                textFieldId="comments"
                                type="text"
                                disabled={isSubmitting}
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
    control: PropTypes.any,
    isSubmitting: PropTypes.bool,
};
export default ThesisForm;
