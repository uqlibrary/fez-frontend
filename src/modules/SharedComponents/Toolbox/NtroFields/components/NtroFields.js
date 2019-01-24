import React from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {ListEditorField} from 'modules/SharedComponents/Toolbox/ListEditor';
import {SelectField} from 'modules/SharedComponents/Toolbox/SelectField';
import {QualityIndicatorField} from 'modules/SharedComponents/Toolbox/QualityIndicatorField';
import {LanguageField} from 'modules/SharedComponents/Toolbox/LanguageField';
import {GrantListEditorField} from 'modules/SharedComponents/GrantListEditor';
import {RichEditorField} from 'modules/SharedComponents/RichEditor';
import {SeriesField} from 'modules/SharedComponents/LookupFields';

import {validation} from 'config';
import {default as componentLocale} from 'locale/components';
import {SIGNIFICANCE_MAJOR, SIGNIFICANCE_MINOR, AUDIENCE_SIZE} from 'config/general';

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
        hideSeries: PropTypes.bool,
        hideGrants: PropTypes.bool,
        hideLanguage: PropTypes.bool,
        showContributionStatement: PropTypes.bool
    };

    static defaultProps = {
        hideIsmn: false,
        hideIsrc: false,
        hideVolume: false,
        hideIssue: false,
        hideStartPage: true,
        hideEndPage: true,
        hideExtent: false,
        hideOriginalFormat: false,
        hideAudienceSize: false,
        hidePeerReviewActivity: false,
        hideSeries: false,
        hideGrants: false,
        hideLanguage: false,
        showContributionStatement: false,
        locale: {
            contributionStatement: {
                title: 'Author/Creator contribution statement (not for public view)',
                fields: {
                    scaleOfWork: {
                        label: 'Scale/Significance of work',
                        description: 'Select the option that desribes the significance of the work for you.',
                    },
                    impactStatement: {
                        label: 'Creator contribution statement',
                        placeholder: 'Enter a personal statement (2000 characters or less) that describes the background, contribution and significance of the work for you.',
                        description: 'Remember to enter your statement in three sections: Background, Contribution, Significance'
                    },
                }
            },
            metadata: {
                title: 'Non-traditional research output metadata',
                fields: {
                    abstract: {
                        label: 'Abstract/Description (for public view)',
                        description: 'Enter a statement (800 characters or less, approximately 100 words) that summarises the work',
                    },
                    series: {
                        floatingLabelText: 'Series',
                        hintText: 'Enter the name of publication, performance, recording, or event series'
                    },
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
                        placeholder: 'Type of work, e.g. Video, Map, Oil painting'
                    },
                    audienceSize: {
                        label: 'Audience size',
                    },
                    peerReviewActivity: {
                        label: 'Quality indicators',
                    },
                    notes: {
                        label: 'Notes',
                    },
                    language: {
                        label: 'Language'
                    }
                }
            },
            grantEditor: {
                title: 'Grant details'
            }
        }
    };

    constructor(props) {
        super(props);
        this.row3Width = this.getWidth([props.hideVolume, props.hideIssue, props.hideStartPage, props.hideEndPage]);
        this.row4Width = this.getWidth([props.hideExtent, props.hideOriginalFormat]);
        this.row5Width = this.getWidth([props.hideAudienceSize, props.hidePeerReviewActivity, props.hideLanguage]);
    }

    componentWillReceiveProps(nextProps) {
        this.row3Width = this.getWidth([nextProps.hideVolume, nextProps.hideIssue, nextProps.hideStartPage, nextProps.hideEndPage]);
        this.row4Width = this.getWidth([nextProps.hideExtent, nextProps.hideOriginalFormat]);
        this.row5Width = this.getWidth([nextProps.hideAudienceSize, nextProps.hidePeerReviewActivity, nextProps.hideLanguage]);
    }

    getWidth = (fields) => {
        const numberOfFieldsToDisplay = fields.filter(field => field === false).length;
        return numberOfFieldsToDisplay > 0 && (12 / numberOfFieldsToDisplay) || 12;
    };

    normalizeIsrc = value => {
        const normalizedValue = value.replace(/([A-Z]{2})?-?(\w{3})?-?(\d{2})?-?(\d{5})?/g, (m, ...groups) => {
            return groups.slice(0, 4).filter(token => !!token).join('-');
        });
        return normalizedValue.toUpperCase();
    };

    transformIsrc = (searchKey, item, index) => ({
        [searchKey.value]: item.replace('ISRC ', ''),
        [searchKey.order]: index + 1
    });

    transformIsmn = (searchKey, item, index) => ({
        [searchKey.value]: item.replace('ISMN ', ''),
        [searchKey.order]: index + 1
    });

    render() {
        const {contributionStatement, metadata, grantEditor} = this.props.locale;
        return (
            <React.Fragment>
                {
                    this.props.showContributionStatement &&
                    <Grid item xs={12}>
                        <StandardCard title={contributionStatement.title}>
                            <Grid container spacing={8}>
                                <Grid item xs={12}>
                                    <Typography>{contributionStatement.fields.scaleOfWork.description}</Typography>
                                    <Field
                                        component={SelectField}
                                        disabled={this.props.submitting}
                                        name="significance"
                                        label={contributionStatement.fields.scaleOfWork.label}
                                        required
                                        validate={[validation.required]}
                                    >
                                        <MenuItem value={SIGNIFICANCE_MINOR}>Minor</MenuItem>
                                        <MenuItem value={SIGNIFICANCE_MAJOR}>Major</MenuItem>
                                    </Field>
                                </Grid>
                                <Grid item xs={12} style={{marginTop: 24}}>
                                    <Typography>{contributionStatement.fields.impactStatement.label}</Typography>
                                    <Typography variant={'caption'}>{contributionStatement.fields.impactStatement.placeholder}</Typography>
                                    <Field
                                        component={RichEditorField}
                                        name="impactStatement"
                                        fullWidth
                                        maxValue={2000}
                                        instructions={contributionStatement.fields.impactStatement.description}
                                        disabled={this.props.submitting}
                                        validate={[validation.required, validation.maxLengthWithWhitespace(2000)]}
                                        returnSingleValue
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>
                }
                <Grid item xs={12}>
                    <StandardCard title={metadata.title}>
                        <Grid container spacing={16}>
                            <Grid item xs={12}>
                                <Typography children={metadata.fields.abstract.label}/>
                                <Typography variant="caption" children={metadata.fields.abstract.description}/>
                                <Field
                                    component={RichEditorField}
                                    name="ntroAbstract"
                                    fullWidth
                                    disabled={this.props.submitting}
                                    validate={[validation.required, validation.maxListEditorTextLength800]}/>
                            </Grid>
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
                                        transformFunction={this.transformIsmn}
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
                                        inputNormalizer={this.normalizeIsrc}
                                        transformFunction={this.transformIsrc}
                                    />
                                </Grid>
                            }
                            {
                                !this.props.hideSeries &&
                                <Grid item xs={12}>
                                    <Field
                                        component={SeriesField}
                                        disabled={this.props.submitting}
                                        name="fez_record_search_key_series.rek_series"
                                        {...metadata.fields.series}
                                    />

                                </Grid>
                            }
                            {
                                !this.props.hideVolume &&
                                <Grid item xs={12} sm={this.row3Width}>
                                    <Field
                                        component={TextField}
                                        name="fez_record_search_key_volume_number.rek_volume_number"
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
                                        name="fez_record_search_key_issue_number.rek_issue_number"
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
                                        name="fez_record_search_key_start_page.rek_start_page"
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
                                        name="fez_record_search_key_end_page.rek_end_page"
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
                                        name="fez_record_search_key_total_pages.rek_total_pages"
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
                                <Grid item xs={12} sm={this.row5Width}>
                                    <Field
                                        component={TextField}
                                        name="fez_record_search_key_original_format.rek_original_format"
                                        type="text"
                                        fullWidth
                                        disabled={this.props.submitting}
                                        {...metadata.fields.physicalDescription}
                                    />
                                </Grid>
                            }
                            {
                                !this.props.hideAudienceSize &&
                                <Grid item xs={12} sm={this.row5Width}>
                                    <Field
                                        component={SelectField}
                                        name="fez_record_search_key_audience_size.rek_audience_size"
                                        disabled={this.props.submitting}
                                        label={metadata.fields.audienceSize.label}
                                        required
                                        validate={[validation.required]}
                                    >
                                        {
                                            AUDIENCE_SIZE.map(item => (
                                                <MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>
                                            ))
                                        }
                                    </Field>
                                </Grid>
                            }
                            {
                                !this.props.hideLanguage &&
                                <Grid item xs={12} sm={this.row5Width}>
                                    <Field
                                        component={LanguageField}
                                        name="languages"
                                        disabled={this.props.submitting}
                                        label={metadata.fields.language.label}
                                        required
                                        multiple
                                        validate={[validation.requiredList]}
                                    />
                                </Grid>
                            }
                            {
                                !this.props.hidePeerReviewActivity &&
                                <Grid item xs={12} sm={this.row5Width}>
                                    <Field
                                        component={QualityIndicatorField}
                                        disabled={this.props.submitting}
                                        name="qualityIndicators"
                                        label={metadata.fields.peerReviewActivity.label}
                                        required
                                        multiple
                                        validate={[validation.requiredList]}
                                    />
                                </Grid>
                            }
                        </Grid>
                    </StandardCard>
                </Grid>
                {
                    !this.props.hideGrants &&
                    <Grid item xs={12}>
                        <StandardCard title={grantEditor.title}>
                            <Field
                                component={GrantListEditorField}
                                name="grants"
                                disabled={this.props.submitting}
                            />
                        </StandardCard>
                    </Grid>
                }
            </React.Fragment>
        );
    }
}
