import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';

import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { SeriesField, ReportNumberField, OrgUnitNameField, OrgNameField } from 'modules/SharedComponents/LookupFields';

import { validation } from 'config';
import { default as formLocale } from 'locale/publicationForm';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export const DepartmentTechnicalReportForm = ({ control, isSubmitting }) => {
    const txt = formLocale.departmentTechnicalReport;
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <StandardCard title={txt.information.title} help={txt.information.help}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Field
                                control={control}
                                component={TextField}
                                autoFocus
                                disabled={isSubmitting}
                                name="rek_title"
                                textFieldId="rek-title"
                                required
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                {...txt.information.fieldLabels.documentTitle}
                                validate={[validation.required, validation.maxLength1000Validator]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={OrgUnitNameField}
                                name="fez_record_search_key_org_unit_name.rek_org_unit_name"
                                disabled={isSubmitting}
                                {...txt.information.fieldLabels.orgUnitName}
                                validate={[validation.maxLength255Validator]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={OrgNameField}
                                name="fez_record_search_key_org_name.rek_org_name"
                                disabled={isSubmitting}
                                {...txt.information.fieldLabels.orgName}
                                validate={[validation.maxLength255Validator]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                control={control}
                                component={SeriesField}
                                name="fez_record_search_key_series.rek_series"
                                disabled={isSubmitting}
                                {...txt.information.fieldLabels.series}
                                validate={[validation.maxLength255Validator]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={ReportNumberField}
                                name="fez_record_search_key_report_number.rek_report_number"
                                disabled={isSubmitting}
                                {...txt.information.fieldLabels.reportNumber}
                                validate={[validation.maxLength255Validator]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
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
                        <Grid item xs={12}>
                            <Field
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
                                name="rek_description"
                                textFieldId="rek-description"
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                {...txt.information.fieldLabels.abstract}
                            />
                        </Grid>
                    </Grid>
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.authors.title} help={txt.authors.help}>
                    <Typography>{txt.authors.description}</Typography>
                    <Field
                        control={control}
                        component={ContributorsEditorField}
                        canEdit
                        forceSelectable
                        hideUqIDFields
                        maintainSelected
                        contributorEditorId="authors"
                        name="authors"
                        locale={txt.authors.field}
                        showContributorAssignment
                        required
                        validate={[validation.authorRequired]}
                        disabled={isSubmitting}
                    />
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.other.title} help={txt.other.help}>
                    <Grid container spacing={2}>
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
                                {...txt.other.fieldLabels.notes}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                control={control}
                                component={TextField}
                                name="rek_link"
                                textFieldId="rek-link"
                                type="text"
                                disabled={isSubmitting}
                                fullWidth
                                {...txt.other.fieldLabels.url}
                                validate={[validation.url]}
                            />
                        </Grid>
                    </Grid>
                </StandardCard>
            </Grid>
        </Grid>
    );
};
DepartmentTechnicalReportForm.propTypes = {
    control: PropTypes.any,
    isSubmitting: PropTypes.bool,
};
export default DepartmentTechnicalReportForm;
