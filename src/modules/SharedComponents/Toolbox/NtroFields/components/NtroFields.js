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
import {AUDIENCE_SIZE, SIGNIFICANCE} from 'config/general';

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
        showContributionStatement: PropTypes.bool,
        showSignificance: PropTypes.bool,
        hideAbstract: PropTypes.bool,
        disableDeleteAllGrants: PropTypes.bool
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
        showSignificance: false,
        hideAbstract: false,
        disableDeleteAllGrants: false,
        locale: {
            contributionStatement: {
                title: 'Author/Creator research statement',
                fields: {
                    scaleOfWork: {
                        label: (<span>Scale/Significance of work* <span style={{fontWeight: 700}}>(not for public view)</span></span>),
                        description: 'Select the option that best describes the significance of the work.',
                    },
                    impactStatement: {
                        label: (<span>Creator research statement*. Include Background, Contribution and Significance <span style={{fontWeight: 700}}>(not for public view)</span></span>),
                        placeholder: 'Remember to include substantiation of your major or minor scale/significance claim above.'
                    },
                },
                help: {
                    title: 'Author/Creator research statement',
                    text: (
                        <React.Fragment>
                            <h3>Creator research statement</h3>
                            <p>For more information about the research statement, click  <b><a style={{fontWeight: 700}} target="_blank" href="https://guides.library.uq.edu.au/for-researchers/uqespace-publications-datasets/ntro-submission-requirements#s-lg-box-20836548">here</a></b></p>
                        </React.Fragment>
                    ),
                    buttonLabel: 'CLOSE'
                }
            },
            metadata: {
                title: 'NTRO data',
                fields: {
                    abstract: {
                        label: (<span>Abstract/Description* <span style={{fontWeight: 700}}>(for public view)</span></span>),
                        placeholder: 'Enter a brief description of the work',
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
                        label: 'Total pages/Extent',
                        placeholder: 'Enter total pages, size or duration of work'
                    },
                    physicalDescription: {
                        label: 'Physical description',
                        placeholder: 'Building, Exhibition, Performance, Composition'
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
                    (this.props.showContributionStatement || this.props.showSignificance) &&
                    <Grid item xs={12}>
                        <StandardCard title={contributionStatement.title} help={contributionStatement.help}>
                            <Grid container spacing={8}>
                                {
                                    // in theory, we should show them separately. In practice, they are always incomplete together
                                    (this.props.showContributionStatement || this.props.showSignificance) &&
                                    <Grid item xs={12}>
                                        <Typography>{contributionStatement.fields.scaleOfWork.description}</Typography>
                                        <Field
                                            component={SelectField}
                                            disabled={this.props.submitting}
                                            name="significance"
                                            label={contributionStatement.fields.scaleOfWork.label}
                                            required
                                            validate={[validation.required]}
                                            SelectDisplayProps={{
                                                id: 'significance'
                                            }}
                                        >
                                            {
                                                SIGNIFICANCE.map(item => (
                                                    <MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>
                                                ))
                                            }
                                        </Field>
                                    </Grid>
                                }
                                {
                                    this.props.showContributionStatement &&
                                    <Grid item xs={12} style={{marginTop: 24}}>
                                        <Field
                                            component={RichEditorField}
                                            name="impactStatement"
                                            fullWidth
                                            title={contributionStatement.fields.impactStatement.label}
                                            description={contributionStatement.fields.impactStatement.placeholder}
                                            maxValue={2000}
                                            required
                                            disabled={this.props.submitting}
                                            validate={[validation.required, validation.maxLengthWithWhitespace(2000)]}
                                        />
                                    </Grid>
                                }
                            </Grid>
                        </StandardCard>
                    </Grid>
                }
                {
                    (
                        !this.props.hideAbstract ||
                        !this.props.hidePeerReviewActivity ||
                        !this.props.hideLanguage ||
                        !this.props.hideAudienceSize ||
                        !this.props.hideOriginalFormat ||
                        !this.props.hideExtent ||
                        !this.props.hideEndPage ||
                        !this.props.hideStartPage ||
                        !this.props.hideIssue ||
                        !this.props.hideVolume ||
                        !this.props.hideSeries ||
                        !this.props.hideIsrc ||
                        !this.props.hideIsmn
                    ) &&
                    <Grid item xs={12}>
                        <StandardCard title={metadata.title} help={componentLocale.components.ntroFields.metadata.help}>
                            <Grid container spacing={16}>
                                <Grid item xs={12}>
                                    {
                                        !this.props.hideAbstract &&
                                        <Field
                                            component={RichEditorField}
                                            name="ntroAbstract"
                                            fullWidth
                                            title={metadata.fields.abstract.label}
                                            description={metadata.fields.abstract.placeholder}
                                            maxValue={800}
                                            disabled={this.props.submitting}
                                            validate={[validation.required, validation.maxLengthWithWhitespace(800)]}
                                        />
                                    }
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
                                            id="rek-total-pages"
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
                                    <Grid item xs={12} sm={this.row4Width}>
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
                                            SelectDisplayProps={{
                                                id: 'rek-audience-size'
                                            }}
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
                                            id="quality-indicators"
                                            name="qualityIndicators"
                                            label={metadata.fields.peerReviewActivity.label}
                                            placeholder={metadata.fields.peerReviewActivity.label}
                                            required
                                            multiple
                                            validate={[validation.requiredList]}
                                        />
                                    </Grid>
                                }
                            </Grid>
                        </StandardCard>
                    </Grid>
                }
                {
                    !this.props.hideGrants &&
                    <Grid item xs={12}>
                        <StandardCard title={grantEditor.title}>
                            <Field
                                component={GrantListEditorField}
                                name="grants"
                                disabled={this.props.submitting}
                                disableDeleteAllGrants={this.props.disableDeleteAllGrants}
                                validate={[validation.grantFormIsPopulated]}
                            />
                        </StandardCard>
                    </Grid>
                }
            </React.Fragment>
        );
    }
}
