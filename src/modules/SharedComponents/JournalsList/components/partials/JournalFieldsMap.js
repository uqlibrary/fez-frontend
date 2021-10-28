import React from 'react';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

// This prototype mutation allows us to return the smallest integer value in an array
Array.min = array => {
    return Math.min.apply(Math, array);
};

export const JournalFieldsMap = [
    {
        key: 'jnl_title',
        label: 'Journal title',
        subLabel: '',
        size: 400, // Pixels width - can be anything.
        prefix: '',
        suffix: '',
        compactView: true, // Does this display in the minimal view?
        compactSize: 3, // Grid size - number between 1 and 12 - or set to boolean true to fill space left
        showTooltip: true,
        translateFn: data => {
            return data.jnl_title;
        },
    },
    {
        key: 'fez_journal_doaj',
        label: 'Open access',
        subLabel: '',
        size: 70,
        prefix: '',
        suffix: '',
        compactView: true,
        compactSize: 2,
        titleHelp: {
            title: 'Open Access',
            text: <p>Open access is free, online access to research</p>,
        },
        showTooltip: true,
        toolTipLabel: data => {
            return data.fez_journal_doaj ? 'Open access available' : 'Open access not available';
        },
        translateFn: data => {
            // Awaiting final logic for OA from MF/EA
            return data.fez_journal_doaj ? (
                <LockOpenIcon style={{ color: 'orange', marginTop: 12 }} />
            ) : (
                <LockOutlinedIcon style={{ color: '#e5e5e5', marginTop: 12 }} />
            );
        },
    },
    {
        key: '',
        label: 'Highest quartile',
        subLabel: 'Q1 is best',
        size: 120,
        prefix: 'Q',
        suffix: '',
        compactView: true,
        compactSize: 4,
        titleHelp: {
            title: 'Highest quartile',
            text: (
                <p>
                    Indicates the highest quartile that the journal has ranked in <b>any category</b> from Scopus or Web
                    of Science.
                </p>
            ),
        },
        showTooltip: true,
        titleTooltip: 'Journals ranked Q1 (highest) to Q4 (lowest) in the same subject category',
        toolTipLabel: () => {
            return 'Click on a journal title to view all';
        },
        translateFn: data => {
            const quartileList = [];

            if (
                data.fez_journal_cite_score &&
                data.fez_journal_cite_score.fez_journal_cite_score_asjc_code.length > 0
            ) {
                data.fez_journal_cite_score.fez_journal_cite_score_asjc_code.map(item => {
                    quartileList.push(parseInt(item.jnl_cite_score_asjc_code_quartile, 10));
                });
            }

            if (!!data.fez_journal_jcr_scie && data.fez_journal_jcr_scie.fez_journal_jcr_scie_category.length > 0) {
                data.fez_journal_jcr_scie.fez_journal_jcr_scie_category.map(item => {
                    quartileList.push(parseInt(item.jnl_jcr_scie_category_quartile.replace('Q', ''), 10));
                });
            }

            if (data.fez_journal_jcr_ssci && data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category.length > 0) {
                data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category.map(item => {
                    quartileList.push(parseInt(item.jnl_jcr_ssci_category_quartile.replace('Q', ''), 10));
                });
            }
            return quartileList.length > 0 ? Array.min(quartileList) : null;
        },
    },
    {
        key: 'jnl_cite_score',
        label: 'CiteScore',
        subLabel: 'higher is better',
        size: 120,
        prefix: '',
        suffix: '',
        compactView: false,
        titleHelp: {
            title: 'CiteScore',
            text: (
                <React.fragment>
                    <p>Scopus metric for journal citation impact. Updated annually.</p>
                    <p>Higher is better.</p>
                    <p>Not comparable across categories.</p>
                </React.fragment>
            ),
        },
        showTooltip: false,
        translateFn: data => {
            return (data.fez_journal_cite_score && data.fez_journal_cite_score.jnl_cite_score) || '';
        },
    },
    {
        key: 'fez_journal_cite_score',
        label: 'CiteScore percentile',
        subLabel: '100 is best',
        size: 250,
        prefix: '',
        suffix: '',
        compactView: false,
        titleHelp: {
            title: 'CiteScore percentile',
            text: (
                <React.fragment>
                    <p>CiteScore percentile indicating where a journal is ranked within a category.</p>
                    <p>E.g. 98 indicates that the journal is in a top 2% of its category.</p>
                    <p>Higher is better (0-99).</p>
                    <p>Comparable across categories.</p>
                </React.fragment>
            ),
        },
        showTooltip: true,
        toolTipLabel: data => {
            let tooltip = undefined;
            if (
                data.fez_journal_cite_score &&
                data.fez_journal_cite_score.fez_journal_cite_score_asjc_code &&
                data.fez_journal_cite_score.fez_journal_cite_score_asjc_code.length > 0
            ) {
                tooltip = data.fez_journal_cite_score.fez_journal_cite_score_asjc_code.map(item => {
                    return `${
                        item.jnl_cite_score_asjc_code_percentile
                    } - ${item.jnl_cite_score_asjc_code_lookup.replace(/[0-9]/g, '')}`;
                });
                tooltip = tooltip.join(', ');
            }
            return tooltip;
        },
        translateFn: data => {
            let label = undefined;
            if (
                data.fez_journal_cite_score &&
                data.fez_journal_cite_score.fez_journal_cite_score_asjc_code &&
                data.fez_journal_cite_score.fez_journal_cite_score_asjc_code.length > 0
            ) {
                label = data.fez_journal_cite_score.fez_journal_cite_score_asjc_code.map(item => {
                    return `${
                        item.jnl_cite_score_asjc_code_percentile
                    } - ${item.jnl_cite_score_asjc_code_lookup.replace(/[0-9]/g, '')}`;
                });
                label = label.join(', ');
            }
            return label;
        },
    },
    {
        key: 'jnl_jcr_scie_impact_factor',
        label: 'Impact factor',
        subLabel: 'higher is better',
        size: 110,
        prefix: '',
        suffix: '',
        compactView: false,
        titleHelp: {
            title: 'Impact factor',
            text: (
                <React.fragment>
                    <p>Web of Science metric for journal citation impact. Updated annually.</p>
                    <p>Higher is better (0-99).</p>
                    <p>Not comparable across categories.</p>
                </React.fragment>
            ),
        },
        showTooltip: false,
        translateFn: data => {
            return (
                (data.fez_journal_jcr_scie && data.fez_journal_jcr_scie.jnl_jcr_scie_impact_factor) ||
                (data.fez_journal_jcr_ssci && data.fez_journal_jcr_ssci.jnl_jcr_ssci_impact_factor) ||
                null
            );
        },
    },
    {
        key: 'jnl_jcr_scie_category_jif_percentile',
        label: 'Impact factor percentile',
        subLabel: 'higher is better',
        size: 250,
        prefix: '',
        suffix: '',
        compactView: false,
        titleHelp: {
            title: 'CiteScore percentile',
            text: (
                <React.fragment>
                    <p>Impact factor percentile indicating where a journal is ranked within a category.</p>
                    <p>E.g. So 89 indicates that the journal is in a top 11% of its category.</p>
                    <p>Higher is better (0-99).</p>
                    <p>Comparable across categories.</p>
                </React.fragment>
            ),
        },
        showTooltip: true,
        toolTipLabel: data => {
            let label = undefined;
            if (
                data.fez_journal_jcr_scie &&
                data.fez_journal_jcr_scie.fez_journal_jcr_scie_category &&
                data.fez_journal_jcr_scie.fez_journal_jcr_scie_category.length > 0
            ) {
                label = data.fez_journal_jcr_scie.fez_journal_jcr_scie_category.map(item => {
                    return `${item.jnl_jcr_scie_category_jif_percentile} - ${item.jnl_jcr_scie_category_description_lookup}`;
                });
                label = label.join(', ');
            } else if (
                data.fez_journal_jcr_ssci &&
                data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category &&
                data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category.length > 0
            ) {
                label = data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category.map(item => {
                    return `${item.jnl_jcr_ssci_category_jif_percentile} - ${item.jnl_jcr_ssci_category_description_lookup}`;
                });
                label = label.join(', ');
            }
            return label;
        },
        translateFn: data => {
            let label = undefined;
            if (
                data.fez_journal_jcr_scie &&
                data.fez_journal_jcr_scie.fez_journal_jcr_scie_category &&
                data.fez_journal_jcr_scie.fez_journal_jcr_scie_category.length > 0
            ) {
                label = data.fez_journal_jcr_scie.fez_journal_jcr_scie_category.map(item => {
                    return `${item.jnl_jcr_scie_category_jif_percentile} - ${item.jnl_jcr_scie_category_description_lookup}`;
                });
                label = label.join(', ');
            } else if (
                data.fez_journal_jcr_ssci &&
                data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category &&
                data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category.length > 0
            ) {
                label = data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category.map(item => {
                    return `${item.jnl_jcr_ssci_category_jif_percentile} - ${item.jnl_jcr_ssci_category_description_lookup}`;
                });
                label = label.join(', ');
            }
            return label;
        },
    },
    {
        key: 'jnl_cite_score_snip',
        label: 'SNIP',
        subLabel: 'higher is better',
        size: 120,
        prefix: '',
        suffix: '',
        compactView: false,
        titleHelp: {
            title: 'SNIP',
            text: (
                <React.fragment>
                    <p>Scopus journal citation impact metric adjusted for field-specific citation practices.</p>
                    <p>Higher is better;1 is average.</p>
                    <p>Designed to be comparable across categories.</p>
                </React.fragment>
            ),
        },
        showTooltip: false,
        translateFn: data => {
            return (data.fez_journal_cite_score && data.fez_journal_cite_score.jnl_cite_score_snip) || null;
        },
    },
    {
        key: 'jnl_cite_score_sjr',
        label: 'SJR',
        subLabel: 'higher is better',
        size: 120,
        prefix: '',
        suffix: '',
        compactView: false,
        titleHelp: {
            title: 'SJR',
            text: (
                <React.fragment>
                    <p>
                        Scopus journal citation impact metric that measures the prestige of citations recevied by a
                        journal.
                    </p>
                    <p>E.g. 98 indicates that the journal is in a top 2% of its category.</p>
                    <p>Higher is better.</p>
                    <p>Comparable across categories.</p>
                    <p>Recommended to use in Life and Health Science disciplines.</p>
                </React.fragment>
            ),
        },
        showTooltip: false,
        translateFn: data => {
            return (data.fez_journal_cite_score && data.fez_journal_cite_score.jnl_cite_score_sjr) || null;
        },
    },
];
