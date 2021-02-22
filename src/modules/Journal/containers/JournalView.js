import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import JournalView from '../components/JournalView';

import * as actions from 'actions';

import pagesLocale from 'locale/pages';
const txt = pagesLocale.pages.journal.view;

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
                data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_refereed,
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
                data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access_url,
            },
            {
                ...txt.entries.ulrDescription,
                data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_description,
            },
            {
                ...txt.entries.ulrTitleLink,
                data:
                    Array.isArray(journalDetails.fez_journal_issn) &&
                    journalDetails.fez_journal_issn
                        .map(issn => !!issn.fez_ulrichs && !!issn.fez_ulrichs.ulr_title_id && issn.fez_ulrichs)
                        .filter(Boolean),
            },
        ]);
    }
    return detailRows;
};

const getOADetails = journalDetails =>
    journalDetails.fez_journal_doaj && [
        {
            ...txt.entries.ulrOpenAccess,
            data:
                journalDetails.fez_journal_issn &&
                journalDetails.fez_journal_issn[0] &&
                journalDetails.fez_journal_issn[0].fez_ulrichs &&
                journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access === '1',
        },
        [
            {
                ...txt.entries.doajHomepageUrl,
                data: journalDetails.fez_journal_doaj && journalDetails.fez_journal_doaj.jnl_doaj_homepage_url,
            },
            {
                ...txt.entries.doajApcAvgPrice,
                data:
                    journalDetails.fez_journal_doaj &&
                    journalDetails.fez_journal_doaj.jnl_doaj_apc_average_price &&
                    `${journalDetails.fez_journal_doaj.jnl_doaj_apc_average_price} ${journalDetails.fez_journal_doaj.jnl_doaj_apc_currency}`,
            },
        ],
        {
            ...txt.entries.licence,
            data: journalDetails.fez_journal_doaj && {
                by: journalDetails.fez_journal_doaj.jnl_doaj_by,
                nd: journalDetails.fez_journal_doaj.jnl_doaj_nd,
                nc: journalDetails.fez_journal_doaj.jnl_doaj_nc,
                sa: journalDetails.fez_journal_doaj.jnl_doaj_sa,
            },
        },
        {
            ...txt.entries.doajSeal,
            data: journalDetails.fez_journal_doaj && journalDetails.fez_journal_doaj.jnl_doaj_seal,
        },
        {
            ...txt.entries.doajLastUpdated,
            data: journalDetails.fez_journal_doaj && journalDetails.fez_journal_doaj.jnl_doaj_last_updated,
        },
        {
            ...txt.entries.doajJournalUrl,
            data:
                journalDetails.fez_journal_issn &&
                journalDetails.fez_journal_issn[0] &&
                journalDetails.fez_journal_issn[0].fez_ulrichs &&
                journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access === '1' &&
                journalDetails.fez_journal_issn[0].jnl_issn,
        },
        {
            ...txt.entries.srmJournalLink,
            data:
                Array.isArray(journalDetails.fez_journal_issn) &&
                journalDetails.fez_journal_issn
                    .map(
                        issn =>
                            issn.fez_sherpa_romeo && issn.fez_sherpa_romeo.srm_journal_link && issn.fez_sherpa_romeo,
                    )
                    .filter(Boolean),
        },
    ];

const getClarivateDetails = (journalDetails, indexType) => {
    const clarivateDetails = journalDetails[`fez_journal_jcr_${indexType}`];
    const subKeyPrefix = `jnl_jcr_${indexType}`;
    const categoryKey = `fez_journal_jcr_${indexType}_category`;
    return {
        common:
            (clarivateDetails && [
                {
                    ...txt.entries.jcrAbbrevTitle,
                    data: clarivateDetails[`${subKeyPrefix}_abbrev_title`],
                },
                [
                    {
                        ...txt.entries.jcrImpactFactor,
                        data: clarivateDetails[`${subKeyPrefix}_impact_factor`],
                    },
                    {
                        ...txt.entries.jcr5yrImpactFactor,
                        data: clarivateDetails[`${subKeyPrefix}_5yr_impact_factor`],
                    },
                ],
                {
                    ...txt.entries.jcrSourceDate,
                    data: clarivateDetails && clarivateDetails[`${subKeyPrefix}_source_date`],
                },
                [
                    {
                        id: txt.links.jcrHomePage.id,
                        data: txt.links.jcrHomePage,
                    },
                    {
                        id: txt.links.jcrMoreInfo.id,
                        data: indexType,
                    },
                ],
            ]) ||
            [],
        tabs:
            (clarivateDetails &&
                Array.isArray(clarivateDetails[categoryKey]) &&
                clarivateDetails[categoryKey].map(category => ({
                    title: category[`${subKeyPrefix}_category_description`],
                    content: [
                        [
                            {
                                ...txt.entries.jcrCategoryRanking,
                                data: category[`${subKeyPrefix}_category_ranking`],
                            },
                            {
                                ...txt.entries.jcrCategoryQuartile,
                                data: category[`${subKeyPrefix}_category_quartile`],
                            },
                        ],
                    ],
                }))) ||
            [],
    };
};

const getCiteScoreDetails = journalDetails => ({
    common:
        (journalDetails.fez_journal_cite_score && [
            {
                ...txt.entries.citeScoreSourceDate,
                data: journalDetails.fez_journal_cite_score.jnl_cite_score_source_date,
            },
            [
                {
                    id: txt.links.citeScoreSource.id,
                    data: journalDetails.fez_journal_cite_score.jnl_cite_score_source_id,
                },
                {
                    id: txt.links.citeScoreMoreInfo.id,
                    data: txt.links.citeScoreMoreInfo,
                },
            ],
        ]) ||
        [],
    tabs:
        (journalDetails.fez_journal_cite_score &&
            Array.isArray(journalDetails.fez_journal_cite_score.fez_journal_cite_score_asjc_code) &&
            journalDetails.fez_journal_cite_score.fez_journal_cite_score_asjc_code.map(code => ({
                title: code.jnl_cite_score_asjc_code_lookup,
                content: [
                    {
                        ...txt.entries.citeScoreAsjcCode,
                        data: code.jnl_cite_score_asjc_code_lookup,
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
                                `${code.jnl_cite_score_asjc_code_rank} ${txt.rankingOutOf} ${code.jnl_cite_score_asjc_code_rank_out_of}`,
                        },
                    ],
                    [
                        {
                            ...txt.entries.citeScoreAsjcCodeTop10Pct,
                            data: code.jnl_cite_score_asjc_code_top_10_percent,
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
    Array.isArray(categories) && categories.filter(category => category.jnl_wos_category_index === indexName);

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
        data: journalDetails.fez_journal_cite_score,
    },
    {
        ...txt.entries.hasPubmed,
        data: journalDetails.fez_journal_pubmed,
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
        data: journalDetails.fez_journal_abdc && journalDetails.fez_journal_abdc.jnl_abdc_source_date,
    },
    {
        ...txt.entries.cwtsSourceYear,
        data: {
            status:
                Array.isArray(journalDetails.fez_journal_wos_category) &&
                journalDetails.fez_journal_wos_category.some(
                    category => category.fez_journal_cwts && category.fez_journal_cwts.jnl_cwts_source_year,
                ),
            year:
                Array.isArray(journalDetails.fez_journal_wos_category) &&
                journalDetails.fez_journal_wos_category.reduce(
                    (firstcwtsSourceYear, category) =>
                        firstcwtsSourceYear ||
                        (category.fez_journal_cwts && category.fez_journal_cwts.jnl_cwts_source_year),
                    '',
                ),
        },
    },
    [
        {
            ...txt.entries.hasEra,
            data: journalDetails.fez_journal_era,
        },
        {
            ...txt.entries.eraForCode,
            data: journalDetails.fez_journal_era,
        },
    ],
    {
        ...txt.entries.natureIndexSourceDate,
        data: {
            status: journalDetails.fez_journal_nature_index,
            date:
                journalDetails.fez_journal_nature_index &&
                journalDetails.fez_journal_nature_index.jnl_nature_index_source_date,
        },
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
