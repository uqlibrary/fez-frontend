import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'redux-form/immutable';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';

import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { validation } from 'config';
import { default as formLocale } from 'locale/publicationForm';
import Grid from '@mui/material/Grid';

export const AudioDocumentForm = ({ submitting, formValues }) => {
    // path to the locale data for each of the sections
    const txt = formLocale.audioDocument;
    const editors = formValues && formValues.get('editors');
    const editorSelected = !!editors && editors.filter(editor => editor.selected).length > 0;
    const authors = formValues && formValues.get('authors');
    const authorSelected = !!authors && authors.filter(author => author.selected).length > 0;
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <StandardCard title={txt.information.title} help={txt.information.help}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                disabled={submitting}
                                autoFocus
                                name="rek_title"
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                {...txt.information.fieldLabels.documentTitle}
                                required
                                validate={[validation.required]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                disabled={submitting}
                                name="fez_record_search_key_place_of_publication.rek_place_of_publication"
                                type="text"
                                fullWidth
                                {...txt.information.fieldLabels.publicationPlace}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                disabled={submitting}
                                name="fez_record_search_key_publisher.rek_publisher"
                                type="text"
                                fullWidth
                                {...txt.information.fieldLabels.publisher}
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
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                disabled={submitting}
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
                <StandardCard title={txt.creator.title} help={txt.creator.help}>
                    <Field
                        component={ContributorsEditorField}
                        canEdit
                        maintainSelected
                        forceSelectable
                        hideUqIDFields
                        contributorEditorId="creators"
                        showContributorAssignment={!editorSelected}
                        required
                        name="authors"
                        locale={txt.creator.field}
                        disabled={submitting}
                    />
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.contributor.title} help={txt.contributor.help}>
                    <Field
                        component={ContributorsEditorField}
                        canEdit
                        maintainSelected
                        forceSelectable
                        hideUqIDFields
                        contributorEditorId="contributors"
                        showContributorAssignment={!authorSelected}
                        name="editors"
                        locale={txt.contributor.field}
                        disabled={submitting}
                    />
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.optional.title} help={txt.optional.help}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                disabled={submitting}
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
                                component={TextField}
                                name="rek_link"
                                type="text"
                                disabled={submitting}
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

AudioDocumentForm.propTypes = {
    submitting: PropTypes.bool,
    formValues: PropTypes.object,
};

export default AudioDocumentForm;
