import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';

import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { validation } from 'config';
import { default as formLocale } from 'locale/publicationForm';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';

export const GenericDocumentForm = ({ control, isSubmitting }) => {
    // path to the locale data for each of the sections
    const txt = formLocale.generic;
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
                                autoFocus
                                name="rek_title"
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                {...txt.information.fieldLabels.documentTitle}
                                required
                                validate={[validation.required, validation.maxLength1000Validator]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
                                name="fez_record_search_key_place_of_publication.rek_place_of_publication"
                                type="text"
                                fullWidth
                                {...txt.information.fieldLabels.publicationPlace}
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
                                {...txt.information.fieldLabels.publisher}
                                validate={[validation.maxLength255Validator]}
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
                                type="text"
                                fullWidth
                                rows={3}
                                multiline
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
                        showContributorAssignment
                        required
                        name="authors"
                        locale={txt.authors.field}
                        validate={[validation.authorRequired]}
                        disabled={isSubmitting}
                    />
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.optional.title} help={txt.optional.help}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Field
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
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
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
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
};
GenericDocumentForm.propTypes = {
    control: PropTypes.any,
    isSubmitting: PropTypes.bool,
};
export default GenericDocumentForm;
