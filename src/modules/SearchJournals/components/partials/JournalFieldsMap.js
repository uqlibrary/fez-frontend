import React from 'react';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';

// This small prototype mutation allows us to return the smallest integer value in an array
Array.min = array => {
    return Math.min.apply(Math, array);
};

export const JournalFieldsMap = [
    {
        key: 'jnl_title',
        label: 'Journal title',
        size: 300,
        prefix: '',
        suffix: '',
        compactView: true,
        showTooltip: true,
        translateFn: data => {
            return data.jnl_title;
        },
    },
    {
        key: 'jnl_publisher',
        // This one needs some padding to appear correct
        label: <span style={{ paddingLeft: 12 }}>Journal publisher</span>,
        size: 300,
        prefix: '',
        suffix: '',
        compactView: true,
        showTooltip: true,
        translateFn: data => {
            return data.jnl_publisher || 'NA';
        },
    },
    {
        key: 'fez_journal_doaj',
        label: 'OA',
        size: 50,
        prefix: '',
        suffix: '',
        compactView: true,
        showTooltip: true,
        toolTipLabel: data => {
            return data.fez_journal_doaj ? 'Open access available' : 'Open access not available';
        },
        translateFn: data => {
            // Awaiting logic for OA from MF
            return data.fez_journal_doaj ? (
                <LockOpenIcon style={{ color: 'orange', marginTop: 6 }} />
            ) : (
                <LockIcon style={{ color: '#CCC', marginTop: 6 }} />
            );
        },
    },
    {
        key: '',
        label: 'Highest quartile reached',
        size: 70,
        prefix: 'Q',
        suffix: '',
        compactView: true,
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
            return Array.min(quartileList);
        },
    },
    {
        key: 'jnl_cite_score',
        label: 'CiteScore',
        size: 70,
        prefix: '',
        suffix: '',
        compactView: true,
        showTooltip: false,
        translateFn: data => {
            return data.fez_journal_cite_score.jnl_cite_score || '';
        },
    },
    {
        key: 'jnl_cite_score_asjc_code_rank',
        label: 'CiteScore rank',
        size: 125,
        prefix: '',
        suffix: '',
        compactView: true,
        showTooltip: true,
        toolTipLabel: data => {
            let tooltip = undefined;
            if (data.fez_journal_cite_score.fez_journal_cite_score_asjc_code.length > 0) {
                tooltip = data.fez_journal_cite_score.fez_journal_cite_score_asjc_code.map(item => {
                    return `${item.jnl_cite_score_asjc_code_rank} out of ${item.jnl_cite_score_asjc_code_rank_out_of} for ${item.jnl_cite_score_asjc_code_lookup}`;
                });
                tooltip = tooltip.join('  |  ');
            }
            return tooltip;
        },
        translateFn: data => {
            let label = undefined;
            if (data.fez_journal_cite_score.fez_journal_cite_score_asjc_code.length > 0) {
                label = data.fez_journal_cite_score.fez_journal_cite_score_asjc_code.map(item => {
                    return `${item.jnl_cite_score_asjc_code_rank} of ${item.jnl_cite_score_asjc_code_rank_out_of}`;
                });
                label = label.join(' | ');
            }
            return label;
        },
    },
];
