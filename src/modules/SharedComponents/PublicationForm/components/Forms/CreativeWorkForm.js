import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form/immutable';

import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {PartialDateField} from 'modules/SharedComponents/Toolbox/PartialDate';

import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {validation} from 'config';
import {default as formLocale} from 'locale/publicationForm';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {SelectField} from 'modules/SharedComponents/Toolbox/SelectField';
import MenuItem from '@material-ui/core/MenuItem';
import {ListEditorField} from 'modules/SharedComponents/Toolbox/ListEditor';

export default class CreativeWorkForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool,
        isNtro: PropTypes.bool,
        formValues: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        const txt = formLocale.creativeWork;
        const isAuthorSelected = !!this.props.formValues && this.props.formValues.get('authors') && this.props.formValues.get('authors').some((object) => {return object.selected === true;}) || false;
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
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="rek_description"
                                    type="text"
                                    fullWidth
                                    rows={3}
                                    multiline
                                    required
                                    validate={[validation.required]}
                                    {...txt.information.fieldLabels.abstract}
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
                    this.props.isNtro && isAuthorSelected &&
                    <Grid item xs={12}>
                        <StandardCard title={'Author/Creator contribution statement'}>
                            <Grid container spacing={8}>
                                <Grid item xs={12}>
                                    <Field
                                        component={SelectField}
                                        disabled={this.props.submitting}
                                        name="impactSize"
                                        label={'Scale/Significance of work'}
                                        required>
                                        <MenuItem value={'minor'}>Minor</MenuItem>
                                        <MenuItem value={'major'}>Major</MenuItem>
                                    </Field>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        component={TextField}
                                        name="impactStatement"
                                        type="text"
                                        multiline
                                        rows={8}
                                        fullWidth
                                        disabled={this.props.submitting}
                                        label={'Creator contribution statement'}
                                        placeholder={'Type or cut and paste your impact statement here'}
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>
                }
                {
                    this.props.isNtro &&
                    <Grid item xs={12}>
                        <StandardCard title="Non-traditional research output metadata">
                            <Grid container spacing={16}>
                                <Grid item xs={12}>
                                    <Field
                                        component={ListEditorField}
                                        remindToAdd
                                        name="fez_record_search_key_ismn"
                                        isValid={validation.isValidIsmn}
                                        maxCount={5}
                                        searchKey={{value: 'rek_ismn', order: 'rek_ismn_order'}}
                                        locale={{form: {
                                            locale: {
                                                inputFieldLabel: 'ISMN value',
                                                inputFieldHint: 'eg. 979-0-XXX-XXXXX-X',
                                                addButtonLabel: <span>Add&nbsp;ISMN</span>,
                                                remindToAdd: (<span>Please, press <b>ENTER</b> or click <b>ADD</b> button to add this value to the list</span>)
                                            }
                                        }}}
                                        disabled={this.props.submitting}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        component={ListEditorField}
                                        remindToAdd
                                        name="fez_record_search_key_isrc"
                                        isValid={validation.isValidIsmc}
                                        maxCount={5}
                                        searchKey={{value: 'rek_isrc', order: 'rek_isrc_order'}}
                                        locale={{form: {
                                            locale: {
                                                inputFieldLabel: 'ISRC value',
                                                inputFieldHint: 'eg. BRBMG0300729',
                                                addButtonLabel: <span>Add&nbsp;ISRC</span>,
                                                remindToAdd: (<span>Please, press <b>ENTER</b> or click <b>ADD</b> button to add this value to the list</span>)
                                            }
                                        }}}
                                        disabled={this.props.submitting}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <Field
                                        component={TextField}
                                        name="rek_volume"
                                        type="text"
                                        fullWidth
                                        disabled={this.props.submitting}
                                        label={'Volume'}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <Field
                                        component={TextField}
                                        name="rek_issue"
                                        type="text"
                                        fullWidth
                                        disabled={this.props.submitting}
                                        label={'Issue'}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <Field
                                        component={TextField}
                                        name="rek_startpage"
                                        type="text"
                                        fullWidth
                                        disabled={this.props.submitting}
                                        label={'Start page'}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <Field
                                        component={TextField}
                                        name="rek_endpage"
                                        type="text"
                                        fullWidth
                                        disabled={this.props.submitting}
                                        label={'End page'}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Field
                                        component={TextField}
                                        name="rek_extent"
                                        type="text"
                                        fullWidth
                                        disabled={this.props.submitting}
                                        label={'Extent'}
                                        placeholder={'Enter total pages, size or duration of work'}
                                        required
                                        validate={[validation.required]}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Field
                                        component={TextField}
                                        name="rek_originalformat"
                                        type="text"
                                        fullWidth
                                        disabled={this.props.submitting}
                                        label={'Physical Description'}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Field
                                        component={TextField}
                                        name="rek_audiencesize"
                                        type="text"
                                        fullWidth
                                        disabled={this.props.submitting}
                                        label={'Audience size'}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Field
                                        component={SelectField}
                                        disabled={this.props.submitting}
                                        name="rek_peerreviewactivity"
                                        label={'Peer review activity'}
                                        required>
                                        <MenuItem value={1}>Option 1</MenuItem>
                                        <MenuItem value={2}>Option 2</MenuItem>
                                        <MenuItem value={3}>Option 3</MenuItem>
                                        <MenuItem value={4}>Option 4</MenuItem>
                                        <MenuItem value={5}>Option 5</MenuItem>
                                        <MenuItem value={6}>Option 6</MenuItem>
                                    </Field>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        component={TextField}
                                        disabled={this.props.submitting}
                                        name="rek_notes"
                                        type="text"
                                        fullWidth
                                        label={'Notes'}
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>
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
