import React from 'react';
import { Field } from 'redux-form/immutable';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';
import { IssnListEditorField, ListEditorField, IssnRowItemTemplate } from 'modules/SharedComponents/Toolbox/ListEditor';
import { NtroFields } from 'modules/SharedComponents/Toolbox/NtroFields';

import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { validation } from 'config';
import { locale } from 'locale';
import { NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION } from 'config/general';
import { default as formLocale } from 'locale/publicationForm';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import PropTypes from 'prop-types';

export const BookChapterForm = ({ submitting, subtype, isNtro, isAuthorSelected, formValues }) => {
    const normalizeIssn = value => {
        const newValue = value.replace('-', '');
        return newValue.length >= 5 ? [newValue.slice(0, 4), '-', newValue.slice(4)].join('') : newValue;
    };

    const transformIssn = (searchKey, item, index) => ({
        [searchKey.value]: item.key,
        [searchKey.order]: index + 1,
    });

    const txt = formLocale.bookChapter;
    const _formValues = formValues && formValues.toJS();
    const startPage =
        _formValues &&
        _formValues.fez_record_search_key_start_page &&
        _formValues.fez_record_search_key_start_page.rek_start_page;
    const endPage =
        _formValues &&
        _formValues.fez_record_search_key_end_page &&
        _formValues.fez_record_search_key_end_page.rek_end_page;
    const pageError =
        !!startPage && !!endPage && parseInt(startPage, 10) > parseInt(endPage, 10) ? 'Page range invalid' : '';
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <StandardCard title={txt.information.title} help={txt.information.help}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                autoFocus={!isNtro}
                                disabled={submitting}
                                name="rek_title"
                                required
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                label={txt.information.fieldLabels.bookChapterTitle}
                                validate={[validation.required]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                disabled={submitting}
                                name="fez_record_search_key_book_title.rek_book_title"
                                required
                                type="text"
                                fullWidth
                                multiline
                                rows={1}
                                label={txt.information.fieldLabels.bookTitle}
                                validate={[validation.required]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                disabled={submitting}
                                name="fez_record_search_key_place_of_publication.rek_place_of_publication"
                                type="text"
                                required
                                fullWidth
                                label={txt.information.fieldLabels.publicationPlace}
                                validate={[validation.required]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                disabled={submitting}
                                name="fez_record_search_key_publisher.rek_publisher"
                                type="text"
                                fullWidth
                                required
                                validate={[validation.required]}
                                label={txt.information.fieldLabels.publisher}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                disabled={submitting}
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
                    </Grid>
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.authors.title} help={txt.authors.help}>
                    <Field
                        component={ContributorsEditorField}
                        canEdit
                        forceSelectable
                        maintainSelected
                        hideUqIDFields
                        contributorEditorId="authors"
                        name="authors"
                        locale={txt.authors.field}
                        showContributorAssignment
                        required
                        validate={[validation.authorRequired]}
                        disabled={submitting}
                        isNtro={isNtro}
                    />
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.editors.title} help={txt.editors.help}>
                    <Field
                        component={ContributorsEditorField}
                        canEdit
                        maintainSelected
                        // forceSelectable
                        hideUqIDFields
                        contributorEditorId="editors"
                        name="editors"
                        locale={txt.editors.field}
                        disabled={submitting}
                    />
                </StandardCard>
            </Grid>
            {isNtro && (
                <NtroFields
                    canEdit
                    submitting={submitting}
                    showContributionStatement={isAuthorSelected}
                    hideIsmn={subtype !== NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION}
                    hideIsrc
                    hideVolume
                    hideIssue
                    hideStartPage
                    hideEndPage
                    hideExtent
                    hideOriginalFormat
                    hideAudienceSize
                />
            )}
            <Grid item xs={12}>
                <StandardCard title={locale.components.isbnForm.title} help={locale.components.isbnForm.title.help}>
                    <Typography>{locale.components.isbnForm.text}</Typography>
                    <Field
                        component={ListEditorField}
                        remindToAdd
                        name="fez_record_search_key_isbn"
                        isValid={validation.isValidIsbn}
                        maxCount={5}
                        searchKey={{ value: 'rek_isbn', order: 'rek_isbn_order' }}
                        listEditorId="isbn"
                        locale={locale.components.isbnForm.field}
                        disabled={submitting}
                    />
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={locale.components.issnForm.title} help={locale.components.issnForm.title.help}>
                    <Typography>{locale.components.issnForm.text}</Typography>
                    <Field
                        component={IssnListEditorField}
                        remindToAdd
                        isValid={validation.isValidIssn}
                        name="fez_record_search_key_issn"
                        maxCount={5}
                        locale={locale.components.issnForm.field}
                        listEditorId="issn"
                        searchKey={{ value: 'rek_issn', order: 'rek_issn_order' }}
                        disabled={submitting}
                        inputNormalizer={normalizeIssn}
                        rowItemTemplate={IssnRowItemTemplate}
                        transformFunction={transformIssn}
                    />
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.other.title} help={txt.other.help}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="fez_record_search_key_edition.rek_edition"
                                type="text"
                                fullWidth
                                disabled={submitting}
                                label={txt.other.fieldLabels.edition}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                name="fez_record_search_key_start_page.rek_start_page"
                                type="text"
                                fullWidth
                                disabled={submitting}
                                required
                                validate={[validation.required]}
                                label={txt.other.fieldLabels.startPage}
                                error={!!pageError}
                                errorText={pageError}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                name="fez_record_search_key_end_page.rek_end_page"
                                type="text"
                                fullWidth
                                disabled={submitting}
                                required
                                validate={[validation.required]}
                                label={txt.other.fieldLabels.endPage}
                                error={!!pageError}
                                errorText={pageError}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="comments"
                                type="text"
                                disabled={submitting}
                                fullWidth
                                multiline
                                label={txt.other.fieldLabels.notes}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="rek_link"
                                type="text"
                                disabled={submitting}
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
BookChapterForm.propTypes = {
    submitting: PropTypes.bool,
    subtype: PropTypes.string,
    isNtro: PropTypes.bool,
    isAuthorSelected: PropTypes.bool,
    formValues: PropTypes.any,
};
export default BookChapterForm;
