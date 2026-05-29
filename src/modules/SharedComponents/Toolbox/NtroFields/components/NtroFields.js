import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
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
import { Field } from '../../ReactHookForm';
import defaultLocale from './locale';

export const normalizeIsrc = value => {
    const normalizedValue = value.replace(/([A-Z]{2})?-?(\w{3})?-?(\d{2})?-?(\d{5})?/g, (m, ...groups) => {
        return groups
            .slice(0, 4)
            .filter(token => !!token)
            .join('-');
    });
    return normalizedValue.toUpperCase();
};

export const transformIsrc = (searchKey, item, index) => ({
    [searchKey.value]: item.replace('ISRC ', ''),
    [searchKey.order]: index + 1,
});

export const transformIsmn = (searchKey, item, index) => ({
    [searchKey.value]: item.replace('ISMN ', ''),
    [searchKey.order]: index + 1,
});

const getWidth = fields => {
    const numberOfFieldsToDisplay = fields.filter(field => field === false).length;
    return (numberOfFieldsToDisplay > 0 && 12 / numberOfFieldsToDisplay) || 12;
};

const NtroFields = ({
    control = /* istanbul ignore next */ {},
    canEdit = false,
    isSubmitting,
    locale = defaultLocale,
    hideIsmn = false,
    hideIsrc = false,
    hideVolume = /* istanbul ignore next */ false,
    hideIssue = false,
    hideStartPage = true,
    hideEndPage = true,
    hideExtent = false,
    hideOriginalFormat = false,
    hideAudienceSize = /* istanbul ignore next */ false,
    hidePeerReviewActivity = false,
    hideSeries = false,
    hideGrants = false,
    hideLanguage = false,
    showContributionStatement = false,
    showSignificance = false,
    hideAbstract = false,
    disableDeleteAllGrants = false,
}) => {
    const row3Width = useMemo(
        () => getWidth([hideVolume, hideIssue, hideStartPage, hideEndPage]),
        [hideVolume, hideIssue, hideStartPage, hideEndPage],
    );

    const row4Width = useMemo(() => getWidth([hideExtent, hideOriginalFormat]), [hideExtent, hideOriginalFormat]);

    const row5Width = useMemo(
        () => getWidth([hideAudienceSize, hidePeerReviewActivity, hideLanguage]),
        [hideAudienceSize, hidePeerReviewActivity, hideLanguage],
    );

    const { contributionStatement, metadata, grantEditor } = locale;

    return (
        <Grid size={12} sx={{ ml: 3 }}>
            {(showContributionStatement || showSignificance) && (
                <Grid size={12} sx={{ mt: 3 }}>
                    <StandardCard title={contributionStatement.title} help={contributionStatement.help}>
                        <Grid container spacing={1}>
                            {(showContributionStatement || showSignificance) && (
                                <Grid size={12}>
                                    <Typography>{contributionStatement.fields.scaleOfWork.description}</Typography>
                                    <Field
                                        control={control}
                                        component={SelectField}
                                        disabled={isSubmitting}
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
                            {showContributionStatement && (
                                <Grid style={{ marginTop: 24 }} size={12}>
                                    <Field
                                        control={control}
                                        component={RichEditorField}
                                        name="impactStatement"
                                        fullWidth
                                        title={contributionStatement.fields.impactStatement.label}
                                        description={contributionStatement.fields.impactStatement.placeholder}
                                        maxValue={2000}
                                        required
                                        disabled={isSubmitting}
                                        validate={[validation.required, validation.maxListEditorTextLength2000]}
                                        richEditorId="rek-creator-contribution-statement"
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </StandardCard>
                </Grid>
            )}
            {(!hideAbstract ||
                !hidePeerReviewActivity ||
                !hideLanguage ||
                !hideAudienceSize ||
                !hideOriginalFormat ||
                !hideExtent ||
                !hideEndPage ||
                !hideStartPage ||
                !hideIssue ||
                !hideVolume ||
                !hideSeries ||
                !hideIsrc ||
                !hideIsmn) && (
                <Grid size={12} sx={{ mt: 3 }}>
                    <StandardCard title={metadata.title} help={componentLocale.components.ntroFields.metadata.help}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                {!hideAbstract && (
                                    <Field
                                        control={control}
                                        component={RichEditorField}
                                        name="ntroAbstract"
                                        fullWidth
                                        title={metadata.fields.abstract.label}
                                        description={metadata.fields.abstract.placeholder}
                                        disabled={isSubmitting}
                                        validate={[validation.required, validation.maxListEditorTextLength65k]}
                                        richEditorId="rek-description"
                                    />
                                )}
                            </Grid>
                            {!hideIsmn && (
                                <Grid size={12}>
                                    <Field
                                        control={control}
                                        component={ListEditorField}
                                        remindToAdd
                                        name="fez_record_search_key_ismn"
                                        isValid={validation.isValidIsmn}
                                        maxCount={5}
                                        locale={{ ...componentLocale.components.ismnForm.field }}
                                        listEditorId="ismn"
                                        searchKey={{ value: 'rek_ismn', order: 'rek_ismn_order' }}
                                        disabled={isSubmitting}
                                        transformFunction={transformIsmn}
                                    />
                                </Grid>
                            )}
                            {!hideIsrc && (
                                <Grid size={12}>
                                    <Field
                                        control={control}
                                        component={ListEditorField}
                                        remindToAdd
                                        name="fez_record_search_key_isrc"
                                        isValid={validation.isValidIsrc}
                                        maxCount={5}
                                        searchKey={{ value: 'rek_isrc', order: 'rek_isrc_order' }}
                                        locale={{ ...componentLocale.components.isrcForm.field }}
                                        listEditorId="isrc"
                                        disabled={isSubmitting}
                                        inputNormalizer={normalizeIsrc}
                                        transformFunction={transformIsrc}
                                    />
                                </Grid>
                            )}
                            {!hideSeries && (
                                <Grid size={12}>
                                    <Field
                                        control={control}
                                        component={SeriesField}
                                        disabled={isSubmitting}
                                        name="fez_record_search_key_series.rek_series"
                                        {...metadata.fields.series}
                                    />
                                </Grid>
                            )}
                            {!hideVolume && (
                                <Grid size={{ xs: 12, sm: row3Width }}>
                                    <Field
                                        control={control}
                                        component={TextField}
                                        name="fez_record_search_key_volume_number.rek_volume_number"
                                        textFieldId="rek-volume-number"
                                        type="text"
                                        fullWidth
                                        disabled={isSubmitting}
                                        label={metadata.fields.volume.label}
                                    />
                                </Grid>
                            )}
                            {!hideIssue && (
                                <Grid size={{ xs: 12, sm: row3Width }}>
                                    <Field
                                        control={control}
                                        component={TextField}
                                        name="fez_record_search_key_issue_number.rek_issue_number"
                                        textFieldId="rek-issue-number"
                                        type="text"
                                        fullWidth
                                        disabled={isSubmitting}
                                        label={metadata.fields.issue.label}
                                    />
                                </Grid>
                            )}
                            {!hideStartPage && (
                                <Grid size={{ xs: 12, sm: row3Width }}>
                                    <Field
                                        control={control}
                                        component={TextField}
                                        name="fez_record_search_key_start_page.rek_start_page"
                                        textFieldId="rek-start-page"
                                        type="text"
                                        fullWidth
                                        disabled={isSubmitting}
                                        label={metadata.fields.startPage.label}
                                    />
                                </Grid>
                            )}
                            {!hideEndPage && (
                                <Grid size={{ xs: 12, sm: row3Width }}>
                                    <Field
                                        control={control}
                                        component={TextField}
                                        name="fez_record_search_key_end_page.rek_end_page"
                                        textFieldId="rek-end-page"
                                        type="text"
                                        fullWidth
                                        disabled={isSubmitting}
                                        label={metadata.fields.endPage.label}
                                    />
                                </Grid>
                            )}
                            {!hideExtent && (
                                <Grid size={{ xs: 12, sm: row4Width }}>
                                    <Field
                                        control={control}
                                        component={TextField}
                                        id="rek-total-pages"
                                        name="fez_record_search_key_total_pages.rek_total_pages"
                                        textFieldId="rek-total-pages"
                                        type="text"
                                        fullWidth
                                        disabled={isSubmitting}
                                        label={metadata.fields.extent.label}
                                        placeholder={metadata.fields.extent.placeholder}
                                        required
                                        validate={[validation.required]}
                                    />
                                </Grid>
                            )}
                            {!hideOriginalFormat && (
                                <Grid size={{ xs: 12, sm: row4Width }}>
                                    <Field
                                        control={control}
                                        component={TextField}
                                        name="fez_record_search_key_original_format.rek_original_format"
                                        textFieldId="rek-original-format"
                                        type="text"
                                        fullWidth
                                        disabled={isSubmitting}
                                        {...metadata.fields.physicalDescription}
                                    />
                                </Grid>
                            )}
                            {!hideAudienceSize && (
                                <Grid size={{ xs: 12, sm: row5Width }}>
                                    <Field
                                        control={control}
                                        component={SelectField}
                                        name="fez_record_search_key_audience_size.rek_audience_size"
                                        disabled={isSubmitting}
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
                            {!hideLanguage && (
                                <Grid size={{ xs: 12, sm: row5Width }}>
                                    <Field
                                        control={control}
                                        component={NewGenericSelectField}
                                        genericSelectFieldId="rek-language"
                                        name="languages"
                                        disabled={isSubmitting}
                                        {...metadata.fields.language}
                                        itemsList={LANGUAGE}
                                        multiple
                                        validate={[validation.requiredList]}
                                    />
                                </Grid>
                            )}
                            {!hidePeerReviewActivity && (
                                <Grid size={{ xs: 12, sm: row5Width }}>
                                    <Field
                                        control={control}
                                        component={NewGenericSelectField}
                                        disabled={isSubmitting}
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
            {!hideGrants && (
                <Grid size={12} sx={{ mt: 3 }}>
                    <StandardCard title={grantEditor.title}>
                        <Field
                            control={control}
                            component={GrantListEditorField}
                            canEdit={canEdit}
                            name="grants"
                            disabled={isSubmitting}
                            disableDeleteAllGrants={disableDeleteAllGrants}
                        />
                    </StandardCard>
                </Grid>
            )}
        </Grid>
    );
};

NtroFields.propTypes = {
    control: PropTypes.object,
    canEdit: PropTypes.bool,
    isSubmitting: PropTypes.bool,
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

export default NtroFields;
