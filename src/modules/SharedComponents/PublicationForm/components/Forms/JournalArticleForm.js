import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';
import { NtroFields } from 'modules/SharedComponents/Toolbox/NtroFields';
import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { validation } from 'config';
import { default as formLocale } from 'locale/publicationForm';
import { NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION } from 'config/general';
import { locale } from 'locale';
import { IssnListEditorField, IssnRowItemTemplate } from 'modules/SharedComponents/Toolbox/ListEditor';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export const JournalArticleForm = ({ control, isSubmitting, subtype, isNtro, isAuthorSelected }) => {
    // path to the locale data for each of the sections
    const txt = formLocale.journalArticle;
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
                                textFieldId="rek-title"
                                type="text"
                                rows={3}
                                multiline
                                fullWidth
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
                                name="fez_record_search_key_journal_name.rek_journal_name"
                                textFieldId="rek-journal-name"
                                type="text"
                                required
                                fullWidth
                                {...txt.information.fieldLabels.journalTitle}
                                validate={[validation.required, validation.maxLength255Validator]}
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
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography>{txt.authors.description}</Typography>
                            <Field
                                control={control}
                                component={ContributorsEditorField}
                                canEdit
                                forceSelectable
                                maintainSelected
                                hideUqIDFields
                                contributorEditorId="authors"
                                showContributorAssignment
                                name="authors"
                                locale={txt.authors.field}
                                disabled={isSubmitting}
                                validate={[validation.authorRequired]}
                                isNtro={isNtro}
                                required
                            />
                        </Grid>
                    </Grid>
                </StandardCard>
            </Grid>
            {isNtro && (
                <NtroFields
                    control={control}
                    canEdit
                    isSubmitting={isSubmitting}
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
                        searchKey={{ value: 'rek_issn', order: 'rek_issn_order' }}
                        listEditorId="issn"
                        disabled={isSubmitting}
                        rowItemTemplate={IssnRowItemTemplate}
                    />
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.optional.title} help={txt.optional.help}>
                    <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                            <Field
                                control={control}
                                component={TextField}
                                name="fez_record_search_key_volume_number.rek_volume_number"
                                textFieldId="rek-volume-number"
                                type="text"
                                fullWidth
                                disabled={isSubmitting}
                                label={txt.optional.fieldLabels.volume}
                                validate={[validation.maxLength255Validator]}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Field
                                control={control}
                                component={TextField}
                                name="fez_record_search_key_issue_number.rek_issue_number"
                                textFieldId="rek-issue-number"
                                type="text"
                                fullWidth
                                disabled={isSubmitting}
                                label={txt.optional.fieldLabels.issue}
                                validate={[validation.maxLength255Validator]}
                            />
                        </Grid>

                        <Grid item xs={6} sm={3}>
                            <Field
                                control={control}
                                component={TextField}
                                name="fez_record_search_key_start_page.rek_start_page"
                                textFieldId="rek-start-page"
                                type="text"
                                fullWidth
                                disabled={isSubmitting}
                                label={txt.optional.fieldLabels.startPage}
                                validate={[validation.maxLength255Validator]}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Field
                                control={control}
                                component={TextField}
                                name="fez_record_search_key_end_page.rek_end_page"
                                textFieldId="rek-end-page"
                                type="text"
                                fullWidth
                                disabled={isSubmitting}
                                label={txt.optional.fieldLabels.endPage}
                                validate={[validation.maxLength255Validator]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                control={control}
                                component={TextField}
                                name="fez_record_search_key_article_number.rek_article_number"
                                textFieldId="rek-article-number"
                                type="text"
                                fullWidth
                                disabled={isSubmitting}
                                label={txt.optional.fieldLabels.articleNumber}
                                validate={[validation.maxLength255Validator]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                control={control}
                                component={TextField}
                                textFieldId="comments"
                                name="comments"
                                type="text"
                                disabled={isSubmitting}
                                fullWidth
                                multiline
                                rows={1}
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
JournalArticleForm.propTypes = {
    control: PropTypes.any,
    isSubmitting: PropTypes.bool,
    subtype: PropTypes.string,
    isNtro: PropTypes.bool,
    isAuthorSelected: PropTypes.bool,
};
export default JournalArticleForm;
