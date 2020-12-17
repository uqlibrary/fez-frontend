import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import JournalView from '../components/JournalView';

import { default as globalLocale } from 'locale/global';
import { CREATIVE_COMMONS_LICENCES, getCreativeCommonsUrl } from 'config/general';
import pagesLocale from 'locale/pages';

import * as actions from 'actions';

const txt = pagesLocale.pages.journal.view;

const nodeJoin = (arr, glue) => arr.slice(1).reduce((op, item) => op.concat([glue, item]), [arr[0]]);
const getLicence = ({ by, nd, nc, sa }) => {
    const conditions = [];
    by && conditions.push('by');
    nd && conditions.push('nd');
    nc && conditions.push('nc');
    sa && conditions.push('sa');
    const licence = conditions.join('-');
    return [`cc-${licence}`, getCreativeCommonsUrl(licence), CREATIVE_COMMONS_LICENCES[licence]];
};

const renderLicence = (className, url, text) => (
    <ExternalLink href={url} data-testid="journal-oa-licence">
        <div data-testid="journal-oa-licence-lookup" style={{ paddingRight: '1rem' }}>
            {text}
        </div>
        <div className={`fez-icon license ${className}`} />
    </ExternalLink>
);

const renderBoolean = isTrue => (isTrue ? 'Yes' : 'No');
const renderDateTime = (dateTimeString, format) =>
    moment(dateTimeString).isValid && moment(dateTimeString).format(format);

const getBasicDetails = journalDetails => {
    const detailRows = [
        {
            title: 'ulrAbbrevTitle',
            data:
                (journalDetails.fez_journal_jcr_scie &&
                    journalDetails.fez_journal_jcr_scie.jnl_jcr_scie_abbrev_title) ||
                (journalDetails.fez_journal_jcr_ssci &&
                    journalDetails.fez_journal_jcr_ssci.jnl_jcr_ssci_abbrev_title) ||
                (journalDetails.fez_journal_issn &&
                    journalDetails.fez_journal_issn[0] &&
                    journalDetails.fez_journal_issn[0].fez_ulrichs &&
                    journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_abbrev_title),
        },
        [
            {
                title: 'issns',
                data:
                    Array.isArray(journalDetails.fez_journal_issn) &&
                    journalDetails.fez_journal_issn
                        .filter(issn => issn.jnl_issn_type !== 454151)
                        .map(issn => issn.jnl_issn)
                        .join(', '),
            },
            {
                title: 'eissns',
                data:
                    Array.isArray(journalDetails.fez_journal_issn) &&
                    journalDetails.fez_journal_issn
                        .filter(issn => issn.jnl_issn_type === 454151)
                        .map(issn => issn.jnl_issn)
                        .join(', '),
            },
        ],
        {
            title: 'publisherWithCountry',
            data:
                journalDetails.jnl_publisher &&
                `${journalDetails.jnl_publisher}${journalDetails.fez_journal_issn &&
                    journalDetails.fez_journal_issn[0] &&
                    journalDetails.fez_journal_issn[0].fez_ulrichs &&
                    journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_country &&
                    `, ${journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_country}`}`,
        },
    ];
    if (
        journalDetails.fez_journal_issn &&
        journalDetails.fez_journal_issn[0] &&
        journalDetails.fez_journal_issn[0].fez_ulrichs
    ) {
        return detailRows.concat([
            {
                title: 'urlRefereed',
                data: renderBoolean(journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_refereed),
            },
            [
                {
                    title: 'ulrStartYear',
                    data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_start_year,
                },
                {
                    title: 'ulrFrequency',
                    data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_frequency,
                },
            ],
            {
                title: 'ulrFormats',
                data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_formats,
            },
            {
                title: 'ulrOpenAccessUrl',
                data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access_url && (
                    <ExternalLink
                        href={journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access_url}
                        title={txt.links.ulrOpenAccessUrl.title}
                    >
                        {journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access_url}
                    </ExternalLink>
                ),
            },
            {
                title: 'ulrDescription',
                data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_description,
            },
            {
                title: 'ulrTitleLink',
                data: nodeJoin(
                    journalDetails.fez_journal_issn.map(
                        (issn, index) =>
                            issn.fez_ulrichs &&
                            issn.fez_ulrichs.ulr_title_id && (
                                <ExternalLink
                                    key={`journal-ulrichs-${index}-link`}
                                    href={globalLocale.global.ulrichsLink.externalUrl.replace(
                                        '[id]',
                                        issn.fez_ulrichs.ulr_title_id,
                                    )}
                                    title={txt.links.ulrTitleLink.title}
                                >
                                    {issn.fez_ulrichs.ulr_title}
                                </ExternalLink>
                            ),
                    ),
                    ', ',
                ),
            },
        ]);
    }
    return detailRows;
};

const getOADetails = journalDetails => [
    {
        title: 'ulrOpenAccess',
        data:
            (journalDetails.fez_journal_issn &&
                journalDetails.fez_journal_issn[0] &&
                journalDetails.fez_journal_issn[0].fez_ulrichs &&
                !!journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access &&
                'Yes') ||
            'No',
    },
    {
        title: 'doajApcAvgPrice',
        data:
            journalDetails.fez_journal_doaj &&
            journalDetails.fez_journal_doaj.jnl_doaj_apc_average_price &&
            `${journalDetails.fez_journal_doaj.jnl_doaj_apc_average_price} ${journalDetails.fez_journal_doaj.jnl_doaj_apc_currency}`,
    },
    {
        title: 'licence',
        data:
            journalDetails.fez_journal_doaj &&
            renderLicence(
                ...getLicence({
                    by: journalDetails.fez_journal_doaj.jnl_doaj_by,
                    nd: journalDetails.fez_journal_doaj.jnl_doaj_nd,
                    nc: journalDetails.fez_journal_doaj.jnl_doaj_nc,
                    sa: journalDetails.fez_journal_doaj.jnl_doaj_sa,
                }),
            ),
    },
    {
        title: 'doajSeal',
        data: journalDetails.fez_journal_doaj && renderBoolean(journalDetails.fez_journal_doaj.jnl_doaj_seal),
    },
    {
        title: 'doajLastUpdated',
        data:
            journalDetails.fez_journal_doaj &&
            journalDetails.fez_journal_doaj.jnl_doaj_last_updated &&
            renderDateTime(journalDetails.fez_journal_doaj.jnl_doaj_last_updated, 'Do MMMM YYYY [at] h:mma'),
    },
    {
        title: 'doajHomepageUrl',
        data: journalDetails.fez_journal_doaj && journalDetails.fez_journal_doaj.jnl_doaj_homepage_url && (
            <ExternalLink
                href={journalDetails.fez_journal_doaj.jnl_doaj_homepage_url}
                title={txt.links.doajHomepageUrl.title}
            >
                {journalDetails.fez_journal_doaj.jnl_doaj_homepage_url}
            </ExternalLink>
        ),
    },
    {
        title: 'srmJournalLink',
        data:
            Array.isArray(journalDetails.fez_journal_issn) &&
            journalDetails.fez_journal_issn.length > 0 &&
            nodeJoin(
                journalDetails.fez_journal_issn
                    .map(
                        (issn, index) =>
                            issn.fez_sherpa_romeo &&
                            issn.fez_sherpa_romeo.srm_journal_link && (
                                <ExternalLink
                                    key={`journal-sherpa-${index}-link`}
                                    href={issn.fez_sherpa_romeo.srm_journal_link}
                                    title={txt.links.srmJournalLink.title}
                                >
                                    {issn.fez_sherpa_romeo.srm_issn}
                                </ExternalLink>
                            ),
                    )
                    .filter(item => !!item),
                ', ',
            ).filter(item => !!item),
    },
];

const getClarivateDetails = (journalDetails, slugPiece) => ({
    common:
        (journalDetails[`fez_journal_jcr_${slugPiece}`] && [
            {
                title: 'jcrAbbrevTitle',
                data: journalDetails[`fez_journal_jcr_${slugPiece}`][`jnl_jcr_${slugPiece}_abbrev_title`],
            },
            [
                {
                    title: 'jcrImpactFactor',
                    data: journalDetails[`fez_journal_jcr_${slugPiece}`][`jnl_jcr_${slugPiece}_impact_factor`],
                },
                {
                    title: 'jcr5yrImpactFactor',
                    data: journalDetails[`fez_journal_jcr_${slugPiece}`][`jnl_jcr_${slugPiece}_5yr_impact_factor`],
                },
            ],
            {
                title: 'jcrSourceDate',
                data:
                    journalDetails[`fez_journal_jcr_${slugPiece}`] &&
                    renderDateTime(
                        journalDetails[`fez_journal_jcr_${slugPiece}`][`jnl_jcr_${slugPiece}_source_date`],
                        'YYYY',
                    ),
            },
            [
                {
                    data: (
                        <ExternalLink href={txt.links.jcrHomePage.href} title={txt.links.jcrHomePage.title}>
                            {txt.links.jcrHomePage.text}
                        </ExternalLink>
                    ),
                },
                {
                    data: (
                        <ExternalLink
                            href={`${txt.links.jcrMoreInfo.linkPrefix}${slugPiece}/`}
                            title={txt.links.jcrMoreInfo.title}
                        >
                            {`${txt.links.jcrMoreInfo.textPrefix} ${slugPiece.toUpperCase()}`}
                        </ExternalLink>
                    ),
                },
            ],
        ]) ||
        [],
    tabs:
        (journalDetails[`fez_journal_jcr_${slugPiece}`] &&
            Array.isArray(journalDetails[`fez_journal_jcr_${slugPiece}`][`fez_journal_jcr_${slugPiece}_category`]) &&
            journalDetails[`fez_journal_jcr_${slugPiece}`][`fez_journal_jcr_${slugPiece}_category`].map(category => ({
                title: category[`jnl_jcr_${slugPiece}_category_description`],
                content: [
                    [
                        {
                            title: 'jcrCategoryRanking',
                            data: category[`jnl_jcr_${slugPiece}_category_ranking`],
                        },
                        {
                            title: 'jcrCategoryQuartile',
                            data: category[`jnl_jcr_${slugPiece}_category_quartile`],
                        },
                    ],
                ],
            }))) ||
        [],
});

const getCiteScoreDetails = journalDetails => ({
    common:
        (journalDetails.fez_journal_cite_score && [
            {
                title: 'citeScoreSourceDate',
                data: renderDateTime(journalDetails.fez_journal_cite_score.jnl_cite_score_source_date, 'YYYY'),
            },
            [
                {
                    data: (
                        <ExternalLink
                            href={`${txt.links.citeScoreSource.linkPrefix}${journalDetails.fez_journal_cite_score.jnl_cite_score_source_id}`}
                            title={txt.links.citeScoreSource.title}
                        >
                            {txt.links.citeScoreSource.text}
                        </ExternalLink>
                    ),
                },
                {
                    data: (
                        <ExternalLink href={txt.links.citeScoreMoreInfo.href} title={txt.links.citeScoreMoreInfo.title}>
                            {txt.links.citeScoreMoreInfo.text}
                        </ExternalLink>
                    ),
                },
            ],
        ]) ||
        [],
    tabs:
        (journalDetails.fez_journal_cite_score &&
            Array.isArray(journalDetails.fez_journal_cite_score.fez_journal_cite_score_asjc_code) &&
            journalDetails.fez_journal_cite_score.fez_journal_cite_score_asjc_code.map(code => ({
                title: code.jnl_cite_score_asjc_code,
                content: [
                    {
                        title: 'citeScoreAsjcCode',
                        data: code.jnl_cite_score_asjc_code,
                    },
                    [
                        {
                            title: 'citeScoreAsjcCodeSiteScore',
                            data: code.jnl_cite_score_asjc_code_cite_score,
                        },
                        {
                            title: 'citeScoreAsjcCodeQuartile',
                            data: code.jnl_cite_score_asjc_code_quartile,
                        },
                        {
                            title: 'citeScoreAsjcCodeRank',
                            data:
                                code.jnl_cite_score_asjc_code_rank &&
                                `${code.jnl_cite_score_asjc_code_rank} out of ${code.jnl_cite_score_asjc_code_rank_out_of}`,
                        },
                    ],
                    [
                        {
                            title: 'citeScoreAsjcCodeTop10Pct',
                            data: renderBoolean(code.jnl_cite_score_asjc_code_top_10_percent),
                        },
                        {
                            title: 'citeScoreAsjcCodePercentile',
                            data: code.jnl_cite_score_asjc_code_percentile,
                        },
                        {
                            title: 'citeScoreAsjcCodePercentCited',
                            data:
                                code.jnl_cite_score_asjc_code_percent_cited &&
                                `${code.jnl_cite_score_asjc_code_percent_cited}%`,
                        },
                    ],
                    [
                        { title: 'citeScoreAsjcCodeSnip', data: code.jnl_cite_score_asjc_code_snip },
                        { title: 'citeScoreAsjcCodeSjr', data: code.jnl_cite_score_asjc_code_sjr },
                    ],
                ],
            }))) ||
        [],
});

const getWosCategoriesByIndex = (categories, indexName) =>
    (Array.isArray(categories) &&
        categories
            .filter(category => category.jnl_wos_category_index === indexName)
            .map((categoryObj, categoryObjIndex) =>
                nodeJoin(
                    (categoryObj.jnl_wos_category || '').split('|').map((categoryName, categoryIndex) => {
                        const id = `wos-${indexName.toLowerCase()}${categoryObjIndex}-category${categoryIndex}`;
                        return (
                            <span key={id} data-testid={id}>
                                {categoryName.trim()}
                            </span>
                        );
                    }),
                    ', ',
                ),
            )) ||
    '';

const getIndexDetails = journalDetails => [
    {
        title: 'wosCategoryAhci',
        data: getWosCategoriesByIndex(journalDetails.fez_journal_wos_category, 'AHCI'),
    },
    {
        title: 'wosCategoryScie',
        data: getWosCategoriesByIndex(journalDetails.fez_journal_wos_category, 'SCIE'),
    },
    {
        title: 'wosCategorySsci',
        data: getWosCategoriesByIndex(journalDetails.fez_journal_wos_category, 'SSCI'),
    },
    {
        title: 'wosCategoryEsci',
        data: getWosCategoriesByIndex(journalDetails.fez_journal_wos_category, 'ESCI'),
    },
    {
        title: 'hasScopus',
        data: renderBoolean(journalDetails.fez_journal_cite_score),
    },
    {
        title: 'hasPubmed',
        data: renderBoolean(journalDetails.fez_journal_pubmed),
    },
];

const getListedDetails = journalDetails => [
    [
        {
            title: 'adbcRating',
            data: journalDetails.fez_journal_abdc && journalDetails.fez_journal_abdc.jnl_abdc_rating,
        },
        {
            title: 'adbcForCode',
            data: journalDetails.fez_journal_abdc && journalDetails.fez_journal_abdc.jnl_abdc_for_code,
        },
    ],
    {
        title: 'adbcSourceDate',
        data:
            journalDetails.fez_journal_abdc &&
            journalDetails.fez_journal_abdc.jnl_abdc_source_date &&
            renderDateTime(journalDetails.fez_journal_abdc.jnl_abdc_source_date, 'Do MMMM YYYY'),
    },
    {
        title: 'cwtsSourceDate',
        data:
            (journalDetails.fez_journal_cwts &&
                `Yes, ${renderDateTime(journalDetails.fez_journal_cwts.jnl_cwts_source_date, 'YYYY')}`) ||
            'No',
    },
    [
        {
            title: 'hasEra',
            data: renderBoolean(journalDetails.fez_journal_era),
        },
        {
            title: 'eraForCode',
            data:
                Array.isArray(journalDetails.fez_journal_era) &&
                journalDetails.fez_journal_era.map((era, index) => (
                    <div key={`journal-era-category${index}`} data-testid={`journal-era-category${index}`}>
                        {`${era.jnl_era_source_year}: ${Array.isArray(era.fez_journal_era_for_code) &&
                            era.fez_journal_era_for_code.map(forCode => forCode.jnl_era_for_code_lookup).join(', ')}`}
                    </div>
                )),
        },
    ],
    {
        title: 'natureIndexSourceDate',
        data:
            (journalDetails.fez_journal_nature_index &&
                `Yes, ${renderDateTime(
                    journalDetails.fez_journal_nature_index.jnl_nature_index_source_date,
                    'Do MMMM YYYY',
                )}`) ||
            'No',
    },
];

const mapStateToProps = state => {
    const { journalDetails = false, journalLoading = false, journalLoadingError = false } = state.get('journalReducer');

    return {
        basicDetails: getBasicDetails(journalDetails),
        citeScoreDetails: getCiteScoreDetails(journalDetails),
        indexDetails: getIndexDetails(journalDetails),
        journalDetailsLoaded: !!journalDetails,
        journalLoading,
        journalLoadingError,
        journalTitle: (!!journalDetails && journalDetails.jnl_title) || '',
        jscieDetails: getClarivateDetails(journalDetails, 'scie'),
        jssciDetails: getClarivateDetails(journalDetails, 'ssci'),
        listedDetails: getListedDetails(journalDetails),
        oaDetails: getOADetails(journalDetails),
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(JournalView));
