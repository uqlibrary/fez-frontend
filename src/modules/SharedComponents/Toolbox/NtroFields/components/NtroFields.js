import React from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {ListEditorField} from 'modules/SharedComponents/Toolbox/ListEditor';
import {SelectField} from 'modules/SharedComponents/Toolbox/SelectField';

import {validation} from 'config';
import {default as componentLocale} from 'locale/components';

export default class NtroFields extends React.PureComponent {
    static propTypes = {
        submitting: PropTypes.bool,
        locale: PropTypes.object,
        hideIsmn: PropTypes.bool,
        hideIsrc: PropTypes.bool,
        hideVolume: PropTypes.bool,
        hideIssue: PropTypes.bool,
        hideStartPage: PropTypes.bool,
        hideEndPage: PropTypes.bool,
        hideExtent: PropTypes.bool,
        hideOriginalFormat: PropTypes.bool,
        hideAudienceSize: PropTypes.bool,
        hidePeerReviewActivity: PropTypes.bool,
        hideNotes: PropTypes.bool,
        hideSeries: PropTypes.bool,
        showContributionStatement: PropTypes.bool
    };

    static defaultProps = {
        hideIsmn: false,
        hideIsrc: false,
        hideVolume: false,
        hideIssue: false,
        hideStartPage: false,
        hideEndPage: false,
        hideExtent: false,
        hideOriginalFormat: false,
        hideAudienceSize: false,
        hidePeerReviewActivity: false,
        hideNotes: false,
        hideSeries: false,
        showContributionStatement: false,
        locale: {
            contributionStatement: {
                title: 'Author/Creator contribution statement',
                fields: {
                    scaleOfWork: {
                        label: 'Scale/Significance of work'
                    },
                    impactStatement: {
                        label: 'Creator contribution statement',
                        placeholder: 'Type or cut and paste your impact statement here'
                    },
                }
            },
            metadata: {
                title: 'Non-traditional research output metadata',
                fields: {
                    volume: {
                        label: 'Volume',
                    },
                    issue: {
                        label: 'Issue',
                    },
                    startPage: {
                        label: 'Start page',
                    },
                    endPage: {
                        label: 'End page',
                    },
                    extent: {
                        label: 'Extent',
                        placeholder: 'Enter total pages, size or duration of work'
                    },
                    physicalDescription: {
                        label: 'Physical description',
                    },
                    audienceSize: {
                        label: 'Audience size',
                    },
                    peerReviewActivity: {
                        label: 'Peer review activity',
                    },
                    notes: {
                        label: 'Notes',
                    },
                }
            }
        }
    };

    constructor(props) {
        super(props);
        this.row3Width = this.getWidth([props.hideVolume, props.hideIssue, props.hideStartPage, props.hideEndPage]);
        this.row4Width = this.getWidth([props.hideExtent, props.hideOriginalFormat, props.hideAudienceSize, props.hidePeerReviewActivity]);
    }

    getWidth = (fields) => {
        const numberOfFieldsToDisplay = fields.filter(field => field === false).length;
        return numberOfFieldsToDisplay > 0 && (12 / numberOfFieldsToDisplay) || 12;
    };

    render() {
        const {contributionStatement, metadata} = this.props.locale;

        return (
            <React.Fragment>
                {
                    this.props.showContributionStatement &&
                    <Grid item xs={12}>
                        <StandardCard title={contributionStatement.title}>
                            <Grid container spacing={8}>
                                <Grid item xs={12}>
                                    <Field
                                        component={SelectField}
                                        disabled={this.props.submitting}
                                        name="impactSize"
                                        label={contributionStatement.fields.scaleOfWork.label}
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
                                        label={contributionStatement.fields.impactStatement.label}
                                        placeholder={contributionStatement.fields.impactStatement.placeholder}
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>
                }
                <Grid item xs={12}>
                    <StandardCard title={metadata.title}>
                        <Grid container spacing={16}>
                            {
                                !this.props.hideIsmn &&
                                <Grid item xs={12}>
                                    <Field
                                        component={ListEditorField}
                                        remindToAdd
                                        name="fez_record_search_key_ismn"
                                        isValid={validation.isValidIsmn}
                                        maxCount={5}
                                        locale={{...componentLocale.components.ismnForm.field}}
                                        searchKey={{value: 'rek_ismn', order: 'rek_ismn_order'}}
                                        disabled={this.props.submitting}
                                    />
                                </Grid>
                            }
                            {
                                !this.props.hideIsrc &&
                                <Grid item xs={12}>
                                    <Field
                                        component={ListEditorField}
                                        remindToAdd
                                        name="fez_record_search_key_isrc"
                                        isValid={validation.isValidIsrc}
                                        maxCount={5}
                                        searchKey={{value: 'rek_isrc', order: 'rek_isrc_order'}}
                                        locale={{...componentLocale.components.isrcForm.field}}
                                        disabled={this.props.submitting}
                                    />
                                </Grid>
                            }
                            {
                                !this.props.hideVolume &&
                                <Grid item xs={12} sm={this.row3Width}>
                                    <Field
                                        component={TextField}
                                        name="rek_volume"
                                        type="text"
                                        fullWidth
                                        disabled={this.props.submitting}
                                        label={metadata.fields.volume.label}
                                    />
                                </Grid>
                            }
                            {
                                !this.props.hideIssue &&
                                <Grid item xs={12} sm={this.row3Width}>
                                    <Field
                                        component={TextField}
                                        name="rek_issue"
                                        type="text"
                                        fullWidth
                                        disabled={this.props.submitting}
                                        label={metadata.fields.issue.label}
                                    />
                                </Grid>
                            }
                            {
                                !this.props.hideStartPage &&
                                <Grid item xs={12} sm={this.row3Width}>
                                    <Field
                                        component={TextField}
                                        name="rek_startpage"
                                        type="text"
                                        fullWidth
                                        disabled={this.props.submitting}
                                        label={metadata.fields.startPage.label}
                                    />
                                </Grid>
                            }
                            {
                                !this.props.hideEndPage &&
                                <Grid item xs={12} sm={this.row3Width}>
                                    <Field
                                        component={TextField}
                                        name="rek_endpage"
                                        type="text"
                                        fullWidth
                                        disabled={this.props.submitting}
                                        label={metadata.fields.endPage.label}
                                    />
                                </Grid>
                            }
                            {
                                !this.props.hideExtent &&
                                <Grid item xs={12} sm={this.row4Width}>
                                    <Field
                                        component={TextField}
                                        name="rek_extent"
                                        type="text"
                                        fullWidth
                                        disabled={this.props.submitting}
                                        label={metadata.fields.extent.label}
                                        placeholder={metadata.fields.extent.placeholder}
                                        required
                                        validate={[validation.required]}
                                    />
                                </Grid>
                            }
                            {
                                !this.props.hideOriginalFormat &&
                                <Grid item xs={12} sm={this.row4Width}>
                                    <Field
                                        component={TextField}
                                        name="rek_originalformat"
                                        type="text"
                                        fullWidth
                                        disabled={this.props.submitting}
                                        label={metadata.fields.physicalDescription.label}
                                    />
                                </Grid>
                            }
                            {
                                !this.props.hideAudienceSize &&
                                <Grid item xs={12} sm={this.row4Width}>
                                    <Field
                                        component={TextField}
                                        name="rek_audiencesize"
                                        type="text"
                                        fullWidth
                                        disabled={this.props.submitting}
                                        label={metadata.fields.audienceSize.label}
                                    />
                                </Grid>
                            }
                            {
                                !this.props.hidePeerReviewActivity &&
                                <Grid item xs={12} sm={this.row4Width}>
                                    <Field
                                        component={SelectField}
                                        disabled={this.props.submitting}
                                        name="rek_peerreviewactivity"
                                        label={metadata.fields.peerReviewActivity.label}
                                        required>
                                        <MenuItem value={1}>Option 1</MenuItem>
                                        <MenuItem value={2}>Option 2</MenuItem>
                                        <MenuItem value={3}>Option 3</MenuItem>
                                        <MenuItem value={4}>Option 4</MenuItem>
                                        <MenuItem value={5}>Option 5</MenuItem>
                                        <MenuItem value={6}>Option 6</MenuItem>
                                    </Field>
                                </Grid>
                            }
                            {
                                !this.props.hideNotes &&
                                <Grid item xs={12}>
                                    <Field
                                        component={TextField}
                                        disabled={this.props.submitting}
                                        name="rek_notes"
                                        type="text"
                                        fullWidth
                                        label={metadata.fields.notes.label}
                                    />
                                </Grid>
                            }
                        </Grid>
                    </StandardCard>
                </Grid>
            </React.Fragment>
        );
    }
}
