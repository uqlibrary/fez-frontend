import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';
import { IssnListEditorField, ListEditorField, IssnRowItemTemplate } from 'modules/SharedComponents/Toolbox/ListEditor';
import { ContributorsEditorField, MODE_GIVEN_NAME_FIRST } from 'modules/SharedComponents/ContributorsEditor';
import { validation } from 'config';
import { locale } from 'locale';
import { default as formLocale } from 'locale/publicationForm';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';

export const ConferenceProceedingsForm = ({ control, isSubmitting, canEdit }) => {
    const txt = formLocale.conferenceProceedings;
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
                                required
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                {...txt.information.fieldLabels.title}
                                validate={[validation.required, validation.maxLength1000Validator]}
                                style={{ marginBottom: '-12px' }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
                                name="fez_record_search_key_conference_name.rek_conference_name"
                                type="text"
                                required
                                fullWidth
                                {...txt.information.fieldLabels.conferenceName}
                                validate={[validation.required]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
                                name="fez_record_search_key_conference_location.rek_conference_location"
                                type="text"
                                fullWidth
                                required
                                validate={[validation.required, validation.maxLength255Validator]}
                                {...txt.information.fieldLabels.conferenceLocation}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
                                name="fez_record_search_key_conference_dates.rek_conference_dates"
                                type="text"
                                fullWidth
                                required
                                validate={[validation.required, validation.maxLength255Validator]}
                                {...txt.information.fieldLabels.conferenceDates}
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
                                component={TextField}
                                disabled={isSubmitting}
                                name="fez_record_search_key_place_of_publication.rek_place_of_publication"
                                type="text"
                                fullWidth
                                {...txt.information.fieldLabels.publicationPlace}
                                validate={[validation.maxLength255Validator]}
                            />
                        </Grid>
                    </Grid>
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.editors.title} help={txt.editors.help}>
                    <Typography>{txt.editors.description}</Typography>
                    <Field
                        control={control}
                        component={ContributorsEditorField}
                        canEdit={canEdit}
                        forceSelectable
                        hideUqIDFields
                        maintainSelected
                        contributorEditorId="editors"
                        name="editors"
                        required
                        locale={txt.editors.field}
                        showContributorAssignment
                        required
                        validate={[validation.editorRequired]}
                        disabled={isSubmitting}
                        popoverNamesFormMode={MODE_GIVEN_NAME_FIRST}
                    />
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={locale.components.isbnForm.title} help={locale.components.isbnForm.title.help}>
                    <Typography>{locale.components.isbnForm.text}</Typography>
                    <Field
                        control={control}
                        component={ListEditorField}
                        remindToAdd
                        name="fez_record_search_key_isbn"
                        isValid={validation.isValidIsbn}
                        maxCount={5}
                        searchKey={{ value: 'rek_isbn', order: 'rek_isbn_order' }}
                        locale={locale.components.isbnForm.field}
                        listEditorId="isbn"
                        disabled={isSubmitting}
                    />
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={locale.components.issnForm.title} help={locale.components.issnForm.title.help}>
                    <Typography>{locale.components.issnForm.text}</Typography>
                    <Field
                        control={control}
                        component={IssnListEditorField}
                        remindToAdd
                        isValid={validation.isValidIssn}
                        name="fez_record_search_key_issn"
                        maxCount={5}
                        locale={locale.components.issnForm.field}
                        listEditorId="issn"
                        searchKey={{ value: 'rek_issn', order: 'rek_issn_order' }}
                        disabled={isSubmitting}
                        rowItemTemplate={IssnRowItemTemplate}
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
                                type="text"
                                disabled={isSubmitting}
                                fullWidth
                                {...txt.other.fieldLabels.link}
                                validate={[validation.url]}
                            />
                        </Grid>
                    </Grid>
                </StandardCard>
            </Grid>
        </Grid>
    );
};
ConferenceProceedingsForm.propTypes = {
    control: PropTypes.any,
    isSubmitting: PropTypes.bool,
    canEdit: PropTypes.bool,
};
export default ConferenceProceedingsForm;
