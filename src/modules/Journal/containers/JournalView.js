import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import JournalView from '../components/JournalView';

import { default as globalLocale } from 'locale/global';

import * as actions from 'actions';

const nodeJoin = (arr, glue) => arr.slice(1).reduce((op, item) => op.concat([glue, item]), [arr[0]]);
const getLicence = ({ by, nd, nc, sa }) => {
    const conditions = [];
    by && conditions.push('by');
    nd && conditions.push('nd');
    nc && conditions.push('nc');
    sa && conditions.push('sa');
    const licence = conditions.join('-');
    return [`cc-${licence}`, `http://creativecommons.org/licenses/${licence}/3.0/deed.en_US`];
};

export const renderLicence = (className, url) => (
    <ExternalLink href={url} data-testid="journal-oa-licence">
        <div className={`fez-icon license ${className}`} />
    </ExternalLink>
);

const getBasicDetails = journalDetails => {
    const detailRows = [
        {
            title: 'ISO abbreviated title',
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
                title: 'ISSN(s)',
                data:
                    Array.isArray(journalDetails.fez_journal_issn) &&
                    journalDetails.fez_journal_issn
                        .filter(issn => issn.jnl_issn_type !== 454151)
                        .map(issn => issn.jnl_issn)
                        .join(', '),
            },
            {
                title: 'eISSN(s)',
                data:
                    Array.isArray(journalDetails.fez_journal_issn) &&
                    journalDetails.fez_journal_issn
                        .filter(issn => issn.jnl_issn_type === 454151)
                        .map(issn => issn.jnl_issn)
                        .join(', '),
            },
        ],
        {
            title: 'Publisher',
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
                title: 'Refereed',
                data: (journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_refereed && 'Yes') || 'No',
            },
            [
                {
                    title: 'First year of publication',
                    data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_start_year,
                },
                {
                    title: 'Frequency of publication',
                    data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_frequency,
                },
            ],
            {
                title: 'Journal formats available',
                data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_formats,
            },
            {
                title: 'Journal URL',
                data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access_url && (
                    <ExternalLink href={journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access_url}>
                        {journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access_url}
                    </ExternalLink>
                ),
            },
            {
                title: 'Description',
                data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_description,
            },
            {
                title: 'View journal in Ulrichs',
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
                                    title={globalLocale.global.ulrichsLink.ariaLabel}
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
        title: 'Open access',
        data:
            (journalDetails.fez_journal_issn &&
                journalDetails.fez_journal_issn[0] &&
                journalDetails.fez_journal_issn[0].fez_ulrichs &&
                !!journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access &&
                'Yes') ||
            'No',
    },
    {
        title: 'Article processing charges',
        data:
            journalDetails.fez_journal_doaj &&
            journalDetails.fez_journal_doaj.jnl_doaj_apc_average_price &&
            `${journalDetails.fez_journal_doaj.jnl_doaj_apc_average_price} ${journalDetails.fez_journal_doaj.jnl_doaj_apc_currency}`,
    },
    {
        title: 'Journal licence',
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
        title: 'DOAJ seal',
        data: (journalDetails.fez_journal_doaj && journalDetails.fez_journal_doaj.jnl_doaj_seal && 'Yes') || 'No',
    },
    {
        title: 'Last updated',
        data:
            journalDetails.fez_journal_doaj &&
            journalDetails.fez_journal_doaj.jnl_doaj_last_updated &&
            moment(journalDetails.fez_journal_doaj.jnl_doaj_last_updated).isValid &&
            moment(journalDetails.fez_journal_doaj.jnl_doaj_last_updated).format('Do MMMM YYYY [at] h:mma'),
    },
    {
        title: 'View in DOAJ',
        data: journalDetails.fez_journal_doaj && journalDetails.fez_journal_doaj.jnl_doaj_homepage_url && (
            <ExternalLink href={journalDetails.fez_journal_doaj.jnl_doaj_homepage_url} title={'DOAJ Homepage'}>
                {journalDetails.fez_journal_doaj.jnl_doaj_homepage_url}
            </ExternalLink>
        ),
    },
    {
        title: 'Sherpa Romeo open access and archiving policies',
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
                                    title={globalLocale.global.sherpaRomeoLink.externalLinktext}
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
                title: 'Abbreviated title',
                data: journalDetails[`fez_journal_jcr_${slugPiece}`][`jnl_jcr_${slugPiece}_abbrev_title`],
            },
            [
                {
                    title: 'Impact factor',
                    data: journalDetails[`fez_journal_jcr_${slugPiece}`][`jnl_jcr_${slugPiece}_impact_factor`],
                },
                {
                    title: '5 year impact factor',
                    data: journalDetails[`fez_journal_jcr_${slugPiece}`][`jnl_jcr_${slugPiece}_5yr_impact_factor`],
                },
            ],
            {
                title: 'JCR version',
                data:
                    journalDetails[`fez_journal_jcr_${slugPiece}`] &&
                    moment(journalDetails[`fez_journal_jcr_${slugPiece}`][`jnl_jcr_${slugPiece}_source_date`])
                        .isValid &&
                    moment(journalDetails[`fez_journal_jcr_${slugPiece}`][`jnl_jcr_${slugPiece}_source_date`]).format(
                        'YYYY',
                    ),
            },
            [
                {
                    data: (
                        <ExternalLink
                            href="https://jcr-clarivate-com.ezproxy.library.uq.edu.au"
                            title="Open JCR website in a new tab"
                        >
                            Go to JCR website
                        </ExternalLink>
                    ),
                },
                {
                    data: (
                        <ExternalLink
                            href={`https://clarivate.com/webofsciencegroup/solutions/webofscience-${slugPiece}/`}
                            title="Open in a new tab"
                        >
                            {`More info about JCR ${slugPiece.toUpperCase()}`}
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
                        { title: 'Ranking', data: category[`jnl_jcr_${slugPiece}_category_ranking`] },
                        { title: 'Quartile', data: category[`jnl_jcr_${slugPiece}_category_quartile`] },
                    ],
                ],
            }))) ||
        [],
});

const getCiteScoreDetails = journalDetails => ({
    common:
        (journalDetails.fez_journal_cite_score && [
            {
                title: 'CiteScore version',
                data:
                    moment(journalDetails.fez_journal_cite_score.jnl_cite_score_source_date).isValid &&
                    moment(journalDetails.fez_journal_cite_score.jnl_cite_score_source_date).format('YYYY'),
            },
            [
                {
                    data: (
                        <ExternalLink
                            href={`https://www-scopus-com.ezproxy.library.uq.edu.au/sourceid/${journalDetails.fez_journal_cite_score.jnl_cite_score_source_id}`}
                            title="Open in new tab"
                        >
                            Go to record in CiteScore
                        </ExternalLink>
                    ),
                },
                {
                    data: (
                        <ExternalLink
                            href="https://service.elsevier.com/app/answers/detail/a_id/14880/supporthub/scopus/"
                            title="Open in new tab"
                        >
                            More info about CiteScore
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
                        title: 'Scopus ASJC Code',
                        data: code.jnl_cite_score_asjc_code,
                    },
                    [
                        {
                            title: 'CiteScore',
                            data: code.jnl_cite_score_asjc_code_cite_score,
                        },
                        {
                            title: 'Quartile',
                            data: code.jnl_cite_score_asjc_code_quartile,
                        },
                        {
                            title: 'Ranked',
                            data:
                                code.jnl_cite_score_asjc_code_rank &&
                                `${code.jnl_cite_score_asjc_code_rank} out of ${code.jnl_cite_score_asjc_code_rank_out_of}`,
                        },
                    ],
                    [
                        {
                            title: 'Top 10% (CiteScore Percentile)',
                            data: (code.jnl_cite_score_asjc_code_top_10_percent && 'Yes') || 'No',
                        },
                        {
                            title: 'Percentile',
                            data: code.jnl_cite_score_asjc_code_percentile,
                        },
                        {
                            title: 'Percent Cited',
                            data:
                                code.jnl_cite_score_asjc_code_percent_cited &&
                                `${code.jnl_cite_score_asjc_code_percent_cited}%`,
                        },
                    ],
                    [
                        { title: 'SNIP', data: code.jnl_cite_score_asjc_code_snip },
                        { title: 'SJR', data: code.jnl_cite_score_asjc_code_sjr },
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
                    (categoryObj.jnl_wos_category || '')
                        .split('|')
                        .map((categoryName, categoryIndex) => (
                            <span
                                data-testid={`wos-${indexName.toLowerCase()}${categoryObjIndex}-category${categoryIndex}`}
                            >
                                {categoryName.trim()}
                            </span>
                        )),
                    ', ',
                ),
            )) ||
    '';

const getIndexDetails = journalDetails => [
    {
        title: 'Art and Humanities Citation Index (AHCI) - WOS Subject Categories',
        data: getWosCategoriesByIndex(journalDetails.fez_journal_wos_category, 'AHCI'),
    },
    {
        title: 'Science Citation Index Expanded - WOS Subject Categories',
        data: getWosCategoriesByIndex(journalDetails.fez_journal_wos_category, 'SCIE'),
    },
    {
        title: 'Social Science Citation Index - WOS Subject Categories',
        data: getWosCategoriesByIndex(journalDetails.fez_journal_wos_category, 'SSCI'),
    },
    {
        title: 'Emerging Sources Citation Index - WOS Subject Categories',
        data: getWosCategoriesByIndex(journalDetails.fez_journal_wos_category, 'ESCI'),
    },
    {
        title: 'Scopus',
        data: (journalDetails.fez_journal_cite_score && 'Yes') || 'No',
    },
    {
        title: 'Pubmed',
        data: (journalDetails.fez_journal_pubmed && 'Yes') || 'No',
    },
];

const getListedDetails = journalDetails => [
    [
        {
            title: 'Australian Business Deans Council journal quality list',
            data: journalDetails.fez_journal_abdc && journalDetails.fez_journal_abdc.jnl_abdc_rating,
        },
        {
            title: 'Field of Research Codes',
            data: journalDetails.fez_journal_abdc && journalDetails.fez_journal_abdc.jnl_abdc_for_code,
        },
    ],
    {
        title: 'Current list',
        data:
            journalDetails.fez_journal_abdc &&
            journalDetails.fez_journal_abdc.jnl_abdc_source_date &&
            moment(journalDetails.fez_journal_abdc.jnl_abdc_source_date).isValid &&
            moment(journalDetails.fez_journal_abdc.jnl_abdc_source_date).format('Do MMMM YYYY'),
    },
    {
        title: 'CWTS Leiden Ranking',
        data:
            (journalDetails.fez_journal_cwts &&
                `Yes, ${moment(journalDetails.fez_journal_cwts.jnl_cwts_source_date).isValid &&
                    moment(journalDetails.fez_journal_cwts.jnl_cwts_source_date).format('YYYY')}`) ||
            'No',
    },
    [
        {
            title: 'Excellence in Research for Australia (ERA)',
            data: (journalDetails.fez_journal_era && 'Yes') || 'No',
        },
        {
            title: 'ERA Years with Field of Research codes',
            data:
                Array.isArray(journalDetails.fez_journal_era) &&
                journalDetails.fez_journal_era.map((era, index) => (
                    <div data-testid={`journal-era-category${index}`}>
                        {`${era.jnl_era_source_year}: ${Array.isArray(era.fez_journal_era_for_code) &&
                            era.fez_journal_era_for_code.map(forCode => forCode.jnl_era_for_code_lookup).join(', ')}`}
                    </div>
                )),
        },
    ],
    {
        title: 'Nature Index',
        data:
            (journalDetails.fez_journal_nature_index &&
                `Yes, ${moment(journalDetails.fez_journal_nature_index.jnl_nature_index_source_date).isValid &&
                    moment(journalDetails.fez_journal_nature_index.jnl_nature_index_source_date).format(
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
