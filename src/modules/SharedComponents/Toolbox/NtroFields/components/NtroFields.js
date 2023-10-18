import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { ListEditorField } from 'modules/SharedComponents/Toolbox/ListEditor';
import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
import { GrantListEditorField } from 'modules/SharedComponents/GrantListEditor';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { SeriesField } from 'modules/SharedComponents/LookupFields';

import { validation } from 'config';
import { default as componentLocale } from 'locale/components';
import { AUDIENCE_SIZE, SIGNIFICANCE, LANGUAGE, QUALITY_INDICATORS } from 'config/general';

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
        disableDeleteAllGrants: PropTypes.bool,
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
                        label: 'Scale/Significance of work',
                        description: (
                            <span>
                                Select the option that best describes the significance of the work*
                                <span style={{ fontWeight: 700 }}> (not for public view)</span>
                            </span>
                        ),
                    },
                    impactStatement: {
                        label: (
                            <span>
                                Creator research statement*. Include Background, Contribution and Significance
                                <span style={{ fontWeight: 700 }}> (not for public view)</span>
                            </span>
                        ),
                        placeholder:
                            'Remember to include substantiation of your major or minor scale/significance claim above.',
                    },
                },
                help: {
                    title: 'Author/Creator research statement',
                    text: (
                        <React.Fragment>
                            <Typography component="h4" variant="h6">
                                Creator research statement
                            </Typography>
                            <p>
                                For more information about the research statement, click{' '}
                                <a
                                    style={{ fontWeight: 700 }}
                                    target="_blank"
                                    href="https://guides.library.uq.edu.au/for-researchers/uqespace-publications-datasets/ntro-submission-requirements#s-lg-box-20836548"
                                >
                                    here
                                </a>
                            </p>
                        </React.Fragment>
                    ),
                    buttonLabel: 'CLOSE',
                },
            },
            metadata: {
                title: 'NTRO data',
                fields: {
                    abstract: {
                        label: (
                            <span>
                                Abstract/Description* <span style={{ fontWeight: 700 }}>(for public view)</span>
                            </span>
                        ),
                        placeholder: 'Enter a brief description of the work',
                    },
                    series: {
                        floatingLabelText: 'Series',
                        hintText: 'Enter the name of publication, performance, recording, or event series',
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
                        placeholder: 'Total pages, size, or duration',
                    },
                    physicalDescription: {
                        label: 'Physical description',
                        placeholder: 'e.g Building, Exhibit, Performance',
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
                        label: 'Language',
                        selectPrompt: 'Please select languages as required',
                    },
                },
            },
            grantEditor: {
                title: 'Grant details',
            },
        },
    };

    constructor(props) {
        super(props);
        this.row3Width = this.getWidth([props.hideVolume, props.hideIssue, props.hideStartPage, props.hideEndPage]);
        this.row4Width = this.getWidth([props.hideExtent, props.hideOriginalFormat]);
        this.row5Width = this.getWidth([props.hideAudienceSize, props.hidePeerReviewActivity, props.hideLanguage]);
    }

    componentDidUpdate() {
        this.row3Width = this.getWidth([
            this.props.hideVolume,
            this.props.hideIssue,
            this.props.hideStartPage,
            this.props.hideEndPage,
        ]);
        this.row4Width = this.getWidth([this.props.hideExtent, this.props.hideOriginalFormat]);
        this.row5Width = this.getWidth([
            this.props.hideAudienceSize,
            this.props.hidePeerReviewActivity,
            this.props.hideLanguage,
        ]);
    }

    getWidth = fields => {
        const numberOfFieldsToDisplay = fields.filter(field => field === false).length;
        return (numberOfFieldsToDisplay > 0 && 12 / numberOfFieldsToDisplay) || 12;
    };

    normalizeIsrc = value => {
        const normalizedValue = value.replace(/([A-Z]{2})?-?(\w{3})?-?(\d{2})?-?(\d{5})?/g, (m, ...groups) => {
            return groups
                .slice(0, 4)
                .filter(token => !!token)
                .join('-');
        });
        return normalizedValue.toUpperCase();
    };

    transformIsrc = (searchKey, item, index) => ({
        [searchKey.value]: item.replace('ISRC ', ''),
        [searchKey.order]: index + 1,
    });

    transformIsmn = (searchKey, item, index) => ({
        [searchKey.value]: item.replace('ISMN ', ''),
        [searchKey.order]: index + 1,
    });

    render() {
        const { contributionStatement, metadata, grantEditor } = this.props.locale;
        return (
            <React.Fragment>
                {(this.props.showContributionStatement || this.props.showSignificance) && (
                    <Grid item xs={12}>
                        <StandardCard title={contributionStatement.title} help={contributionStatement.help}>
                            <Grid container spacing={1}>
                                {// In theory, we should show them separately.
                                // In practice, they are always incomplete together
                                (this.props.showContributionStatement || this.props.showSignificance) && (
                                    <Grid item xs={12}>
                                        <Typography>{contributionStatement.fields.scaleOfWork.description}</Typography>
                                        <Field
                                            component={SelectField}
                                            disabled={this.props.submitting}
                                            name="significance"
                                            label={contributionStatement.fields.scaleOfWork.label}
                                            required
                                            validate={[validation.required]}
                                            selectFieldId="rek-significance"
                                        >
                                            {SIGNIFICANCE.map(item => (
                                                <MenuItem key={item.value} value={item.value}>
                                                    {item.text}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </Grid>
                                )}
                                {this.props.showContributionStatement && (
                                    <Grid item xs={12} style={{ marginTop: 24 }}>
                                        <Field
                                            component={RichEditorField}
                                            name="impactStatement"
                                            fullWidth
                                            title={contributionStatement.fields.impactStatement.label}
                                            description={contributionStatement.fields.impactStatement.placeholder}
                                            maxValue={2000}
                                            required
                                            disabled={this.props.submitting}
                                            validate={[validation.required, validation.maxListEditorTextLength2000]}
                                            richEditorId="rek-creator-contribution-statement"
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </StandardCard>
                    </Grid>
                )}
                {(!this.props.hideAbstract ||
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
                    !this.props.hideIsmn) && (
                    <Grid item xs={12}>
                        <StandardCard title={metadata.title} help={componentLocale.components.ntroFields.metadata.help}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    {!this.props.hideAbstract && (
                                        <Field
                                            component={RichEditorField}
                                            name="ntroAbstract"
                                            fullWidth
                                            title={metadata.fields.abstract.label}
                                            description={metadata.fields.abstract.placeholder}
                                            maxValue={800}
                                            disabled={this.props.submitting}
                                            validate={[validation.required, validation.maxListEditorTextLength800]}
                                            richEditorId="rek-description"
                                        />
                                    )}
                                </Grid>
                                {!this.props.hideIsmn && (
                                    <Grid item xs={12}>
                                        <Field
                                            component={ListEditorField}
                                            remindToAdd
                                            name="fez_record_search_key_ismn"
                                            isValid={validation.isValidIsmn}
                                            maxCount={5}
                                            locale={{ ...componentLocale.components.ismnForm.field }}
                                            listEditorId="ismn"
                                            searchKey={{ value: 'rek_ismn', order: 'rek_ismn_order' }}
                                            disabled={this.props.submitting}
                                            transformFunction={this.transformIsmn}
                                        />
                                    </Grid>
                                )}
                                {!this.props.hideIsrc && (
                                    <Grid item xs={12}>
                                        <Field
                                            component={ListEditorField}
                                            remindToAdd
                                            name="fez_record_search_key_isrc"
                                            isValid={validation.isValidIsrc}
                                            maxCount={5}
                                            searchKey={{ value: 'rek_isrc', order: 'rek_isrc_order' }}
                                            locale={{ ...componentLocale.components.isrcForm.field }}
                                            listEditorId="isrc"
                                            disabled={this.props.submitting}
                                            inputNormalizer={this.normalizeIsrc}
                                            transformFunction={this.transformIsrc}
                                        />
                                    </Grid>
                                )}
                                {!this.props.hideSeries && (
                                    <Grid item xs={12}>
                                        <Field
                                            component={SeriesField}
                                            disabled={this.props.submitting}
                                            name="fez_record_search_key_series.rek_series"
                                            {...metadata.fields.series}
                                        />
                                    </Grid>
                                )}
                                {!this.props.hideVolume && (
                                    <Grid item xs={12} sm={this.row3Width}>
                                        <Field
                                            component={TextField}
                                            name="fez_record_search_key_volume_number.rek_volume_number"
                                            textFieldId="rek-volume-number"
                                            type="text"
                                            fullWidth
                                            disabled={this.props.submitting}
                                            label={metadata.fields.volume.label}
                                        />
                                    </Grid>
                                )}
                                {!this.props.hideIssue && (
                                    <Grid item xs={12} sm={this.row3Width}>
                                        <Field
                                            component={TextField}
                                            name="fez_record_search_key_issue_number.rek_issue_number"
                                            textFieldId="rek-issue-number"
                                            type="text"
                                            fullWidth
                                            disabled={this.props.submitting}
                                            label={metadata.fields.issue.label}
                                        />
                                    </Grid>
                                )}
                                {!this.props.hideStartPage && (
                                    <Grid item xs={12} sm={this.row3Width}>
                                        <Field
                                            component={TextField}
                                            name="fez_record_search_key_start_page.rek_start_page"
                                            textFieldId="rek-start-page"
                                            type="text"
                                            fullWidth
                                            disabled={this.props.submitting}
                                            label={metadata.fields.startPage.label}
                                        />
                                    </Grid>
                                )}
                                {!this.props.hideEndPage && (
                                    <Grid item xs={12} sm={this.row3Width}>
                                        <Field
                                            component={TextField}
                                            name="fez_record_search_key_end_page.rek_end_page"
                                            textFieldId="rek-end-page"
                                            type="text"
                                            fullWidth
                                            disabled={this.props.submitting}
                                            label={metadata.fields.endPage.label}
                                        />
                                    </Grid>
                                )}
                                {!this.props.hideExtent && (
                                    <Grid item xs={12} sm={this.row4Width}>
                                        <Field
                                            component={TextField}
                                            id="rek-total-pages"
                                            name="fez_record_search_key_total_pages.rek_total_pages"
                                            textFieldId="rek-total-pages"
                                            type="text"
                                            fullWidth
                                            disabled={this.props.submitting}
                                            label={metadata.fields.extent.label}
                                            placeholder={metadata.fields.extent.placeholder}
                                            required
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                )}
                                {!this.props.hideOriginalFormat && (
                                    <Grid item xs={12} sm={this.row4Width}>
                                        <Field
                                            component={TextField}
                                            name="fez_record_search_key_original_format.rek_original_format"
                                            textFieldId="rek-original-format"
                                            type="text"
                                            fullWidth
                                            disabled={this.props.submitting}
                                            {...metadata.fields.physicalDescription}
                                        />
                                    </Grid>
                                )}
                                {!this.props.hideAudienceSize && (
                                    <Grid item xs={12} sm={this.row5Width}>
                                        <Field
                                            component={SelectField}
                                            name="fez_record_search_key_audience_size.rek_audience_size"
                                            disabled={this.props.submitting}
                                            label={metadata.fields.audienceSize.label}
                                            required
                                            validate={[validation.required]}
                                            selectFieldId="rek-audience-size"
                                        >
                                            {AUDIENCE_SIZE.map(item => (
                                                <MenuItem key={item.value} value={item.value}>
                                                    {item.text}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </Grid>
                                )}
                                {!this.props.hideLanguage && (
                                    <Grid item xs={12} sm={this.row5Width}>
                                        <Field
                                            component={NewGenericSelectField}
                                            genericSelectFieldId="rek-language"
                                            name="languages"
                                            disabled={this.props.submitting}
                                            {...metadata.fields.language}
                                            itemsList={LANGUAGE}
                                            multiple
                                            validate={[validation.requiredList]}
                                        />
                                    </Grid>
                                )}
                                {!this.props.hidePeerReviewActivity && (
                                    <Grid item xs={12} sm={this.row5Width}>
                                        <Field
                                            component={NewGenericSelectField}
                                            disabled={this.props.submitting}
                                            genericSelectFieldId="rek-quality-indicator"
                                            id="quality-indicators"
                                            name="qualityIndicators"
                                            label={metadata.fields.peerReviewActivity.label}
                                            placeholder={metadata.fields.peerReviewActivity.label}
                                            required
                                            multiple
                                            itemsList={QUALITY_INDICATORS}
                                            validate={[validation.requiredList]}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </StandardCard>
                    </Grid>
                )}
                {!this.props.hideGrants && (
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
                )}
            </React.Fragment>
        );
    }
}
