import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

import pagesLocale from 'locale/pages';
import { default as globalLocale } from 'locale/global';

const renderJournalDetail = (detail, index, sizes) =>
    detail.data &&
    (!Array.isArray(detail.data) || detail.data.length > 0) && (
        <Grid container spacing={2} alignItems="flex-start" key={index}>
            {detail.title && (
                <Grid item component="span" {...sizes.title}>
                    <Typography component="span" variant="body2">
                        {detail.title}
                        {': '}
                    </Typography>
                </Grid>
            )}
            <Grid item component="span" {...sizes.data}>
                {detail.data}
            </Grid>
        </Grid>
    );

const nodeJoin = (arr, glue) => arr.slice(1).reduce((op, item) => op.concat([glue, item]), [arr[0]]);

const getBasicDetails = journalDetails => [
    {
        title: 'ISO abbreviated title',
        data:
            (journalDetails.fez_journal_jcr_scie && journalDetails.fez_journal_jcr_scie.jnl_jcr_scie_abbrev_title) ||
            (journalDetails.fez_journal_jcr_ssci && journalDetails.fez_journal_jcr_ssci.jnl_jcr_ssci_abbrev_title) ||
            (journalDetails.fez_journal_issn &&
                journalDetails.fez_journal_issn[0] &&
                journalDetails.fez_journal_issn[0].fez_ulrichs &&
                journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_abbrev_title),
    },
    {
        title: 'ISSN(s)',
        data:
            Array.isArray(journalDetails.fez_journal_issn) &&
            journalDetails.fez_journal_issn.length > 0 &&
            journalDetails.fez_journal_issn.map(issn => issn.jnl_issn).join(', '),
    },
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
    {
        title: 'Refereed',
        data:
            (journalDetails.fez_journal_issn &&
                journalDetails.fez_journal_issn[0] &&
                journalDetails.fez_journal_issn[0].fez_ulrichs &&
                journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_refereed &&
                'Yes') ||
            'No',
    },
    [
        {
            title: 'First year of publication',
            data:
                journalDetails.fez_journal_issn &&
                journalDetails.fez_journal_issn[0] &&
                journalDetails.fez_journal_issn[0].fez_ulrichs &&
                journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_start_year,
        },
        {
            title: 'Frequency of publication',
            data:
                journalDetails.fez_journal_issn &&
                journalDetails.fez_journal_issn[0] &&
                journalDetails.fez_journal_issn[0].fez_ulrichs &&
                journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_frequency,
        },
    ],
    {
        title: 'Journal formats available',
        data:
            journalDetails.fez_journal_issn &&
            journalDetails.fez_journal_issn[0] &&
            journalDetails.fez_journal_issn[0].fez_ulrichs &&
            journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_formats,
    },
    {
        title: 'Journal URL',
        data: journalDetails.fez_journal_issn &&
            journalDetails.fez_journal_issn[0] &&
            journalDetails.fez_journal_issn[0].fez_ulrichs &&
            journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access_url && (
                <ExternalLink href={journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access_url}>
                    {journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access_url}
                </ExternalLink>
            ),
    },
    {
        title: 'Description',
        data:
            journalDetails.fez_journal_issn &&
            journalDetails.fez_journal_issn[0] &&
            journalDetails.fez_journal_issn[0].fez_ulrichs &&
            journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_description,
    },
    {
        title: 'View journal in Ulrichs',
        data:
            Array.isArray(journalDetails.fez_journal_issn) &&
            journalDetails.fez_journal_issn.length > 0 &&
            nodeJoin(
                journalDetails.fez_journal_issn.map(
                    (issn, index) =>
                        issn.fez_ulrichs &&
                        issn.fez_ulrichs.ulr_title_id && (
                            <ExternalLink
                                key={index}
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
];

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
        title: 'DOAJ seal',
        data: (journalDetails.fez_journal_doaj && journalDetails.fez_journal_doaj.jnl_doaj_seal && 'Yes') || 'No',
    },
    {
        title: 'Last updated',
        data:
            journalDetails.fez_journal_doaj &&
            journalDetails.fez_journal_doaj.jnl_doaj_last_updated &&
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
                                    key={index}
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

const renderSectionContents = details =>
    details.map((detailRow, index) => {
        if (Array.isArray(detailRow)) {
            return (
                <Grid container spacing={0} alignItems="flex-start">
                    {detailRow.map((detailColumn, subIndex) => (
                        <Grid item xs={12} sm style={{ padding: '8px 8px 8px 0' }} key={`${index}-${subIndex}`}>
                            {renderJournalDetail(detailColumn, `${index}-${subIndex}`, {
                                title: { xs: 'auto' },
                                data: { xs: 'auto' },
                            })}
                        </Grid>
                    ))}
                </Grid>
            );
        }
        return renderJournalDetail(detailRow, index, {
            title: { xs: 12, sm: 6, md: 3 },
            data: { xs: 'auto' },
        });
    });

export const JournalView = ({ journalDetails, journalLoading, journalLoadingError, actions, match }) => {
    React.useEffect(() => {
        !journalDetails && !journalLoading && !journalLoadingError && actions.loadJournal(match.params.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const txt = pagesLocale.pages.journal.view;
    if (journalLoadingError) {
        return <Alert {...txt.loadFailureAlert} />;
    } else if (journalLoading || !journalDetails) {
        return <InlineLoader message={txt.loadingMessage} />;
    } else {
        return (
            <StandardPage standardPageId="journal-view" title={journalDetails.jnl_title || ''}>
                <StandardCard standardCardId="journal-basic-details" noHeader>
                    {renderSectionContents(getBasicDetails(journalDetails))}
                </StandardCard>
                <br />
                <StandardCard
                    standardCardId="journal-open-access"
                    title="Open Access (Directory of Open Access Journals - DOAJ)"
                >
                    {renderSectionContents(getOADetails(journalDetails))}
                </StandardCard>
                <h3>Raw API response output</h3>
                <pre>{JSON.stringify(journalDetails, null, 2)}</pre>
            </StandardPage>
        );
    }
};

JournalView.propTypes = {
    journalDetails: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    journalLoading: PropTypes.bool,
    journalLoadingError: PropTypes.bool,
    actions: PropTypes.object,
    match: PropTypes.object,
};

export default JournalView;
