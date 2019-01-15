import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {PartialDateField} from 'modules/SharedComponents/Toolbox/PartialDate';
import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {NtroFields} from 'modules/SharedComponents/Toolbox/NtroFields';

import {validation} from 'config';
import {default as formLocale} from 'locale/publicationForm';
import {
    RRW_NTRO_SUBTYPES,
    LP_NTRO_SUBTYPES,
    CPEE_NTRO_SUBTYPES,
    NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION,
    NTRO_SUBTYPE_CW_OTHER,
    NTRO_SUBTYPE_CW_TEXTUAL_WORK
} from 'config/general';

export default class CreativeWorkForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool,
        subtype: PropTypes.string,
        isNtro: PropTypes.bool,
        isAuthorSelected: PropTypes.bool,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const txt = formLocale.creativeWork;
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
                            <Grid item xs={12} sm={4}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_place_of_publication.rek_place_of_publication"
                                    type="text"
                                    fullWidth
                                    {...txt.information.fieldLabels.placeOfPublication}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_publisher.rek_publisher"
                                    type="text"
                                    fullWidth
                                    {...txt.information.fieldLabels.publisher}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="rek_doi"
                                    type="text"
                                    fullWidth
                                    label={'DOI'}
                                    placeholder={'Please enter a valid DOI.'}
                                    validate={[validation.doi]}
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
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={PartialDateField}
                                    disabled={this.props.submitting}
                                    name="rek_end_date"
                                    allowPartial
                                    floatingTitle={txt.information.fieldLabels.enddate.title}
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
                            component={ContributorsEditorField}
                            showContributorAssignment
                            required
                            name="authors"
                            locale={txt.authors.field}
                            disabled={this.props.submitting}
                            validate={[validation.authorRequired]}
                            isNtro={this.props.isNtro}
                            required
                        />
                    </StandardCard>
                </Grid>
                {
                    this.props.isNtro &&
                    <NtroFields
                        submitting={this.props.submitting}
                        showContributionStatement={this.props.isAuthorSelected}
                        hideIsmn={this.props.subtype !== NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION}
                        hideIsrc={!RRW_NTRO_SUBTYPES.includes(this.props.subtype)}
                        hideAudienceSize={![...LP_NTRO_SUBTYPES, ...CPEE_NTRO_SUBTYPES].includes(this.props.subtype)}
                        hideVolume={![NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION, NTRO_SUBTYPE_CW_OTHER, NTRO_SUBTYPE_CW_TEXTUAL_WORK].includes(this.props.subtype)}
                        hideIssue={![NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION, NTRO_SUBTYPE_CW_OTHER, NTRO_SUBTYPE_CW_TEXTUAL_WORK].includes(this.props.subtype)}
                        hideOriginalFormat={[CPEE_NTRO_SUBTYPES].includes(this.props.subtype)}
                    />
                }
                <Grid item xs={12}>
                    <StandardCard title={txt.optional.title} help={txt.optional.help}>
                        <Grid container spacing={16}>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="comments"
                                    type="text"
                                    fullWidth
                                    multiline
                                    {...txt.optional.fieldLabels.notes}
                                />
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
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    name="rek_link_description"
                                    type="text"
                                    disabled={this.props.submitting}
                                    fullWidth
                                    label={'Link description'}
                                />
                            </Grid>
                        </Grid>
                    </StandardCard>
                </Grid>
            </Grid>
        );
    }
}
