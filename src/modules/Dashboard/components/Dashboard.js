import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';

import { OrcidSyncContext } from 'context';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import {
    AuthorsPublicationsPerYearChart,
    AuthorsPublicationTypesCountChart,
} from 'modules/SharedComponents/Toolbox/Charts';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { MyTrendingPublications } from 'modules/SharedComponents/MyTrendingPublications';
import { MyLatestPublications } from 'modules/SharedComponents/MyLatestPublications';
import DashboardAuthorProfile from './DashboardAuthorProfile';
import { PublicationStats } from 'modules/SharedComponents/PublicationStats';

import { pathConfig } from 'config/pathConfig';
import locale from 'locale/pages';

import { mui1theme as theme } from 'config';
import { useIsMobileView } from 'hooks';
import { ConfirmDialogBox } from '../../SharedComponents/Toolbox/ConfirmDialogBox';

const StyledTabs = styled(Tabs)(({ theme }) => ({
    [theme.breakpoints.up('sm')]: {
        margin: '-16px -16px',
    },
    [theme.breakpoints.down('sm')]: {
        margin: -16,
    },
    backgroundColor: theme.palette.primary.main,
    borderRadius: '4px 4px 0px 0px',
    '& .MuiTabs-indicator': {
        height: 4,
        backgroundColor: theme.palette.accent.main,
    },
}));
const StyledTab = styled(Tab)(({ theme }) => ({
    color: theme.palette.white.main,
}));

/**
 * Returns the Fibonacci number for given iteration.
 *
 * Note: Looping is faster & more efficient than recursion here.
 *
 * @param {number} iteration
 */
export const fibonacci = (iteration, from = 0) => {
    let a = 1;
    let b = from;
    let temp;
    let num = iteration;

    while (num > 0) {
        temp = a;
        a = a + b;
        b = temp;
        num--;
    }

    return b;
};

export const isWaitingForSync = orcidSyncStatus =>
    ['Pending', 'In Progress'].indexOf((orcidSyncStatus || /* istanbul ignore next */ {}).orj_status) > -1;

const Dashboard = ({
    account,
    authorDetails,
    author,
    accountAuthorDetailsLoading,
    accountAuthorSaving,
    accountAuthorError,

    // graph data
    loadingPublicationsByYear,
    publicationsByYear,
    publicationTypesCount,

    // lure data
    possiblyYourPublicationsCount,
    possiblyYourPublicationsCountLoading,
    hidePossiblyYourPublicationsLure,

    // incomplete Record lure
    incomplete,

    // wos/scopus data
    loadingPublicationsStats,
    publicationsStats,

    // show latest/trending publications tab
    showLatestPublicationsTab,
    showTrendingPublicationsTab,

    // navigations, app actions
    actions,

    // orcid sync
    loadingOrcidSyncStatus,
    orcidSyncStatus,
    requestingOrcidSync,
    orcidSyncEnabled,
    loadOrcidSyncDelay = 5,
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isMobileView = useIsMobileView();
    const [dashboardPubsTabs, setDashboardPubsTabs] = useState(1);
    const [orcidSyncStatusRefreshCount, setOrcidSyncStatusRefreshCount] = useState(0);
    const [lastOrcidSyncScheduledRequest, setLastOrcidSyncScheduledRequest] = useState();

    const _loadOrcidSync = (waitTime = 1) => {
        // considering loadOrcidSyncDelay props, we have to clear any previously scheduled requests
        !!lastOrcidSyncScheduledRequest && global.clearTimeout(lastOrcidSyncScheduledRequest);
        const timeoutId = global.setTimeout(
            () =>
                !loadingOrcidSyncStatus &&
                orcidSyncEnabled &&
                (orcidSyncStatus === null || !!waitTime) &&
                actions &&
                actions.loadOrcidSyncStatus &&
                actions.loadOrcidSyncStatus(),
            waitTime * loadOrcidSyncDelay * 1000,
        );
        setLastOrcidSyncScheduledRequest(timeoutId);
    };

    // A repeating check for latest status that gets progressively longer
    const _waitForSyncSuccess = () => {
        isWaitingForSync(orcidSyncStatus) && setOrcidSyncStatusRefreshCount(orcidSyncStatusRefreshCount + 1);
    };

    useEffect(() => {
        _loadOrcidSync(fibonacci(orcidSyncStatusRefreshCount, 1));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orcidSyncStatusRefreshCount]);

    useEffect(() => {
        _loadOrcidSync();
        setOrcidSyncStatusRefreshCount(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orcidSyncEnabled]);

    useEffect(() => {
        !loadingOrcidSyncStatus && _waitForSyncSuccess();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingOrcidSyncStatus]);

    const _claimYourPublications = () => {
        navigate(pathConfig.records.possible);
    };

    const _addPublication = () => {
        navigate(pathConfig.records.add.find);
    };

    const handleTabChange = (event, value) => {
        setDashboardPubsTabs(value);
    };

    const redirectToIncompleteRecordlist = () => {
        navigate(pathConfig.records.incomplete);
    };

    const requestOrcidSync = () => {
        actions && actions.requestOrcidSync && actions.requestOrcidSync();
    };

    const renderAuthorProfile = () => (
        <Grid item xs={12}>
            {location.state?.showOrcidLinkingConfirmation && (
                <ConfirmDialogBox
                    locale={{
                        confirmationTitle: locale.pages.orcidLink.successAlert.title,
                        confirmationMessage: locale.pages.orcidLink.successAlert.message,
                        confirmButtonLabel: 'OK',
                    }}
                    hideCancelButton
                    isOpen
                />
            )}
            <OrcidSyncContext.Provider
                value={{
                    orcidSyncProps: {
                        author,
                        accountAuthorSaving,
                        accountAuthorError,
                        orcidSyncEnabled,
                        orcidSyncStatus,
                        requestingOrcidSync,
                        requestOrcidSync,
                    },
                }}
            >
                <DashboardAuthorProfile authorDetails={authorDetails} author={author} />
            </OrcidSyncContext.Provider>
        </Grid>
    );

    const getActualLowestYear = (citationCount, authorDetails) => {
        return citationCount.replace(
            '1000',
            !!authorDetails.espace && !!authorDetails.espace.first_year ? authorDetails.espace.first_year : 'N/A',
        );
    };

    const txt = locale.pages.dashboard;
    const loading =
        // nothing to load for non author users
        !!author?.aut_id && (loadingPublicationsByYear || accountAuthorDetailsLoading || loadingPublicationsStats);
    const userHasPublications = authorDetails && authorDetails.espace && authorDetails.espace.doc_count > 0;
    const barChart =
        !loading && !isMobileView && publicationsByYear && publicationsByYear.series.length > 0 ? (
            <StandardCard
                className="barChart"
                title={txt.publicationsByYearChart.title}
                customBackgroundColor={theme.graphs.color2}
                customTitleColor={theme.palette.white.main}
            >
                <AuthorsPublicationsPerYearChart
                    className="barChart"
                    {...publicationsByYear}
                    yAxisTitle={txt.publicationsByYearChart.yAxisTitle}
                />
            </StandardCard>
        ) : null;
    const donutChart =
        !loading && !isMobileView && publicationTypesCount && publicationTypesCount.length > 0 ? (
            <StandardCard
                fullHeight
                noPadding
                customBackgroundColor={theme.graphs.color1}
                customTitleColor={theme.palette.white.main}
                className="donutChart"
                title={txt.publicationTypesCountChart.title}
            >
                <AuthorsPublicationTypesCountChart
                    className="donutChart"
                    series={[
                        {
                            name: txt.publicationTypesCountChart.title,
                            data: publicationTypesCount,
                        },
                    ]}
                />
            </StandardCard>
        ) : null;

    /**
     * where the 1000-01-01 date is provided as the lowest date, we replace it with the authorDetails date
     */
    const cleanPublicationsStats = publicationsStats => {
        const theAuthorDetails = (!!authorDetails && authorDetails) || {};

        if (
            !!publicationsStats.scopus_citation_count_i &&
            !!publicationsStats.scopus_citation_count_i.years &&
            publicationsStats.scopus_citation_count_i.years.substring(0, 4) === '1000'
        ) {
            publicationsStats.scopus_citation_count_i.years = getActualLowestYear(
                publicationsStats.scopus_citation_count_i.years,
                theAuthorDetails,
            );
        }
        if (
            !!publicationsStats.thomson_citation_count_i &&
            !!publicationsStats.thomson_citation_count_i.years &&
            publicationsStats.thomson_citation_count_i.years.substring(0, 4) === '1000'
        ) {
            publicationsStats.thomson_citation_count_i.years = getActualLowestYear(
                publicationsStats.thomson_citation_count_i.years,
                theAuthorDetails,
            );
        }
        return publicationsStats;
    };

    const publicationStats =
        !loading &&
        publicationsStats &&
        (publicationsStats.thomson_citation_count_i.count > 0 ||
            publicationsStats.scopus_citation_count_i.count > 0) ? (
            <StandardCard noPadding noHeader fullHeight>
                <PublicationStats publicationsStats={cleanPublicationsStats(publicationsStats)} />
            </StandardCard>
        ) : null;
    const pluralTextReplacement =
        incomplete && incomplete.publicationsListPagingData && incomplete.publicationsListPagingData.total > 1
            ? 's'
            : '';
    const verbEndingTextReplacement =
        incomplete && incomplete.publicationsListPagingData && incomplete.publicationsListPagingData.total > 1
            ? ''
            : 's';
    const isAdmin =
        authorDetails && (authorDetails.is_administrator === 1 || authorDetails.is_super_administrator === 1);

    useEffect(() => {
        if (account && account.id && author?.aut_id) {
            // don't call the api for non author users since the api call requires an author
            actions.countPossiblyYourPublications(account.id);
            actions.loadAuthorPublicationsStats(account.id, authorDetails);
            !incomplete.publicationsList.length && actions.searchAuthorPublications({}, 'incomplete');
            _loadOrcidSync();
            setOrcidSyncStatusRefreshCount(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <StandardPage>
            <Grid container spacing={3}>
                {loading && (
                    <React.Fragment>
                        <Grid item xs />
                        <Grid item>
                            <InlineLoader message={txt.loading} />
                        </Grid>
                        <Grid item xs />
                    </React.Fragment>
                )}
                {!loading && authorDetails && (
                    <React.Fragment>
                        {!!txt.incompleteRecordLure &&
                            !!incomplete &&
                            !incomplete.loadingPublicationsList &&
                            incomplete.publicationsListPagingData &&
                            incomplete.publicationsListPagingData.total > 0 && (
                                <Grid item xs={12} style={{ marginTop: -27 }}>
                                    <Alert
                                        title={txt.incompleteRecordLure.title}
                                        message={txt.incompleteRecordLure.message
                                            .replace('[count]', incomplete.publicationsListPagingData.total)
                                            .replace('[plural]', pluralTextReplacement)
                                            .replace('[verbEnding]', verbEndingTextReplacement)}
                                        type={txt.incompleteRecordLure.type}
                                        actionButtonLabel={txt.incompleteRecordLure.actionButtonLabel}
                                        action={redirectToIncompleteRecordlist}
                                    />
                                </Grid>
                            )}
                        {renderAuthorProfile()}
                        {!hidePossiblyYourPublicationsLure &&
                        !possiblyYourPublicationsCountLoading &&
                        possiblyYourPublicationsCount > 0 ? (
                            <Grid item xs={12} style={{ marginTop: -27 }}>
                                <Alert
                                    title={txt.possiblePublicationsLure.title}
                                    message={txt.possiblePublicationsLure.message.replace(
                                        '[count]',
                                        possiblyYourPublicationsCount,
                                    )}
                                    type={txt.possiblePublicationsLure.type}
                                    actionButtonLabel={txt.possiblePublicationsLure.actionButtonLabel}
                                    action={_claimYourPublications}
                                    allowDismiss
                                    dismissAction={actions.hidePossiblyYourPublicationsLure}
                                />
                            </Grid>
                        ) : (
                            !possiblyYourPublicationsCountLoading &&
                            !hidePossiblyYourPublicationsLure &&
                            !possiblyYourPublicationsCount && (
                                <Grid item xs={12} style={{ marginTop: -27 }}>
                                    <Alert {...txt.nothingToClaimLure} action={_addPublication} />
                                </Grid>
                            )
                        )}
                    </React.Fragment>
                )}
                {/* render charts/stats depending on availability of data */}
                {barChart && (publicationStats || (!donutChart && !publicationStats)) && (
                    <Grid item xs={12}>
                        {barChart}
                    </Grid>
                )}
                {/* render publication stats full width if donut chart not available */}
                {publicationStats && !donutChart && (
                    <Grid item xs={12}>
                        {publicationStats}
                    </Grid>
                )}
                {/* render bar chart next to donut chart if publication stats not available */}
                {barChart && donutChart && !publicationStats && (
                    <React.Fragment>
                        <Grid item xs={12} sm={8}>
                            {barChart}
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            {donutChart}
                        </Grid>
                    </React.Fragment>
                )}
                {/* render donut chart next to publication stats if both available */}
                {donutChart && publicationStats && (
                    <React.Fragment>
                        <Grid item xs={12} sm={4}>
                            {donutChart}
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            {publicationStats}
                        </Grid>
                    </React.Fragment>
                )}
                {!loading && userHasPublications && (showLatestPublicationsTab || showTrendingPublicationsTab) && (
                    <Grid item xs={12}>
                        <StandardCard noHeader>
                            <StyledTabs
                                value={dashboardPubsTabs}
                                onChange={handleTabChange}
                                variant="fullWidth"
                                centered
                                indicatorColor="primary"
                                textColor="inherit"
                            >
                                {showLatestPublicationsTab && (
                                    <StyledTab key={1} label={txt.myLatestPublications.title} value={1} />
                                )}
                                {showTrendingPublicationsTab && (
                                    <StyledTab key={2} label={txt.myTrendingPublications.title} value={2} />
                                )}
                            </StyledTabs>
                            <Grid container spacing={3} style={{ marginTop: 24 }}>
                                {showLatestPublicationsTab && (
                                    <Grid item xs={12} style={dashboardPubsTabs !== 1 ? { display: 'none' } : {}}>
                                        <MyLatestPublications isAdmin={!!isAdmin} />
                                    </Grid>
                                )}
                                {showTrendingPublicationsTab && (
                                    <Grid item xs={12} style={dashboardPubsTabs !== 2 ? { display: 'none' } : {}}>
                                        <MyTrendingPublications />
                                    </Grid>
                                )}
                            </Grid>
                        </StandardCard>
                    </Grid>
                )}
            </Grid>
        </StandardPage>
    );
};

Dashboard.propTypes = {
    // account data
    account: PropTypes.object.isRequired,
    authorDetails: PropTypes.object,
    author: PropTypes.object,
    accountAuthorDetailsLoading: PropTypes.bool,
    accountAuthorSaving: PropTypes.bool,
    accountAuthorError: PropTypes.bool,

    // graph data
    loadingPublicationsByYear: PropTypes.bool,
    publicationsByYear: PropTypes.object,
    publicationTypesCount: PropTypes.array,

    // lure data
    possiblyYourPublicationsCount: PropTypes.number,
    possiblyYourPublicationsCountLoading: PropTypes.bool,
    hidePossiblyYourPublicationsLure: PropTypes.bool,

    // incomplete Record lure
    incomplete: PropTypes.object,

    // wos/scopus data
    loadingPublicationsStats: PropTypes.bool,
    publicationsStats: PropTypes.object,

    // show latest/trending publications tab
    showLatestPublicationsTab: PropTypes.bool,
    showTrendingPublicationsTab: PropTypes.bool,

    // navigations, app actions
    actions: PropTypes.object.isRequired,

    // orcid sync
    loadingOrcidSyncStatus: PropTypes.bool,
    orcidSyncStatus: PropTypes.object,
    requestingOrcidSync: PropTypes.bool,
    orcidSyncEnabled: PropTypes.bool,
    loadOrcidSyncDelay: PropTypes.number,
};

export default Dashboard;
