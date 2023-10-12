import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';
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

export default class JournalArticleForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool,
        subtype: PropTypes.string,
        isNtro: PropTypes.bool,
        isAuthorSelected: PropTypes.bool,
    };

    constructor(props) {
        super(props);
    }

    normalizeIssn = value => {
        const newValue = value.replace('-', '');
        return newValue.length >= 5 ? [newValue.slice(0, 4), '-', newValue.slice(4)].join('') : newValue;
    };

    transformIssn = (searchKey, item, index) => ({
        [searchKey.value]: item.key,
        [searchKey.order]: index + 1,
    });

    render() {
        // path to the locale data for each of the sections
        const txt = formLocale.journalArticle;
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <StandardCard title={txt.information.title} help={txt.information.help}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    autoFocus={!this.props.isNtro}
                                    name="rek_title"
                                    textFieldId="rek-title"
                                    type="text"
                                    rows={3}
                                    multiline
                                    fullWidth
                                    {...txt.information.fieldLabels.documentTitle}
                                    required
                                    validate={[validation.required]}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_journal_name.rek_journal_name"
                                    textFieldId="rek-journal-name"
                                    type="text"
                                    required
                                    fullWidth
                                    {...txt.information.fieldLabels.journalTitle}
                                    validate={[validation.required]}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
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
                                    disabled={this.props.submitting}
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
                                    component={ContributorsEditorField}
                                    canEdit
                                    forceSelectable
                                    hideUqIDFields
                                    contributorEditorId="authors"
                                    showContributorAssignment
                                    name="authors"
                                    locale={txt.authors.field}
                                    disabled={this.props.submitting}
                                    validate={[validation.authorRequired]}
                                    isNtro={this.props.isNtro}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </StandardCard>
                </Grid>
                {this.props.isNtro && (
                    <NtroFields
                        canEdit
                        submitting={this.props.submitting}
                        showContributionStatement={this.props.isAuthorSelected}
                        hideIsmn={this.props.subtype !== NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION}
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
                            component={IssnListEditorField}
                            remindToAdd
                            isValid={validation.isValidIssn}
                            name="fez_record_search_key_issn"
                            maxCount={5}
                            locale={locale.components.issnForm.field}
                            searchKey={{ value: 'rek_issn', order: 'rek_issn_order' }}
                            listEditorId="issn"
                            disabled={this.props.submitting}
                            inputNormalizer={this.normalizeIssn}
                            rowItemTemplate={IssnRowItemTemplate}
                            transformFunction={this.transformIssn}
                        />
                    </StandardCard>
                </Grid>
                <Grid item xs={12}>
                    <StandardCard title={txt.optional.title} help={txt.optional.help}>
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={3}>
                                <Field
                                    component={TextField}
                                    name="fez_record_search_key_volume_number.rek_volume_number"
                                    textFieldId="rek-volume-number"
                                    type="text"
                                    fullWidth
                                    disabled={this.props.submitting}
                                    label={txt.optional.fieldLabels.volume}
                                />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Field
                                    component={TextField}
                                    name="fez_record_search_key_issue_number.rek_issue_number"
                                    textFieldId="rek-issue-number"
                                    type="text"
                                    fullWidth
                                    disabled={this.props.submitting}
                                    label={txt.optional.fieldLabels.issue}
                                />
                            </Grid>

                            <Grid item xs={6} sm={3}>
                                <Field
                                    component={TextField}
                                    name="fez_record_search_key_start_page.rek_start_page"
                                    textFieldId="rek-start-page"
                                    type="text"
                                    fullWidth
                                    disabled={this.props.submitting}
                                    label={txt.optional.fieldLabels.startPage}
                                />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Field
                                    component={TextField}
                                    name="fez_record_search_key_end_page.rek_end_page"
                                    textFieldId="rek-end-page"
                                    type="text"
                                    fullWidth
                                    disabled={this.props.submitting}
                                    label={txt.optional.fieldLabels.endPage}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    name="fez_record_search_key_article_number.rek_article_number"
                                    textFieldId="rek-article-number"
                                    type="text"
                                    fullWidth
                                    disabled={this.props.submitting}
                                    label={txt.optional.fieldLabels.articleNumber}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    textFieldId="comments"
                                    name="comments"
                                    type="text"
                                    disabled={this.props.submitting}
                                    fullWidth
                                    multiline
                                    rows={1}
                                    label={txt.optional.fieldLabels.notes}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    name="rek_link"
                                    textFieldId="rek-link"
                                    type="text"
                                    disabled={this.props.submitting}
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
    }
}
