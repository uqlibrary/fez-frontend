import React from 'react';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { sanitiseId } from 'helpers/general';

// This prototype mutation allows us to return the smallest integer value in an array
Array.min = array => {
    return Math.min.apply(Math, array);
};

export const JournalFieldsMap = [
    {
        key: 'jnl_title',
        label: 'Journal title',
        subLabel: '',
        collapsibleComponent: {
            actionsCol: {
                xs: {
                    width: '10%',
                    padding: '6px',
                },
                selectable: {
                    xs: {
                        width: '30%',
                        padding: '6px',
                    },
                    sm: {
                        width: '15%',
                    },
                },
            },
            sizeHeader: {
                // width - can be anything.
                xs: 12,
                sm: 8,
            },
        },
        size: {
            // width - can be anything.
            xs: 'auto',
            sm: 'auto',
            md: '55%',
            lg: '60%',
            xl: '60%',
        },
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
        size: 75,
        collapsibleComponent: {
            sizeHeader: {
                // width - can be anything.
                xs: 12,
                sm: 2,
            },
            sizeData: {
                // width - can be anything.
                xs: 12,
                sm: 2,
            },
            hiddenHeader: { display: { xs: 'none', sm: 'block' } },
            hiddenData: { display: { xs: 'block', sm: 'none' } },
            translateFn: (data, index, classes) => {
                return (
                    <Typography variant="body1" component="div">
                        <Box display="flex" alignItems="flex-end" key={data.key}>
                            <Typography
                                variant="body1"
                                sx={{ ...classes?.inputLabel }}
                                component="span"
                                id={sanitiseId(`journal-list-header-${data.key}-${index}`)}
                                data-testid={sanitiseId(`journal-list-header-${data.key}-${index}`)}
                            >
                                {data.label}
                                {/* istanbul ignore next */ !!data.subLabel && (
                                    <Box component={'span'} sx={{ ...classes?.subLabel }}>
                                        {data.subLabel}
                                    </Box>
                                )}
                            </Typography>
                            {!!data.titleHelp && (
                                <HelpIcon {...data.titleHelp} testId={`${data.key}-${index}`} iconSize={'small'} />
                            )}
                        </Box>
                    </Typography>
                );
            },
        },
        prefix: '',
        suffix: '',
        compactView: true,
        compactSize: 2,
        titleHelp: {
            title: 'Open Access',
            text: (
                <>
                    <p>
                        <b>Gold open access:</b> A freely accessible, final version of a publication is available for
                        everyone to read immediately after publication.
                    </p>
                    <p>
                        For other pathways:
                        <ul>
                            <li>
                                Use the <b>open access: accepted version</b> filter to sort journals by length of
                                embargo period after which a self-archived or author accepted manuscript can be made
                                available via UQ eSpace. (Green open access).
                            </li>
                            <li>
                                Use the <b>open access: published version</b> filter to include or exclude charges
                                (APCs) which are paid to a publisher to make a publication immediately available and
                                openly accessible. Some APCs may be pre-paid or discounted, if the Library has
                                negotiated a{' '}
                                <a href={'https://web.library.uq.edu.au/read-and-publish-agreements'} target={'_blank'}>
                                    read and publish agreement
                                </a>
                                .
                            </li>
                        </ul>
                    </p>
                    <p>
                        Policies and agreements can change over time or be subject to limits. Click on the journal title
                        for more information.
                    </p>
                </>
            ),
        },
        showTooltip: true,
        toolTipLabel: data => {
            return data.fez_journal_doaj ? 'Open access journal' : 'Use filters to find alternate pathways';
        },
        translateFn: (data, classes) => {
            return data.fez_journal_doaj ? (
                <LockOpenIcon sx={{ ...(classes?.iconOpen ?? { color: 'orange', marginTop: '12px' }) }} />
            ) : (
                <LockOutlinedIcon sx={{ ...(classes?.iconClosed ?? { color: '#e5e5e5', marginTop: '12px' }) }} />
            );
        },
    },
    {
        key: 'highest_quartile',
        label: 'Highest quartile',
        subLabel: 'Q1 is best',
        collapsibleComponent: {
            sizeHeader: {
                // width - can be anything.
                xs: 12,
                sm: 2,
            },
            sizeData: {
                // width - can be anything.
                xs: 12,
                sm: 2,
            },
            hiddenHeader: { display: { xs: 'none', sm: 'block' } },
            hiddenData: { display: { xs: 'block', sm: 'none' } },
            translateFn: (data, index, classes) => {
                return (
                    <Typography variant="body1" component="div">
                        <Box display="flex" alignItems="flex-end" key={data.key}>
                            <Typography
                                variant="body1"
                                sx={{ ...classes?.inputLabel }}
                                component="span"
                                id={sanitiseId(`journal-list-header-${data.key}-${index}`)}
                                data-testid={sanitiseId(`journal-list-header-${data.key}-${index}`)}
                            >
                                {data.label}
                                {!!data.subLabel && (
                                    <Box component={'span'} sx={{ ...classes?.subLabel }}>
                                        {data.subLabel}
                                    </Box>
                                )}
                            </Typography>
                            {!!data.titleHelp && (
                                <HelpIcon {...data.titleHelp} testId={`${data.key}-${index}`} iconSize={'small'} />
                            )}
                        </Box>
                    </Typography>
                );
            },
        },
        size: 125,
        prefix: 'Q',
        suffix: '',
        compactView: true,
        compactSize: 4,
        titleHelp: {
            title: 'Highest quartile',
            text: (
                <>
                    <p>
                        Indicates the highest quartile that the journal has ranked in <b>any subject category</b> from
                        Scopus <b>or</b> Web of Science.
                    </p>
                    <p>Journals ranked Q1 (highest) to Q4 (lowest) in the same subject category</p>
                </>
            ),
        },
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
        subLabel: 'higher is better',
        size: 125,
        prefix: '',
        suffix: '',
        compactView: false,
        titleHelp: {
            title: 'CiteScore',
            text: (
                <>
                    <p>
                        Scopus metric for journal citation impact. Updated annually. <b>Not</b> comparable across
                        subject categories.
                    </p>
                    <p>Higher is better.</p>
                </>
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
        size: 255,
        prefix: '',
        suffix: '',
        compactView: false,
        titleHelp: {
            title: 'CiteScore percentile',
            text: (
                <>
                    <p>
                        CiteScore percentile indicating where a journal is ranked within a subject category. Comparable
                        across subject categories.
                    </p>
                    <p>Higher is better e.g. 98 means journal is in the top 2% of its subject category.</p>
                </>
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
        size: 115,
        prefix: '',
        suffix: '',
        compactView: false,
        titleHelp: {
            title: 'Impact factor',
            text: (
                <>
                    <p>
                        Web of Science metric for journal citation impact. Updated annually. <b>Not</b> comparable
                        across subject categories.
                    </p>
                    <p>Higher is better.</p>
                </>
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
        size: 255,
        prefix: '',
        suffix: '',
        compactView: false,
        titleHelp: {
            title: 'Impact factor percentile',
            text: (
                <>
                    <p>
                        Impact factor percentile, indicating where a journal is ranked within a subject category.
                        Comparable across subject categories.
                    </p>
                    <p>
                        Higher is better e.g. 90 indicates that the journal is in the top 10% of its subject category.
                    </p>
                </>
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
        size: 125,
        prefix: '',
        suffix: '',
        compactView: false,
        titleHelp: {
            title: 'SNIP',
            text: (
                <>
                    <p>
                        Scopus journal citation impact metric adjusted for field-specific citation practices. Comparable
                        across subject categories.
                    </p>
                    <p>
                        A journal with a SNIP of 1.0 has the median (not mean) number of citations for journals in that
                        field.
                    </p>
                </>
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
        size: 125,
        prefix: '',
        suffix: '',
        compactView: false,
        titleHelp: {
            title: 'SJR',
            text: (
                <>
                    <p>
                        Scopus journal citation impact metric that measures the prestige of citations received by a
                        journal. Comparable across subject categories. Recommended for use in Life and Health Science
                        disciplines.
                    </p>
                    <p>Higher is better.</p>
                </>
            ),
        },
        showTooltip: false,
        translateFn: data => {
            return (data.fez_journal_cite_score && data.fez_journal_cite_score.jnl_cite_score_sjr) || null;
        },
    },
];
