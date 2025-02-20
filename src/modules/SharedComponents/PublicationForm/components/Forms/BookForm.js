import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';
import { ListEditorField, IssnListEditorField, IssnRowItemTemplate } from 'modules/SharedComponents/Toolbox/ListEditor';
import { NtroFields } from 'modules/SharedComponents/Toolbox/NtroFields';
import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { validation } from 'config';
import { locale } from 'locale';
import { NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION, SUBTYPE_EDITED_BOOK } from 'config/general';
import { default as formLocale } from 'locale/publicationForm';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { hasAtLeastOneItemSelected } from 'helpers/general';

export const BookForm = ({
    isSubmitting,
    control,
    values,
    subtype = null,
    isNtro = false,
    isAuthorSelected: showContributionStatement = false,
}) => {
    const txt = formLocale.book;
    const isAuthorSelected = hasAtLeastOneItemSelected(values.authors);
    const isEditorSelected = hasAtLeastOneItemSelected(values.editors);
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <StandardCard title={txt.information.title} help={txt.information.help}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Field
                                control={control}
                                component={TextField}
                                autoFocus={!isNtro}
                                disabled={isSubmitting}
                                id="rek-title"
                                textFieldId="rek-title"
                                name="rek_title"
                                required
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                label={txt.information.fieldLabels.bookTitle}
                                validate={[validation.required, validation.maxLength1000Validator]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={!isNtro ? 4 : 6}>
                            <Field
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
                                id="rek-place-of-publication"
                                textFieldId="rek-place-of-publication"
                                name="fez_record_search_key_place_of_publication.rek_place_of_publication"
                                type="text"
                                required
                                fullWidth
                                label={txt.information.fieldLabels.publicationPlace}
                                validate={[validation.required, validation.maxLength255Validator]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={!isNtro ? 4 : 6}>
                            <Field
                                control={control}
                                component={TextField}
                                disabled={isSubmitting}
                                id="rek-publisher"
                                textFieldId="rek-publisher"
                                name="fez_record_search_key_publisher.rek_publisher"
                                type="text"
                                required
                                fullWidth
                                label={txt.information.fieldLabels.publisher}
                                validate={[validation.required, validation.maxLength255Validator]}
                            />
                        </Grid>
                        {!isNtro && (
                            <Grid item xs={12} sm={4}>
                                <Field
                                    control={control}
                                    component={TextField}
                                    name="fez_record_search_key_total_pages.rek_total_pages"
                                    textFieldId="rek-total-pages"
                                    type="text"
                                    fullWidth
                                    disabled={isSubmitting}
                                    label={txt.information.fieldLabels.extent.label}
                                    placeholder={txt.information.fieldLabels.extent.placeholder}
                                    validate={[validation.maxLength255Validator]}
                                />
                            </Grid>
                        )}
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
            {subtype !== SUBTYPE_EDITED_BOOK && !values.editors?.length && (
                <Grid item xs={12}>
                    <StandardCard title={txt.authors.title} help={txt.authors.help}>
                        <Field
                            control={control}
                            component={ContributorsEditorField}
                            canEdit
                            forceSelectable
                            hideUqIDFields
                            maintainSelected
                            contributorEditorId="rek-author"
                            name="authors"
                            locale={txt.authors.field}
                            showContributorAssignment={!isEditorSelected}
                            required
                            disabled={isSubmitting}
                            isNtro={isNtro}
                        />
                    </StandardCard>
                </Grid>
            )}
            {!values.authors?.length && (
                <Grid item xs={12}>
                    <StandardCard title={txt.editors.title} help={txt.editors.help}>
                        <Field
                            control={control}
                            component={ContributorsEditorField}
                            canEdit
                            forceSelectable
                            hideUqIDFields
                            maintainSelected
                            contributorEditorId="rek-contributor"
                            showContributorAssignment={!isAuthorSelected}
                            id="editors-name-as-published-field"
                            name="editors"
                            locale={txt.editors.field}
                            disabled={isSubmitting}
                        />
                    </StandardCard>
                </Grid>
            )}
            {isNtro && (
                <NtroFields
                    control={control}
                    canEdit
                    isSubmitting={isSubmitting}
                    showContributionStatement={showContributionStatement}
                    hideIsmn={subtype !== NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION}
                    hideIsrc
                    hideVolume
                    hideIssue
                    hideSeries
                    hideStartPage
                    hideEndPage
                    hideOriginalFormat
                    hideAudienceSize
                />
            )}
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
                <StandardCard title={txt.optional.title} help={txt.optional.help}>
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
                                label={txt.optional.fieldLabels.notes}
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
                                label={txt.optional.fieldLabels.url}
                                validate={[validation.url]}
                            />
                        </Grid>
                    </Grid>
                </StandardCard>
            </Grid>
        </Grid>
    );
};
BookForm.propTypes = {
    control: PropTypes.any,
    isSubmitting: PropTypes.bool,
    values: PropTypes.object,
    subtype: PropTypes.string,
    isNtro: PropTypes.bool,
    isAuthorSelected: PropTypes.bool,
};

export default BookForm;
