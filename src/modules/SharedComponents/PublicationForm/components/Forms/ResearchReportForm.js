import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';
import { IssnListEditorField, ListEditorField, IssnRowItemTemplate } from 'modules/SharedComponents/Toolbox/ListEditor';

import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';

import { OrgUnitNameField, SeriesField } from 'modules/SharedComponents/LookupFields';
import { NtroFields } from 'modules/SharedComponents/Toolbox/NtroFields';

import { validation } from 'config';
import { locale } from 'locale';
import { default as formLocale } from 'locale/publicationForm';
import {
    NTRO_SUBTYPE_RREB_PUBLIC_SECTOR,
    NTRO_SUBTYPE_RREB_INDUSTRY,
    NTRO_SUBTYPE_RREB_NOT_FOR_PROFIT,
    NTRO_SUBTYPE_RREB_OTHER,
} from 'config/general';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export const ResearchReportForm = ({ submitting, isNtro, isAuthorSelected, formValues }) => {
    const normalizeIssn = value => {
        const newValue = value.replace('-', '');
        return newValue.length >= 5 ? [newValue.slice(0, 4), '-', newValue.slice(4)].join('') : newValue;
    };

    const transformIssn = (searchKey, item, index) => ({
        [searchKey.value]: item.key,
        [searchKey.order]: index + 1,
    });

    const getNumbersOnly = value => {
        return value.replace(/[^\d]/g, '');
    };

    const txt = formLocale.researchReport;
    const pubsMandatory =
        (formValues && formValues.get('rek_subtype') === NTRO_SUBTYPE_RREB_PUBLIC_SECTOR) ||
        formValues.get('rek_subtype') === NTRO_SUBTYPE_RREB_INDUSTRY ||
        formValues.get('rek_subtype') === NTRO_SUBTYPE_RREB_NOT_FOR_PROFIT ||
        formValues.get('rek_subtype') === NTRO_SUBTYPE_RREB_OTHER;
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
                                {...txt.information.fieldLabels.documentTitle}
                                validate={[validation.required]}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Field
                                component={TextField}
                                disabled={submitting}
                                name="fez_record_search_key_place_of_publication.rek_place_of_publication"
                                type="text"
                                fullWidth
                                {...txt.information.fieldLabels.publicationPlace}
                                required={pubsMandatory}
                                validate={pubsMandatory ? [validation.required] : undefined}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Field
                                component={TextField}
                                disabled={submitting}
                                name="fez_record_search_key_publisher.rek_publisher"
                                type="text"
                                fullWidth
                                {...txt.information.fieldLabels.publisher}
                                required={pubsMandatory}
                                validate={pubsMandatory ? [validation.required] : undefined}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Field
                                component={TextField}
                                disabled={submitting}
                                name="fez_record_search_key_report_number.rek_report_number"
                                type="text"
                                fullWidth
                                {...txt.information.fieldLabels.reportNumber}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={OrgUnitNameField}
                                name="fez_record_search_key_org_unit_name.rek_org_unit_name"
                                disabled={submitting}
                                {...txt.information.fieldLabels.orgUnitName}
                            />
                        </Grid>
                        {!isNtro && (
                            <Grid item xs={12} sm={4}>
                                <Field
                                    component={TextField}
                                    name="fez_record_search_key_total_pages.rek_total_pages"
                                    type="text"
                                    disabled={submitting}
                                    fullWidth
                                    required
                                    {...txt.information.fieldLabels.totalPages}
                                    normalize={getNumbersOnly}
                                    validate={[validation.required]}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12} sm={isNtro ? 6 : 4}>
                            <Field
                                component={TextField}
                                disabled={submitting}
                                name="fez_record_search_key_doi.rek_doi"
                                type="text"
                                fullWidth
                                validate={[validation.doi]}
                                {...txt.information.fieldLabels.doi}
                            />
                        </Grid>
                        <Grid item xs={12} sm={isNtro ? 6 : 4}>
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
                        {!isNtro && (
                            <Grid item xs={12}>
                                <Field
                                    component={SeriesField}
                                    name="fez_record_search_key_series.rek_series"
                                    disabled={submitting}
                                    {...txt.information.fieldLabels.series}
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
                        component={ContributorsEditorField}
                        canEdit
                        forceSelectable
                        hideUqIDFields
                        maintainSelected
                        contributorEditorId="authors"
                        name="authors"
                        isNtro={isNtro}
                        locale={txt.authors.field}
                        showContributorAssignment
                        required
                        validate={[validation.authorRequired]}
                        disabled={submitting}
                    />
                </StandardCard>
            </Grid>
            {isNtro && (
                <NtroFields
                    canEdit
                    submitting={submitting}
                    showContributionStatement={isAuthorSelected}
                    hideIsmn
                    hideIsrc
                    hideVolume
                    hideIssue
                    hideStartPage
                    hideEndPage
                    hideExtent={!isNtro}
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
                        locale={locale.components.isbnForm.field}
                        listEditorId="isbn"
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
                        {!isNtro && (
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    name="rek_description"
                                    type="text"
                                    disabled={submitting}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    {...txt.other.fieldLabels.abstract}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="comments"
                                type="text"
                                disabled={submitting}
                                fullWidth
                                multiline
                                {...txt.other.fieldLabels.notes}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="rek_link"
                                type="text"
                                disabled={submitting}
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
ResearchReportForm.propTypes = {
    submitting: PropTypes.bool,
    isNtro: PropTypes.bool,
    isAuthorSelected: PropTypes.bool,
    formValues: PropTypes.any,
};
export default ResearchReportForm;
