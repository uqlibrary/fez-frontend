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
        size: 55,
        prefix: '',
        suffix: '',
        compactView: true,
        compactSize: 2,
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
        subLabel: '(Q1 is best)',
        size: 120,
        prefix: 'Q',
        suffix: '',
        compactView: true,
        compactSize: 2,
        showTooltip: false,
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
        subLabel: '(higher is better)',
        size: 120,
        prefix: '',
        suffix: '',
        compactView: false,
        showTooltip: false,
        translateFn: data => {
            return (data.fez_journal_cite_score && data.fez_journal_cite_score.jnl_cite_score) || '';
        },
    },
    {
        key: 'fez_journal_cite_score',
        label: 'CiteScore percentile',
        subLabel: '(100 is best)',
        size: 250,
        prefix: '',
        suffix: '',
        compactView: false,
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
        subLabel: '(higher is better)',
        size: 120,
        prefix: '',
        suffix: '',
        compactView: false,
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
        subLabel: '(higher is better)',
        size: 180,
        prefix: '',
        suffix: '',
        compactView: false,
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
        subLabel: '(higher is better)',
        size: 120,
        prefix: '',
        suffix: '',
        compactView: false,
        showTooltip: false,
        translateFn: data => {
            return (data.fez_journal_cite_score && data.fez_journal_cite_score.jnl_cite_score_snip) || null;
        },
    },
    {
        key: 'jnl_cite_score_sjr',
        label: 'SJR',
        subLabel: '(higher is better)',
        size: 120,
        prefix: '',
        suffix: '',
        compactView: false,
        showTooltip: false,
        translateFn: data => {
            return (data.fez_journal_cite_score && data.fez_journal_cite_score.jnl_cite_score_sjr) || null;
        },
    },
];
