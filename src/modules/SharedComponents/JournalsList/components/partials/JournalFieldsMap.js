import React from 'react';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import JournalsOpenAccessIndicator from './JournalsOpenAccessIndicator';
import { sanitiseId } from 'helpers/general';
import { types, status, getIndicator } from './utils';
import locale from 'locale/components';

// This prototype mutation allows us to return the smallest integer value in an array
Array.min = array => {
    return Math.min.apply(Math, array);
};

const JournalFieldsMap = [
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
                        width: '10%',
                    },
                },
            },
            sizeHeader: {
                // width - can be anything.
                xs: 12,
                sm: 7,
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
        key: 'open_access',
        label: 'Open access',
        subLabel: '',
        size: 200,
        collapsibleComponent: {
            sizeHeader: {
                // width - can be anything.
                xs: 12,
                sm: 3,
            },
            sizeData: {
                // width - can be anything.
                xs: 12,
                sm: 3,
            },
            hiddenHeader: { display: { xs: 'none', sm: 'block' } },
            hiddenData: { display: { xs: 'block', sm: 'none' } },
            translateFn: (data, index, classes) => {
                return (
                    <Typography variant="body1" component="div">
                        <Box
                            key={data.key}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-end',
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{ ...classes?.inputLabel }}
                                component="span"
                                id={sanitiseId(`journal-list-header-${data.key}-${index}`)}
                                data-testid={sanitiseId(`journal-list-header-${data.key}-${index}`)}
                            >
                                {data.label}
                                {
                                    /* istanbul ignore next */ !!data.subLabel && (
                                        <Box component={'span'} sx={{ ...classes?.subLabel }}>
                                            {data.subLabel}
                                        </Box>
                                    )
                                }
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
                    <div>
                        <strong>Published version:</strong>
                    </div>
                    <Box
                        sx={{
                            listStyle: 'none',
                            padding: 0,
                            '& li': { paddingTop: 3, '&:last-of-type': { marginBottom: 3 } },
                        }}
                    >
                        <li key="published-open">
                            <JournalsOpenAccessIndicator type={types.published} status={status.open} />
                            The final, published version of the article is openly available for everyone to read
                            directly from the publisher. The article is available immediately after publication. No fees
                            are payable by the author.
                        </li>
                        <li key="published-open-diamond">
                            <JournalsOpenAccessIndicator type={types.published} status={status.open} showDiamond />
                            The final, published version of the article is openly available for everyone to read
                            directly from the community driven or institutional publisher, immediately after
                            publication. No fees are payable by the author.
                        </li>
                        <li key="published-open-s2o">
                            <JournalsOpenAccessIndicator type={types.published} status={status.open} showS2O />
                            The final, published version of the article is open access with no fees payable by the
                            author. Open access is enabled when enough institutions subscribe to the journal.
                        </li>
                        <li key="published-cap">
                            <JournalsOpenAccessIndicator type={types.published} status={status.cap} />
                            The final, published version of the article is openly available for everyone to read
                            directly from the publisher. The article is available immediately after publication. The
                            publisher offers a number of fee-free open access articles each year. No fees are payable by
                            the author while these fee-free articles are on offer. Once the fee-free cap has been
                            exceeded authors must pay a set fee, often called an Article Processing Charge.
                        </li>
                        <li key="published-fee">
                            <JournalsOpenAccessIndicator type={types.published} status={status.fee} />
                            The final, published version of the article is openly available for everyone to read
                            directly from the publisher. The article is available immediately after publication. The
                            author must pay a set fee for this, often called an Article Processing Charge.
                        </li>
                    </Box>
                    <div>
                        <strong>Accepted version:</strong>
                    </div>
                    <Box
                        sx={{
                            listStyle: 'none',
                            padding: 0,
                            '& li': { paddingTop: 3, '&:last-of-type': { marginBottom: 4 } },
                        }}
                    >
                        <li key="accepted-open">
                            <JournalsOpenAccessIndicator type={types.accepted} status={status.open} /> The accepted,
                            peer-reviewed version of the article can be made available for everyone to read
                            conditionally from UQ's repository, UQ eSpace. The article is available immediately after
                            uploading the author accepted manuscript to UQ eSpace. No fees are payable by the author.
                            The version deposited to UQ eSpace must be the author accepted manuscript.
                        </li>
                        <li key="accepted-embargo">
                            <JournalsOpenAccessIndicator type={types.accepted} status={status.embargo} />
                            The accepted, peer-reviewed version of the article can be made available for everyone to
                            read conditionally from UQ's repository, UQ eSpace. The article will be available after a
                            time-restricted embargo expires after uploading the author accepted manuscript to UQ eSpace.
                            No fees are payable by the author. The version deposited to UQ eSpace must be the author
                            accepted manuscript.
                        </li>
                    </Box>

                    <p>
                        Policies and agreements that inform these access conditions can change over time or be subject
                        to limits. Click on the individual journal titles for more information specific to that title.
                    </p>
                </>
            ),
        },
        showTooltip: false,
        translateFn: data => {
            const output = [];
            const tooltipLocale = locale.components.searchJournals.openAccessIndicators.tooltips;

            const { element: published, ...publishedProps } = getIndicator({
                type: types.published,
                data,
                tooltipLocale: tooltipLocale,
            });
            /* istanbul ignore else */
            if (published) {
                output.push(published);
            }
            /* istanbul ignore else */
            if (publishedProps.status !== status.open) {
                const { element: accepted, ...acceptedProps } = getIndicator({
                    type: types.accepted,
                    data,
                    tooltipLocale: tooltipLocale,
                });
                /* istanbul ignore else */
                if (acceptedProps.status) output.push(accepted);
            }
            return <>{output.map(item => item)}</>;
        },
    },
    {
        key: 'highest_quartile',
        label: 'Highest quartile',
        subLabel: '',
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
                        <Box
                            key={data.key}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-end',
                            }}
                        >
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
                                        {!!data.titleHelp && (
                                            <HelpIcon
                                                {...data.titleHelp}
                                                testId={`${data.key}-${index}`}
                                                iconSize={'small'}
                                            />
                                        )}
                                    </Box>
                                )}
                            </Typography>
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
                    quartileList.push(parseInt(item.jnl_jcr_scie_category_quartile?.replace('Q', ''), 10));
                });
            }

            if (data.fez_journal_jcr_ssci && data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category.length > 0) {
                data.fez_journal_jcr_ssci.fez_journal_jcr_ssci_category.map(item => {
                    quartileList.push(parseInt(item.jnl_jcr_ssci_category_quartile?.replace('Q', ''), 10));
                });
            }

            if (data.fez_journal_jcr_esci && data.fez_journal_jcr_esci.fez_journal_jcr_esci_category.length > 0) {
                data.fez_journal_jcr_esci.fez_journal_jcr_esci_category.map(item => {
                    quartileList.push(parseInt(item.jnl_jcr_esci_category_quartile?.replace('Q', ''), 10));
                });
            }

            if (data.fez_journal_jcr_ahci && data.fez_journal_jcr_ahci.fez_journal_jcr_ahci_category.length > 0) {
                data.fez_journal_jcr_ahci.fez_journal_jcr_ahci_category.map(item => {
                    quartileList.push(parseInt(item.jnl_jcr_ahci_category_quartile?.replace('Q', ''), 10));
                });
            }

            const filteredList = quartileList.filter(Number.isFinite);
            return filteredList.length > 0 ? Array.min(filteredList) : null;
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
export default JournalFieldsMap;
