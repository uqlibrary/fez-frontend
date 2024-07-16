import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

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

export const BookForm = ({ submitting, formValues, subtype, isNtro, isAuthorSelected }) => {
    const normalizeIssn = value => {
        const newValue = value.replace('-', '');
        return newValue.length >= 5 ? [newValue.slice(0, 4), '-', newValue.slice(4)].join('') : newValue;
    };

    const transformIssn = (searchKey, item, index) => ({
        [searchKey.value]: item.key,
        [searchKey.order]: index + 1,
    });

    const txt = formLocale.book;
    const editors = formValues && formValues.get('editors');
    const editorSelected = !!editors && editors.filter(editor => editor.selected).length > 0;
    const authors = formValues && formValues.get('authors');
    const authorSelected = !!authors && authors.filter(author => author.selected).length > 0;
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
                                id="rek-title"
                                textFieldId="rek-title"
                                name="rek_title"
                                required
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                label={txt.information.fieldLabels.bookTitle}
                                validate={[validation.required]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={!isNtro ? 4 : 6}>
                            <Field
                                component={TextField}
                                disabled={submitting}
                                id="rek-place-of-publication"
                                textFieldId="rek-place-of-publication"
                                name="fez_record_search_key_place_of_publication.rek_place_of_publication"
                                type="text"
                                required
                                fullWidth
                                label={txt.information.fieldLabels.publicationPlace}
                                validate={[validation.required]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={!isNtro ? 4 : 6}>
                            <Field
                                component={TextField}
                                disabled={submitting}
                                id="rek-publisher"
                                textFieldId="rek-publisher"
                                name="fez_record_search_key_publisher.rek_publisher"
                                type="text"
                                required
                                fullWidth
                                label={txt.information.fieldLabels.publisher}
                                validate={[validation.required]}
                            />
                        </Grid>
                        {!isNtro && (
                            <Grid item xs={12} sm={4}>
                                <Field
                                    component={TextField}
                                    name="fez_record_search_key_total_pages.rek_total_pages"
                                    textFieldId="rek-total-pages"
                                    type="text"
                                    fullWidth
                                    disabled={submitting}
                                    label={txt.information.fieldLabels.extent.label}
                                    placeholder={txt.information.fieldLabels.extent.placeholder}
                                />
                            </Grid>
                        )}
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
            {subtype !== SUBTYPE_EDITED_BOOK && (!editors || editors.length === 0) && (
                <Grid item xs={12}>
                    <StandardCard title={txt.authors.title} help={txt.authors.help}>
                        <Field
                            component={ContributorsEditorField}
                            canEdit
                            forceSelectable
                            hideUqIDFields
                            maintainSelected
                            contributorEditorId="rek-author"
                            name="authors"
                            locale={txt.authors.field}
                            showContributorAssignment={!editorSelected}
                            required
                            disabled={submitting}
                            isNtro={isNtro}
                        />
                    </StandardCard>
                </Grid>
            )}
            {(!authors || authors.length === 0) && (
                <Grid item xs={12}>
                    <StandardCard title={txt.editors.title} help={txt.editors.help}>
                        <Field
                            component={ContributorsEditorField}
                            canEdit
                            forceSelectable
                            hideUqIDFields
                            maintainSelected
                            contributorEditorId="rek-contributor"
                            showContributorAssignment={!authorSelected}
                            id="editors-name-as-published-field"
                            name="editors"
                            locale={txt.editors.field}
                            disabled={submitting}
                        />
                    </StandardCard>
                </Grid>
            )}
            {isNtro && (
                <NtroFields
                    canEdit
                    submitting={submitting}
                    showContributionStatement={isAuthorSelected}
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
                <StandardCard title={txt.optional.title} help={txt.optional.help}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="comments"
                                textFieldId="comments"
                                type="text"
                                disabled={submitting}
                                fullWidth
                                multiline
                                label={txt.optional.fieldLabels.notes}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="rek_link"
                                textFieldId="rek-link"
                                type="text"
                                disabled={submitting}
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
    submitting: PropTypes.bool,
    formValues: PropTypes.object,
    subtype: PropTypes.string,
    isNtro: PropTypes.bool,
    isAuthorSelected: PropTypes.bool,
};

BookForm.defaultProps = {
    isNtro: false,
    subtype: null,
    isAuthorSelected: false,
};
export default BookForm;
