import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import JournalView, {
    getLicenceAttrs,
    renderBoolean,
    renderDateTime,
    renderExtLink,
    renderLicence,
} from '../components/JournalView';

import { default as globalLocale } from 'locale/global';
import pagesLocale from 'locale/pages';

import * as actions from 'actions';

const txt = pagesLocale.pages.journal.view;

const nodeJoin = (arr, glue) => arr.slice(1).reduce((op, item) => op.concat([glue, item]), [arr[0]]);

const getBasicDetails = journalDetails => {
    const detailRows = [
        {
            ...txt.entries.ulrAbbrevTitle,
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
                ...txt.entries.issns,
                data:
                    Array.isArray(journalDetails.fez_journal_issn) &&
                    journalDetails.fez_journal_issn
                        .filter(issn => issn.jnl_issn_type !== 454151)
                        .map(issn => issn.jnl_issn)
                        .join(', '),
            },
            {
                ...txt.entries.eissns,
                data:
                    Array.isArray(journalDetails.fez_journal_issn) &&
                    journalDetails.fez_journal_issn
                        .filter(issn => issn.jnl_issn_type === 454151)
                        .map(issn => issn.jnl_issn)
                        .join(', '),
            },
        ],
        {
            ...txt.entries.publisherWithCountry,
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
                ...txt.entries.urlRefereed,
                data: renderBoolean(journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_refereed),
            },
            [
                {
                    ...txt.entries.ulrStartYear,
                    data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_start_year,
                },
                {
                    ...txt.entries.ulrFrequency,
                    data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_frequency,
                },
            ],
            {
                ...txt.entries.ulrFormats,
                data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_formats,
            },
            {
                ...txt.entries.ulrOpenAccessUrl,
                data:
                    journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access_url &&
                    renderExtLink(
                        null,
                        journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access_url,
                        txt.links.ulrOpenAccessUrl.title,
                        journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access_url,
                    ),
            },
            {
                ...txt.entries.ulrDescription,
                data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_description,
            },
            {
                ...txt.entries.ulrTitleLink,
                data: nodeJoin(
                    journalDetails.fez_journal_issn.map(
                        (issn, index) =>
                            issn.fez_ulrichs &&
                            issn.fez_ulrichs.ulr_title_id &&
                            renderExtLink(
                                `journal-ulrichs-${index}-link`,
                                globalLocale.global.ulrichsLink.externalUrl.replace(
                                    '[id]',
                                    issn.fez_ulrichs.ulr_title_id,
                                ),
                                txt.links.ulrTitleLink.title,
                                issn.fez_ulrichs.ulr_title,
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
        ...txt.entries.ulrOpenAccess,
        data:
            (journalDetails.fez_journal_issn &&
                journalDetails.fez_journal_issn[0] &&
                journalDetails.fez_journal_issn[0].fez_ulrichs &&
                !!journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access &&
                'Yes') ||
            'No',
    },
    {
        ...txt.entries.doajApcAvgPrice,
        data:
            journalDetails.fez_journal_doaj &&
            journalDetails.fez_journal_doaj.jnl_doaj_apc_average_price &&
            `${journalDetails.fez_journal_doaj.jnl_doaj_apc_average_price} ${journalDetails.fez_journal_doaj.jnl_doaj_apc_currency}`,
    },
    {
        ...txt.entries.licence,
        data:
            journalDetails.fez_journal_doaj &&
            renderLicence(
                ...getLicenceAttrs({
                    by: journalDetails.fez_journal_doaj.jnl_doaj_by,
                    nd: journalDetails.fez_journal_doaj.jnl_doaj_nd,
                    nc: journalDetails.fez_journal_doaj.jnl_doaj_nc,
                    sa: journalDetails.fez_journal_doaj.jnl_doaj_sa,
                }),
            ),
    },
    {
        ...txt.entries.doajSeal,
        data: journalDetails.fez_journal_doaj && renderBoolean(journalDetails.fez_journal_doaj.jnl_doaj_seal),
    },
    {
        ...txt.entries.doajLastUpdated,
        data:
            journalDetails.fez_journal_doaj &&
            journalDetails.fez_journal_doaj.jnl_doaj_last_updated &&
            renderDateTime(journalDetails.fez_journal_doaj.jnl_doaj_last_updated, 'Do MMMM YYYY [at] h:mma'),
    },
    {
        ...txt.entries.doajHomepageUrl,
        data:
            journalDetails.fez_journal_doaj &&
            journalDetails.fez_journal_doaj.jnl_doaj_homepage_url &&
            renderExtLink(
                null,
                journalDetails.fez_journal_doaj.jnl_doaj_homepage_url,
                txt.links.doajHomepageUrl.title,
                journalDetails.fez_journal_doaj.jnl_doaj_homepage_url,
            ),
    },
    {
        ...txt.entries.srmJournalLink,
        data:
            Array.isArray(journalDetails.fez_journal_issn) &&
            journalDetails.fez_journal_issn.length > 0 &&
            nodeJoin(
                journalDetails.fez_journal_issn
                    .map(
                        (issn, index) =>
                            issn.fez_sherpa_romeo &&
                            issn.fez_sherpa_romeo.srm_journal_link &&
                            renderExtLink(
                                `journal-sherpa-${index}-link`,
                                issn.fez_sherpa_romeo.srm_journal_link,
                                txt.links.srmJournalLink.title,
                                issn.fez_sherpa_romeo.srm_issn,
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
                ...txt.entries.jcrAbbrevTitle,
                data: journalDetails[`fez_journal_jcr_${slugPiece}`][`jnl_jcr_${slugPiece}_abbrev_title`],
            },
            [
                {
                    ...txt.entries.jcrImpactFactor,
                    data: journalDetails[`fez_journal_jcr_${slugPiece}`][`jnl_jcr_${slugPiece}_impact_factor`],
                },
                {
                    ...txt.entries.jcr5yrImpactFactor,
                    data: journalDetails[`fez_journal_jcr_${slugPiece}`][`jnl_jcr_${slugPiece}_5yr_impact_factor`],
                },
            ],
            {
                ...txt.entries.jcrSourceDate,
                data:
                    journalDetails[`fez_journal_jcr_${slugPiece}`] &&
                    renderDateTime(
                        journalDetails[`fez_journal_jcr_${slugPiece}`][`jnl_jcr_${slugPiece}_source_date`],
                        'YYYY',
                    ),
            },
            [
                {
                    data: renderExtLink(
                        null,
                        txt.links.jcrHomePage.href,
                        txt.links.jcrHomePage.title,
                        txt.links.jcrHomePage.text,
                    ),
                },
                {
                    data: renderExtLink(
                        null,
                        `${txt.links.jcrMoreInfo.linkPrefix}${slugPiece}/`,
                        txt.links.jcrMoreInfo.title,
                        `${txt.links.jcrMoreInfo.textPrefix} ${slugPiece.toUpperCase()}`,
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
                            ...txt.entries.jcrCategoryRanking,
                            data: category[`jnl_jcr_${slugPiece}_category_ranking`],
                        },
                        {
                            ...txt.entries.jcrCategoryQuartile,
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
                ...txt.entries.citeScoreSourceDate,
                data: renderDateTime(journalDetails.fez_journal_cite_score.jnl_cite_score_source_date, 'YYYY'),
            },
            [
                {
                    data: renderExtLink(
                        null,
                        `${txt.links.citeScoreSource.linkPrefix}${journalDetails.fez_journal_cite_score.jnl_cite_score_source_id}`,
                        txt.links.citeScoreSource.title,
                        txt.links.citeScoreSource.text,
                    ),
                },
                {
                    data: renderExtLink(
                        null,
                        txt.links.citeScoreMoreInfo.href,
                        txt.links.citeScoreMoreInfo.title,
                        txt.links.citeScoreMoreInfo.text,
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
                        ...txt.entries.citeScoreAsjcCode,
                        data: code.jnl_cite_score_asjc_code,
                    },
                    [
                        {
                            ...txt.entries.citeScoreAsjcCodeCiteScore,
                            data: code.jnl_cite_score_asjc_code_cite_score,
                        },
                        {
                            ...txt.entries.citeScoreAsjcCodeQuartile,
                            data: code.jnl_cite_score_asjc_code_quartile,
                        },
                        {
                            ...txt.entries.citeScoreAsjcCodeRank,
                            data:
                                code.jnl_cite_score_asjc_code_rank &&
                                `${code.jnl_cite_score_asjc_code_rank} out of ${code.jnl_cite_score_asjc_code_rank_out_of}`,
                        },
                    ],
                    [
                        {
                            ...txt.entries.citeScoreAsjcCodeTop10Pct,
                            data: renderBoolean(code.jnl_cite_score_asjc_code_top_10_percent),
                        },
                        {
                            ...txt.entries.citeScoreAsjcCodePercentile,
                            data: code.jnl_cite_score_asjc_code_percentile,
                        },
                        {
                            ...txt.entries.citeScoreAsjcCodePercentCited,
                            data:
                                code.jnl_cite_score_asjc_code_percent_cited &&
                                `${code.jnl_cite_score_asjc_code_percent_cited}%`,
                        },
                    ],
                    [
                        { ...txt.entries.citeScoreAsjcCodeSnip, data: code.jnl_cite_score_asjc_code_snip },
                        { ...txt.entries.citeScoreAsjcCodeSjr, data: code.jnl_cite_score_asjc_code_sjr },
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
        ...txt.entries.wosCategoryAhci,
        data: getWosCategoriesByIndex(journalDetails.fez_journal_wos_category, 'AHCI'),
    },
    {
        ...txt.entries.wosCategoryScie,
        data: getWosCategoriesByIndex(journalDetails.fez_journal_wos_category, 'SCIE'),
    },
    {
        ...txt.entries.wosCategorySsci,
        data: getWosCategoriesByIndex(journalDetails.fez_journal_wos_category, 'SSCI'),
    },
    {
        ...txt.entries.wosCategoryEsci,
        data: getWosCategoriesByIndex(journalDetails.fez_journal_wos_category, 'ESCI'),
    },
    {
        ...txt.entries.hasScopus,
        data: renderBoolean(journalDetails.fez_journal_cite_score),
    },
    {
        ...txt.entries.hasPubmed,
        data: renderBoolean(journalDetails.fez_journal_pubmed),
    },
];

const getListedDetails = journalDetails => [
    [
        {
            ...txt.entries.adbcRating,
            data: journalDetails.fez_journal_abdc && journalDetails.fez_journal_abdc.jnl_abdc_rating,
        },
        {
            ...txt.entries.adbcForCode,
            data: journalDetails.fez_journal_abdc && journalDetails.fez_journal_abdc.jnl_abdc_for_code,
        },
    ],
    {
        ...txt.entries.adbcSourceDate,
        data:
            journalDetails.fez_journal_abdc &&
            journalDetails.fez_journal_abdc.jnl_abdc_source_date &&
            renderDateTime(journalDetails.fez_journal_abdc.jnl_abdc_source_date, 'Do MMMM YYYY'),
    },
    {
        ...txt.entries.cwtsSourceDate,
        data:
            (journalDetails.fez_journal_cwts &&
                `Yes, ${renderDateTime(journalDetails.fez_journal_cwts.jnl_cwts_source_date, 'YYYY')}`) ||
            'No',
    },
    [
        {
            ...txt.entries.hasEra,
            data: renderBoolean(journalDetails.fez_journal_era),
        },
        {
            ...txt.entries.eraForCode,
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
        ...txt.entries.natureIndexSourceDate,
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
