import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
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

export const DesignForm = ({ control, formValues, isSubmitting, isNtro, isAuthorSelected }) => {
    // path to the locale data for each of the sections
    const txt = formLocale.design;

    const _formValues = formValues && formValues.toJS();
    const startDate = _formValues && _formValues.rek_date;
    const endDate =
        _formValues &&
        _formValues.fez_record_search_key_end_date &&
        _formValues.fez_record_search_key_end_date.rek_end_date;
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
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
                                autoFocus={!isNtro}
                                name="rek_title"
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                {...txt.information.fieldLabels.articleTitle}
                                required
                                validate={[validation.required, validation.maxLength1000Validator]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Field
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
                                name="fez_record_search_key_project_name.rek_project_name"
                                type="text"
                                fullWidth
                                {...txt.information.fieldLabels.projectName}
                                validate={[validation.maxLength255Validator]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
                                name="fez_record_search_key_location[0].rek_location"
                                type="text"
                                fullWidth
                                {...txt.information.fieldLabels.location}
                                validate={[validation.maxLength255Validator]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
                                name="fez_record_search_key_publisher.rek_publisher"
                                type="text"
                                fullWidth
                                required
                                validate={[validation.required, validation.maxLength255Validator]}
                                {...txt.information.fieldLabels.publisher}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
                                name="fez_record_search_key_place_of_publication.rek_place_of_publication"
                                type="text"
                                fullWidth
                                required
                                validate={[validation.required, validation.maxLength255Validator]}
                                {...txt.information.fieldLabels.placeOfPublication}
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
                                partialDateFieldId="rek-project-start-date"
                                disabled={isSubmitting}
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
                                control={control}
                                component={PartialDateField}
                                disabled={isSubmitting}
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
                        control={control}
                        component={ContributorsEditorField}
                        canEdit
                        forceSelectable
                        hideUqIDFields
                        maintainSelected
                        contributorEditorId="authors"
                        showContributorAssignment
                        required
                        name="authors"
                        locale={txt.authors.field}
                        disabled={isSubmitting}
                        validate={[validation.authorRequired]}
                        isNtro={isNtro}
                    />
                </StandardCard>
            </Grid>
            {isNtro && (
                <NtroFields
                    control={control}
                    canEdit
                    isSubmitting={isSubmitting}
                    showContributionStatement={isAuthorSelected}
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
                                control={control}
                                component={TextField}
                                name="comments"
                                type="text"
                                disabled={isSubmitting}
                                fullWidth
                                multiline
                                rows={1}
                                {...txt.optional.fieldLabels.notes}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                control={control}
                                component={TextField}
                                name="rek_link"
                                type="text"
                                disabled={isSubmitting}
                                fullWidth
                                {...txt.optional.fieldLabels.url}
                                validate={[validation.url]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                control={control}
                                component={TextField}
                                name="rek_link_description"
                                type="text"
                                disabled={isSubmitting}
                                fullWidth
                                label={'Link description'}
                            />
                        </Grid>
                    </Grid>
                </StandardCard>
            </Grid>
        </Grid>
    );
};
DesignForm.propTypes = {
    control: PropTypes.any,
    isSubmitting: PropTypes.bool,
    formValues: PropTypes.object,
    isNtro: PropTypes.bool,
    isAuthorSelected: PropTypes.bool,
};
export default DesignForm;
