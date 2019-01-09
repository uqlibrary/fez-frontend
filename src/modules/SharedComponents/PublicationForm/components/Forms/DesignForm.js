import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form/immutable';

import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {PartialDateField} from 'modules/SharedComponents/Toolbox/PartialDate';

import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {NtroFields} from 'modules/SharedComponents/Toolbox/NtroFields';

import {validation} from 'config';
import {default as formLocale} from 'locale/publicationForm';

import Grid from '@material-ui/core/Grid';

export default class DesignForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool,
        subtype: PropTypes.string,
        isNtro: PropTypes.bool,
        isAuthorSelected: PropTypes.bool
    };

    constructor(props) {
        super(props);
    }

    render() {
        // path to the locale data for each of the sections
        const txt = formLocale.design;

        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <StandardCard title={txt.information.title} help={txt.information.help}>
                        <Grid container spacing={16}>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    autoFocus
                                    name="rek_title"
                                    type="text"
                                    fullWidth
                                    {...txt.information.fieldLabels.articleTitle}
                                    required
                                    validate={[validation.required]}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_project_name.rek_project_name"
                                    type="text"
                                    fullWidth
                                    {...txt.information.fieldLabels.projectName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="rek_description"
                                    type="text"
                                    fullWidth
                                    rows={1}
                                    multiline
                                    {...txt.information.fieldLabels.projectDescription}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_publisher.rek_publisher"
                                    type="text"
                                    fullWidth
                                    {...txt.information.fieldLabels.publisher}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_place_of_publication.rek_place_of_publication"
                                    type="text"
                                    fullWidth
                                    {...txt.information.fieldLabels.placeOfPublication}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_location[0].rek_location"
                                    type="text"
                                    fullWidth
                                    {...txt.information.fieldLabels.location}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={PartialDateField}
                                    disabled={this.props.submitting}
                                    name="rek_date"
                                    allowPartial required
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
                            showContributorAssignment
                            className="requiredField"
                            name="authors"
                            locale={txt.authors.field}
                            disabled={this.props.submitting}
                            validate={[validation.authorRequired]}
                            isNtro={this.props.isNtro}
                        />
                    </StandardCard>
                </Grid>
                {
                    this.props.isNtro &&
                    <NtroFields
                        submitting={this.props.submitting}
                        showContributionStatement={this.props.isAuthorSelected}
                        hideIsmn
                        hideIsrc
                        hideVolume
                        hideIssue
                        hideStartPage
                        hideEndPage
                        hideAudienceSize
                    />
                }
                <Grid item xs={12}>
                    <StandardCard title={txt.optional.title} help={txt.optional.help}>
                        <Grid container spacing={16}>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    name="comments"
                                    type="text"
                                    disabled={this.props.submitting}
                                    fullWidth
                                    multiline
                                    rows={1}
                                    {...txt.optional.fieldLabels.notes}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    name="rek_link"
                                    type="text"
                                    disabled={this.props.submitting}
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
    }
}
