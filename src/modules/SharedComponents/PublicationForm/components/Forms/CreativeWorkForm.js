import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';
import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { NtroFields } from 'modules/SharedComponents/Toolbox/NtroFields';

import { validation } from 'config';
import { default as formLocale } from 'locale/publicationForm';
import {
    CPEE_NTRO_SUBTYPES,
    LP_NTRO_SUBTYPES,
    NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT,
    NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION,
    NTRO_SUBTYPE_CW_OTHER,
    NTRO_SUBTYPE_CW_TEXTUAL_WORK,
    NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
    RRW_NTRO_SUBTYPES,
} from 'config/general';
import { dateRange } from 'config/validation';

export const CreativeWorkForm = ({ isSubmitting, subtype, isNtro, isAuthorSelected, control, values }) => {
    const txt = formLocale.creativeWork;
    // not sure why rek_date is used as the start date in here
    const hasDateError = dateRange(values.rek_date, values.fez_record_search_key_end_date?.rek_end_date);
    const displayEndDate = [
        ...LP_NTRO_SUBTYPES,
        ...CPEE_NTRO_SUBTYPES,
        NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
    ].includes(subtype);
    const isNtroCpeeExhibitionEvent = subtype === NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT;

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
                        <Grid item xs={12} sm={isNtroCpeeExhibitionEvent ? 12 : 6}>
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
                        <Grid item xs={12} sm={isNtroCpeeExhibitionEvent ? 12 : 6}>
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
                        {!isNtroCpeeExhibitionEvent && (
                            <Grid item xs={12} sm={displayEndDate ? 12 : 6}>
                                <Field
                                    control={control}
                                    component={TextField}
                                    disabled={isSubmitting}
                                    name="fez_record_search_key_doi.rek_doi"
                                    type="text"
                                    fullWidth
                                    validate={[validation.doi]}
                                    {...txt.information.fieldLabels.doi}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={PartialDateField}
                                disabled={isSubmitting}
                                name="rek_date"
                                allowPartial
                                required
                                className="requiredHintField"
                                validate={[validation.required]}
                                floatingTitle={txt.information.fieldLabels.date.title}
                                floatingTitleRequired
                                hasError={hasDateError}
                                partialDateFieldId="rek-date"
                            />
                        </Grid>
                        {displayEndDate && (
                            <Grid item xs={12} sm={6}>
                                <Field
                                    control={control}
                                    component={PartialDateField}
                                    disabled={isSubmitting}
                                    name="fez_record_search_key_end_date.rek_end_date"
                                    allowPartial
                                    floatingTitle={txt.information.fieldLabels.endDate.title}
                                    hasError={hasDateError}
                                    partialDateFieldId="rek-end-date"
                                />
                            </Grid>
                        )}
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
                        maintainSelected
                        contributorEditorId="authors"
                        disabled={isSubmitting}
                        isNtro={isNtro}
                        locale={txt.authors.field}
                        name="authors"
                        required
                        showContributorAssignment
                        validate={[validation.authorRequired]}
                    />
                </StandardCard>
            </Grid>
            {isNtro && (
                <NtroFields
                    control={control}
                    canEdit
                    isSubmitting={isSubmitting}
                    showContributionStatement={isAuthorSelected}
                    hideIsmn={subtype !== NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION}
                    hideIsrc={!RRW_NTRO_SUBTYPES.includes(subtype)}
                    hideAudienceSize={![...LP_NTRO_SUBTYPES, ...CPEE_NTRO_SUBTYPES].includes(subtype)}
                    hideVolume={![NTRO_SUBTYPE_CW_OTHER, NTRO_SUBTYPE_CW_TEXTUAL_WORK].includes(subtype)}
                    hideIssue={![NTRO_SUBTYPE_CW_OTHER, NTRO_SUBTYPE_CW_TEXTUAL_WORK].includes(subtype)}
                    hideOriginalFormat={CPEE_NTRO_SUBTYPES.includes(subtype)}
                />
            )}
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
                                multiline
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
CreativeWorkForm.propTypes = {
    control: PropTypes.any,
    isSubmitting: PropTypes.bool,
    subtype: PropTypes.string,
    isNtro: PropTypes.bool,
    isAuthorSelected: PropTypes.bool,
    values: PropTypes.object,
};
export default CreativeWorkForm;
