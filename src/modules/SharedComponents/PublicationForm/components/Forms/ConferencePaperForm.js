import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';
import { IssnListEditorField, ListEditorField, IssnRowItemTemplate } from 'modules/SharedComponents/Toolbox/ListEditor';
import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { validation } from 'config';
import { locale } from 'locale';
import { default as formLocale } from 'locale/publicationForm';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export const ConferencePaperForm = ({ control, isSubmitting }) => {
    const txt = formLocale.conferencePaper;
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
                                label={txt.information.fieldLabels.title}
                                validate={[validation.required, validation.maxLength1000Validator]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
                                name="fez_record_search_key_conference_name.rek_conference_name"
                                type="text"
                                required
                                fullWidth
                                label={txt.information.fieldLabels.conferenceName}
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
                                label={txt.information.fieldLabels.conferenceLocation}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
                                name="fez_record_search_key_conference_dates.rek_conference_dates"
                                type="text"
                                fullWidth
                                required
                                validate={[validation.required, validation.maxLength255Validator]}
                                label={txt.information.fieldLabels.conferenceDates}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
                                name="fez_record_search_key_proceedings_title.rek_proceedings_title"
                                type="text"
                                fullWidth
                                label={txt.information.fieldLabels.proceedingsTitle}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
                                name="fez_record_search_key_journal_name.rek_journal_name"
                                type="text"
                                fullWidth
                                validate={[validation.maxLength255Validator]}
                                label={txt.information.fieldLabels.journalName}
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
                                validate={[validation.maxLength255Validator]}
                                label={txt.information.fieldLabels.publicationPlace}
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
                                validate={[validation.maxLength255Validator]}
                                label={txt.information.fieldLabels.publisher}
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
                        listEditorId="isbn"
                        locale={locale.components.isbnForm.field}
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
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={TextField}
                                name="fez_record_search_key_start_page.rek_start_page"
                                type="text"
                                fullWidth
                                disabled={isSubmitting}
                                label={txt.other.fieldLabels.startPage}
                                validate={[validation.maxLength255Validator]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                control={control}
                                component={TextField}
                                name="fez_record_search_key_end_page.rek_end_page"
                                type="text"
                                fullWidth
                                disabled={isSubmitting}
                                label={txt.other.fieldLabels.endPage}
                                validate={[validation.maxLength255Validator]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                control={control}
                                component={TextField}
                                name="comments"
                                type="text"
                                disabled={isSubmitting}
                                fullWidth
                                multiline
                                label={txt.other.fieldLabels.notes}
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
                                label={txt.other.fieldLabels.url}
                                validate={[validation.url]}
                            />
                        </Grid>
                    </Grid>
                </StandardCard>
            </Grid>
        </Grid>
    );
};
ConferencePaperForm.propTypes = {
    control: PropTypes.any,
    isSubmitting: PropTypes.bool,
};
export default ConferencePaperForm;
