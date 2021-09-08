import React from 'react';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';

// This prototype mutation allows us to return the smallest integer value in an array
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
        label: 'Journal publisher',
        size: 300,
        prefix: '',
        suffix: '',
        compactView: false,
        showTooltip: true,
        translateFn: data => {
            return data.jnl_publisher || 'NA';
        },
    },
    {
        key: 'fez_journal_doaj',
        label: 'Open access',
        size: 50,
        prefix: '',
        suffix: '',
        compactView: true,
        compactSize: 90,
        showTooltip: true,
        toolTipLabel: data => {
            return data.fez_journal_doaj ? 'Open access available' : 'Open access not available';
        },
        translateFn: data => {
            // Awaiting final logic for OA from MF/EA
            return data.fez_journal_doaj ? (
                <LockOpenIcon style={{ color: 'orange', marginTop: 6 }} />
            ) : (
                <LockIcon style={{ color: '#e5e5e5', marginTop: 6 }} />
            );
        },
    },
    {
        key: '',
        label: 'Highest quartile reached',
        size: 100,
        prefix: 'Q',
        suffix: '',
        compactView: true,
        compactSize: 200,
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
        compactView: false,
        showTooltip: false,
        translateFn: data => {
            return data.fez_journal_cite_score.jnl_cite_score || '';
        },
    },
    {
        key: 'jnl_cite_score_asjc_code_rank',
        label: 'CiteScore rank',
        size: 250,
        prefix: '',
        suffix: '',
        compactView: false,
        showTooltip: true,
        toolTipLabel: data => {
            let tooltip = undefined;
            if (data.fez_journal_cite_score.fez_journal_cite_score_asjc_code.length > 0) {
                tooltip = data.fez_journal_cite_score.fez_journal_cite_score_asjc_code.map(item => {
                    return `${item.jnl_cite_score_asjc_code_rank}/${
                        item.jnl_cite_score_asjc_code_rank_out_of
                    } for ${item.jnl_cite_score_asjc_code_lookup.replace(/[0-9]/g, '')}`;
                });
                tooltip = tooltip.join('  |  ');
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
                    return `${item.jnl_cite_score_asjc_code_rank}/${item.jnl_cite_score_asjc_code_rank_out_of}`;
                });
                label = label.join(' | ');
            }
            return label;
        },
    },
    {
        key: 'fez_journal_cite_score',
        label: 'CiteScore percentile',
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
                tooltip = tooltip.join(' | ');
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
                label = label.join(' | ');
            }
            return label;
        },
    },
    {
        key: 'jnl_jcr_scie_impact_factor',
        label: 'Impact factor',
        size: 100,
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
        key: 'jnl_jcr_scie_category_ranking',
        label: 'Impact factor rank',
        size: 150,
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
                    return `${item.jnl_jcr_scie_category_ranking} - ${item.jnl_jcr_scie_category_description_lookup}`;
                });
                label = label.join(' | ');
            } else if (
                data.fez_journal_jcr_ssci &&
                data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category &&
                data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category.length > 0
            ) {
                label = data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category.map(item => {
                    return `${item.jnl_jcr_ssci_category_ranking} - ${item.jnl_jcr_ssci_category_description_lookup}`;
                });
                label = label.join(' | ');
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
                    return item.jnl_jcr_scie_category_ranking;
                });
                label = label.join(' | ');
            } else if (
                data.fez_journal_jcr_ssci &&
                data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category &&
                data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category.length > 0
            ) {
                label = data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category.map(item => {
                    return item.jnl_jcr_ssci_category_ranking;
                });
                label = label.join(' | ');
            }
            return label;
        },
    },
    {
        key: 'jnl_jcr_scie_category_quartile',
        label: 'Journal impact factor percentile',
        size: 100,
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
                    return `${item.jnl_jcr_scie_category_quartile} - ${item.jnl_jcr_scie_category_description_lookup}`;
                });
                label = label.join(' | ');
            } else if (
                data.fez_journal_jcr_ssci &&
                data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category &&
                data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category.length > 0
            ) {
                label = data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category.map(item => {
                    return `${item.jnl_jcr_ssci_category_quartile} - ${item.jnl_jcr_ssci_category_description_lookup}`;
                });
                label = label.join(' | ');
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
                    return item.jnl_jcr_scie_category_quartile;
                });
                label = label.join(' | ');
            } else if (
                data.fez_journal_jcr_ssci &&
                data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category &&
                data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category.length > 0
            ) {
                label = data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category.map(item => {
                    return item.jnl_jcr_ssci_category_quartile;
                });
                label = label.join(' | ');
            }
            return label;
        },
    },
    {
        key: 'jnl_cite_score_snip',
        label: 'SNIP',
        size: 70,
        prefix: '',
        suffix: '',
        compactView: false,
        showTooltip: false,
        translateFn: data => {
            return data.fez_journal_cite_score.jnl_cite_score_snip || '';
        },
    },
    {
        key: 'jnl_cite_score_sjr',
        label: 'SJR',
        size: 70,
        prefix: '',
        suffix: '',
        compactView: false,
        showTooltip: false,
        translateFn: data => {
            return data.fez_journal_cite_score.jnl_cite_score_sjr || '';
        },
    },
];
