import React from 'react';
import globalLocale from 'locale/global';
import { getDoajUrl, prefixByUrlResolver } from 'config/general';
import { default as viewJournalLocale } from 'locale/viewJournal';
import { getIndicator, types } from 'modules/SharedComponents/JournalsList/components/partials/utils';
import componentLocale from 'locale/components';
import { pathConfig } from './pathConfig';

export const findNestedValueInIssnArray = (data, subKey) => {
    if (!data) return undefined;

    const keys = subKey.split('.');
    const firstKey = keys[0];
    const restKeys = keys.slice(1).join('.');

    if (Array.isArray(data)) {
        // Loop through each element and return first found
        for (const item of data) {
            const result = findNestedValueInIssnArray(item, subKey);
            if (result !== undefined && result !== null) return result;
        }
        return undefined;
    }

    // If no more keys, return current value
    if (!firstKey) return data;
    return findNestedValueInIssnArray(data[firstKey], restKeys);
};

export const getAbbrevTitle = journalDetails =>
    journalDetails.jnl_abbrev_title ||
    journalDetails.fez_journal_jcr_scie?.jnl_jcr_scie_abbrev_title ||
    journalDetails.fez_journal_jcr_ssci?.jnl_jcr_ssci_abbrev_title ||
    findNestedValueInIssnArray(journalDetails.fez_journal_issn, 'fez_ulrichs.ulr_abbrev_title');

export const viewJournalConfig = {
    basic: {
        title: viewJournalLocale.viewJournal.basic.title,
        help: viewJournalLocale.viewJournal.basic.help,
        rows: [
            [
                {
                    heading: 'Journal home page',
                    fieldId: 'jnl-homepage-url',
                    getData: journalDetails =>
                        findNestedValueInIssnArray(
                            journalDetails.fez_journal_issn,
                            'fez_ulrichs.ulr_open_access_url',
                        ) ||
                        (journalDetails.fez_journal_doaj && journalDetails.fez_journal_doaj.jnl_doaj_homepage_url),
                    template: 'LinkTemplate',
                    templateProps: {
                        href: item => item,
                        text: item => item,
                        ariaLabel: () => 'Open journal home page in a new tab',
                        title: 'Open journal home page in a new tab',
                    },
                },
            ],
            [
                {
                    heading: 'ISO abbreviated title',
                    fieldId: 'jnl-abbrev-title',
                    getData: journalDetails => getAbbrevTitle(journalDetails),
                    template: 'DefaultTemplate',
                },
            ],
            [
                {
                    heading: 'ISSN(s)',
                    fieldId: 'jnl-issn',
                    data: [
                        {
                            isArray: true,
                            primaryKey: 'fez_journal_issn',
                            path: [],
                        },
                    ],
                    template: 'MultiLinkTemplate',
                    templateProps: {
                        href: data =>
                            data.fez_ulrichs?.ulr_title_id &&
                            globalLocale.global.ulrichsLink.externalUrl.replace(
                                '[id]',
                                encodeURIComponent(data.fez_ulrichs?.ulr_title_id),
                            ),
                        text: data => data.jnl_issn,
                        ariaLabel: data => `ISSN ${data.jnl_issn} – view Ulrichs details in a new tab`,
                        title: 'View Ulrichs details in a new tab',
                    },
                },
            ],
            [
                {
                    heading: 'Publisher',
                    fieldId: 'jnl-publisher',
                    mergeData: true,
                    separator: ', ',
                    data: [
                        {
                            path: ['jnl_publisher'],
                        },
                        {
                            path: ['fez_journal_issn', 0, 'fez_ulrichs', 'ulr_country'],
                        },
                    ],
                    template: 'DefaultTemplate',
                },
            ],
            [
                {
                    heading: 'Refereed',
                    fieldId: 'jnl-is-refereed',
                    getData: journalDetails =>
                        journalDetails.jnl_is_refereed ||
                        findNestedValueInIssnArray(journalDetails.fez_journal_issn, 'fez_ulrichs.ulr_refereed'),
                    template: 'BooleanTemplate',
                },
            ],
            [
                {
                    heading: 'First year of publication',
                    fieldId: 'jnl-start-year',
                    getData: journalDetails =>
                        journalDetails.jnl_start_year ||
                        findNestedValueInIssnArray(journalDetails.fez_journal_issn, 'fez_ulrichs.ulr_start_year'),
                    template: 'DefaultTemplate',
                },
            ],
            [
                {
                    heading: 'Frequency of publication',
                    fieldId: 'jnl-frequency',
                    getData: journalDetails =>
                        journalDetails.jnl_frequency ||
                        findNestedValueInIssnArray(journalDetails.fez_journal_issn, 'fez_ulrichs.ulr_frequency'),
                    template: 'DefaultTemplate',
                },
            ],
            [
                {
                    heading: 'Journal formats available',
                    fieldId: 'jnl-formats',
                    getData: journalDetails =>
                        journalDetails.jnl_formats ||
                        (Array.isArray(journalDetails.fez_journal_issn) &&
                            journalDetails.fez_journal_issn
                                .map(issn => issn.fez_ulrichs?.ulr_formats)
                                .filter(format => !!format)
                                .join(', ')),
                    template: 'DefaultTemplate',
                },
            ],
            [
                {
                    heading: 'Description',
                    fieldId: 'jnl-description',
                    getData: journalDetails =>
                        journalDetails.jnl_description ||
                        findNestedValueInIssnArray(journalDetails.fez_journal_issn, 'fez_ulrichs.ulr_description'),
                    template: 'DefaultTemplate',
                },
            ],
            [
                {
                    heading: 'Type of journal',
                    fieldId: 'jnl-type',
                    getData: journalDetails => journalDetails,
                    template: 'LinkTemplate',
                    templateProps: {
                        href: journalDetails =>
                            !!journalDetails.fez_journal_doaj &&
                            getDoajUrl(journalDetails.fez_journal_doaj.jnl_doaj_issn),
                        text: journalDetails =>
                            !!journalDetails.fez_journal_doaj ? 'Fully Open Access' : 'Hybrid or Subscription',
                        ariaLabel: journalDetails =>
                            !!journalDetails.fez_journal_doaj ? 'Fully open access - open DOAJ page in a new tab' : '',
                    },
                },
            ],
        ],
    },
    openAccess: {
        title: viewJournalLocale.viewJournal.openAccess.title,
        help: viewJournalLocale.viewJournal.openAccess.help,
        rows: [
            [
                {
                    heading: 'Options',
                    fieldId: 'jnl-open-access',
                    getData: journalDetails =>
                        [
                            getIndicator({ type: types.published, data: journalDetails }),
                            getIndicator({ type: types.accepted, data: journalDetails }),
                        ].filter(item => item.element),
                    template: 'MultiValueTemplate',
                    templateProps: {
                        getData: item => (
                            <>
                                <span>{item.element}</span>
                                <span>
                                    {`${
                                        item.status === 'embargo' && !!item.embargoPeriod
                                            ? componentLocale.components.searchJournals.openAccessIndicators.tooltips[
                                                  item.type
                                              ][item.status](item.embargoPeriod)
                                            : componentLocale.components.searchJournals.openAccessIndicators.tooltips[
                                                  item.type
                                              ][item.status]
                                    } (${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Version)`}
                                </span>
                            </>
                        ),
                    },
                },
            ],
            [
                {
                    heading: viewJournalLocale.viewJournal.readAndPublish.heading,
                    fieldId: 'jnl-read-and-publish',
                    getData: journalDetails => {
                        if (
                            !journalDetails.fez_journal_read_and_publish ||
                            journalDetails.fez_journal_read_and_publish.jnl_read_and_publish_is_capped?.toLowerCase() ===
                                'nodeal'
                        ) {
                            return viewJournalLocale.viewJournal.readAndPublish.status.noAgreement;
                        } else if (
                            journalDetails.fez_journal_read_and_publish.jnl_read_and_publish_is_capped?.toLowerCase() ===
                            'exceeded'
                        ) {
                            return viewJournalLocale.viewJournal.readAndPublish.status.exceeded;
                        } else if (journalDetails.fez_journal_read_and_publish.jnl_read_and_publish_is_discounted) {
                            return viewJournalLocale.viewJournal.readAndPublish.status.discounted;
                        } else {
                            return viewJournalLocale.viewJournal.readAndPublish.status.capped;
                        }
                    },
                    template: 'DefaultTemplate',
                },
            ],
            [
                {
                    heading: viewJournalLocale.viewJournal.readAndPublish.caulLink.heading,
                    fieldId: 'jnl-read-and-publish-caul-link',
                    getData: journalDetails => {
                        return (
                            journalDetails.fez_journal_read_and_publish &&
                            (journalDetails.fez_journal_read_and_publish.jnl_read_and_publish_is_capped.toLowerCase() ===
                                'y' ||
                                journalDetails.fez_journal_read_and_publish.jnl_read_and_publish_is_capped.toLowerCase() ===
                                    'approaching')
                        );
                    },
                    template: 'EnclosedLinkTemplate',
                    templateProps: {
                        href: () => viewJournalLocale.viewJournal.readAndPublish.caulLink.externalUrl,
                        prefix: () => viewJournalLocale.viewJournal.readAndPublish.caulLink.prefix,
                        title: viewJournalLocale.viewJournal.readAndPublish.caulLink.ariaLabel,
                        text: () => viewJournalLocale.viewJournal.readAndPublish.caulLink.linkText,
                        ariaLabel: () => 'Open CAUl page to check current status of CAUL pre-paid APC in a new tab',
                    },
                },
            ],
            [
                {
                    heading: 'Article processing charges',
                    fieldId: 'jnl-doaj-apc-average-price',
                    getData: journalDetails => journalDetails.fez_journal_doaj,
                    template: 'LinkTemplate',
                    templateProps: {
                        href: doaj => getDoajUrl(doaj.jnl_doaj_issn),
                        text: doaj => `${doaj.jnl_doaj_apc_average_price} ${doaj.jnl_doaj_apc_currency}`,
                        ariaLabel: doaj =>
                            `APC ${doaj.jnl_doaj_apc_average_price} ${doaj.jnl_doaj_apc_currency} - Open DOAJ page for APC details in a new tab`,
                    },
                },
            ],
            [
                {
                    heading: 'Open access with Accepted manuscript',
                    fieldId: 'srm-journal-link',
                    getData: journalDetails =>
                        !journalDetails.fez_journal_doaj &&
                        journalDetails.fez_journal_issn &&
                        Array.isArray(journalDetails.fez_journal_issn) &&
                        journalDetails.fez_journal_issn.find(issn => issn?.fez_sherpa_romeo?.srm_max_embargo_amount),
                    template: 'LinkTemplate',
                    templateProps: {
                        href: item => item.fez_sherpa_romeo.srm_journal_link,
                        title: "Open journal's open access policy in a new tab",
                        ariaLabel: item =>
                            `${item.fez_sherpa_romeo.srm_max_embargo_amount} months embargo - Open journal's open access policy details in a new tab`,
                        text: item => `${item.fez_sherpa_romeo.srm_max_embargo_amount} months`,
                    },
                },
            ],
            [
                {
                    heading: 'Journal licence',
                    fieldId: 'jnl-doaj-by-sa-nd-nc',
                    getData: journalDetails =>
                        journalDetails.fez_journal_doaj && {
                            by: !!journalDetails.fez_journal_doaj.jnl_doaj_by,
                            sa: !!journalDetails.fez_journal_doaj.jnl_doaj_sa,
                            nd: !!journalDetails.fez_journal_doaj.jnl_doaj_nd,
                            nc: !!journalDetails.fez_journal_doaj.jnl_doaj_nc,
                        },
                    template: 'CreativeCommonsLicenceTemplate',
                },
            ],
        ],
    },
    discoverability: {
        title: viewJournalLocale.viewJournal.discoverability.title,
        help: viewJournalLocale.viewJournal.discoverability.help,
        rows: [
            [
                {
                    heading: 'Web of Science',
                    fieldId: 'wos-indexes',
                    getData: journalDetails => [
                        (!!journalDetails.fez_journal_jcr_ahci && 'Arts & Humanities Citation Index (AHCI)') ||
                            (!journalDetails.fez_journal_jcr_ahci &&
                                !journalDetails.fez_journal_jcr_esci &&
                                !journalDetails.fez_journal_jcr_scie &&
                                !journalDetails.fez_journal_jcr_ssci &&
                                'No'),
                        !!journalDetails.fez_journal_jcr_esci && 'Emerging Sources Citation Index (ESCI)',
                        !!journalDetails.fez_journal_jcr_scie && 'Science Citation Index Expanded (SCIE)',
                        !!journalDetails.fez_journal_jcr_ssci && 'Social Sciences Citation Index (SSCI)',
                    ],
                    template: 'MultiValueTemplate',
                    templateProps: {
                        getData: item => item,
                    },
                },
            ],
            [
                {
                    heading: 'Scopus',
                    fieldId: 'has-scopus',
                    getData: journalDetails => !!journalDetails.fez_journal_cite_score,
                    template: 'BooleanTemplate',
                },
            ],
            [
                {
                    heading: 'Pubmed',
                    fieldId: 'has-pubmed',
                    getData: journalDetails => !!journalDetails.fez_journal_pubmed,
                    template: 'BooleanTemplate',
                },
            ],
        ],
    },
    qualityByRanking: {
        key: ['fez_journal_jcr_merged', 'fez_journal_cite_score'],
        title: viewJournalLocale.viewJournal.qualityByRanking.title,
        help: viewJournalLocale.viewJournal.qualityByRanking.help,
        rows: [
            {
                tabs: {
                    key: 'fez_journal_jcr_merged',
                    heading: 'Journal Citations Report (Clarivate)',
                    fieldId: 'jnl-jcr-merged',
                    tabId: 'categories',
                    tabKey: 'categories',
                    tabTitle: 'category',
                    tabContent: {
                        rows: [
                            [
                                {
                                    heading: 'Quartile',
                                    fieldId: 'quartile',
                                    getData: jcrDetail => jcrDetail.quartile ?? 'N/A',
                                },
                            ],
                            [
                                {
                                    heading: 'Ranking',
                                    fieldId: 'ranking',
                                    getData: jcrDetail => jcrDetail.ranking ?? 'N/A',
                                },
                            ],
                        ],
                    },
                },
            },
            [
                {
                    heading: 'Impact factor',
                    fieldId: 'impact-factor',
                    data: [
                        {
                            path: ['fez_journal_jcr_merged', 'impact_factor'],
                        },
                    ],
                },
            ],
            {
                tabs: {
                    key: 'fez_journal_cite_score',
                    heading: 'CiteScore (Elsevier)',
                    fieldId: 'jnl-cite-score',
                    tabId: 'fez-journal-cite-score-asjc-code',
                    tabKey: 'fez_journal_cite_score_asjc_code',
                    tabTitle: 'jnl_cite_score_asjc_code_lookup',
                    tabContent: {
                        rows: [
                            [
                                {
                                    heading: 'Quartile',
                                    fieldId: 'jnl-cite-score-asjc-code-quartile',
                                    data: [
                                        {
                                            path: ['jnl_cite_score_asjc_code_quartile'],
                                        },
                                    ],
                                },
                            ],
                            [
                                {
                                    heading: 'Ranked',
                                    fieldId: 'jnl-cite-score-asjc-code-rank',
                                    mergeData: true,
                                    separator: ' out of ',
                                    data: [
                                        {
                                            path: ['jnl_cite_score_asjc_code_rank'],
                                        },
                                        {
                                            path: ['jnl_cite_score_asjc_code_rank_out_of'],
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                },
            },
            [
                {
                    heading: 'CiteScore',
                    fieldId: 'jnl-cite-score',
                    data: [
                        {
                            path: ['fez_journal_cite_score'],
                        },
                    ],
                    template: 'LinkTemplate',
                    templateProps: {
                        href: item =>
                            prefixByUrlResolver(`https://www.scopus.com/sourceid/${item.jnl_cite_score_source_id}`),
                        text: item => item.jnl_cite_score,
                        ariaLabel: item => `CiteScore ${item.jnl_cite_score} - Open record page in Scopus in a new tab`,
                        title: 'Open Scopus record page in a new tab',
                    },
                },
            ],
            [
                {
                    heading: 'SNIP',
                    fieldId: 'jnl-cite-score-snip',
                    data: [
                        {
                            path: ['fez_journal_cite_score', 'jnl_cite_score_snip'],
                        },
                    ],
                },
            ],
            [
                {
                    heading: 'SJR',
                    fieldId: 'jnl-cite-score-sjr',
                    data: [
                        {
                            path: ['fez_journal_cite_score', 'jnl_cite_score_sjr'],
                        },
                    ],
                },
            ],
        ],
    },
    listed: {
        title: viewJournalLocale.viewJournal.listed.title,
        help: viewJournalLocale.viewJournal.listed.help,
        rows: [
            [
                {
                    heading: 'Australian Business Deans Council (ABDC) Quality Rating',
                    fieldId: 'jnl-abdc-rating',
                    data: [
                        {
                            path: ['fez_journal_abdc', 'jnl_abdc_rating'],
                        },
                    ],
                },
            ],
            [
                {
                    heading: 'ABDC Field of Research',
                    fieldId: 'jnl-abdc-for-code-lookup',
                    data: [
                        {
                            path: ['fez_journal_abdc', 'jnl_abdc_for_code_lookup'],
                        },
                    ],
                },
            ],
            [
                {
                    heading: 'Nature Index',
                    fieldId: 'has-nature-index',
                    getData: journalDetails => !!journalDetails.fez_journal_nature_index,
                    template: 'BooleanTemplate',
                },
            ],
            [
                {
                    heading: 'Excellence in Research for Australia (ERA)',
                    fieldId: 'jnl-era-for-code-lookup',
                    data: [
                        {
                            path: ['fez_journal_era'],
                        },
                    ],
                    template: 'MultiValueTemplate',
                    templateProps: {
                        getData: item =>
                            `${item.jnl_era_source_year} - ${
                                (Array.isArray(item.fez_journal_era_for_code) &&
                                    item.fez_journal_era_for_code
                                        .map(code => code.jnl_era_for_code_lookup)
                                        .join(', ')) ||
                                ''
                            }`,
                    },
                },
            ],
            [
                {
                    heading: 'CWTS Leiden Ranking',
                    fieldId: 'has-cwts',
                    getData: journalDetails =>
                        Array.isArray(journalDetails.fez_journal_wos_category) &&
                        journalDetails.fez_journal_wos_category.some(
                            category => category.fez_journal_cwts && category.fez_journal_cwts.jnl_cwts_source_year,
                        ),
                    template: 'BooleanTemplate',
                },
            ],
        ],
    },
    uqConnections: {
        key: ['uq_author_id_count', 'fez_editorial_appointment'],
        title: viewJournalLocale.viewJournal.uqConnections.title,
        rows: [
            [
                {
                    heading: viewJournalLocale.viewJournal.uqConnections.authorCount.heading,
                    fieldId: 'jnl-uq-author-count',
                    getData: journalDetails => journalDetails.uq_author_id_count || '0',
                    template: 'DefaultTemplate',
                },
            ],
            [
                {
                    heading: viewJournalLocale.viewJournal.uqConnections.authorPublications.heading,
                    fieldId: 'jnl-uq-author-publications',
                    getData: journalDetails => {
                        return journalDetails.uq_author_id_count
                            ? { id: journalDetails.jnl_jid, count: journalDetails.uq_author_id_count }
                            : null;
                    },
                    template: 'LinkTemplate',
                    templateProps: {
                        href: item =>
                            item.count > 0
                                ? viewJournalLocale.viewJournal.uqConnections.authorPublications.externalUrl.replace(
                                      '[id]',
                                      item.id,
                                  )
                                : '',
                        text: item =>
                            item.count > 0
                                ? viewJournalLocale.viewJournal.uqConnections.authorPublications.linkText
                                : '',
                        ariaLabel: () => viewJournalLocale.viewJournal.uqConnections.authorPublications.ariaLabel,
                        title: viewJournalLocale.viewJournal.uqConnections.authorPublications.ariaLabel,
                    },
                },
            ],
            [
                {
                    heading: viewJournalLocale.viewJournal.uqConnections.editorialStaff.heading,
                    fieldId: 'jnl-editorial-staff',
                    data: [
                        {
                            isArray: true,
                            primaryKey: 'fez_editorial_appointment',
                            path: ['fez_author'],
                            filterFn: item => !!item.fez_author && !!item.fez_author.aut_display_name,
                        },
                    ],
                    template: 'MultiLinkTemplate',
                    templateProps: {
                        href: author => pathConfig.authorStatistics.url(author.aut_org_username),
                        text: author => author.aut_display_name,
                        title: viewJournalLocale.viewJournal.uqConnections.editorialStaff.tooltip,
                        ariaLabel: author =>
                            viewJournalLocale.viewJournal.uqConnections.editorialStaff.ariaLabel(author),
                    },
                },
            ],
        ],
    },
};
