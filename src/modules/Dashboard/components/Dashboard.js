import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

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
import { withIsMobileView } from '../../../hooks';
import { withNavigate } from 'helpers/withNavigate';

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

export class DashboardClass extends PureComponent {
    static propTypes = {
        isMobileView: PropTypes.bool,
        // account data
        account: PropTypes.object.isRequired,
        authorDetails: PropTypes.object,
        author: PropTypes.object,
        accountAuthorDetailsLoading: PropTypes.bool,

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
        navigate: PropTypes.func.isRequired,

        // orcid sync
        loadingOrcidSyncStatus: PropTypes.bool,
        orcidSyncStatus: PropTypes.object,
        requestingOrcidSync: PropTypes.bool,
        orcidSyncEnabled: PropTypes.bool,
        loadOrcidSyncDelay: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            dashboardPubsTabs: 1,
            orcidSyncStatusRefreshCount: 0,
        };
    }

    componentDidMount() {
        // eslint-disable-next-line camelcase
        if (this.props.account && this.props.account.id && this.props.author?.aut_id) {
            // eslint-disable-next-line camelcase
            // don't call the api for non author users since the api call requires an author
            this.props.actions.countPossiblyYourPublications(this.props.account.id);
            this.props.actions.loadAuthorPublicationsStats(this.props.account.id, this.props.authorDetails);
            !this.props.incomplete.publicationsList.length &&
                this.props.actions.searchAuthorPublications({}, 'incomplete');
            this._loadOrcidSync();
            this.state.orcidSyncStatusRefreshCount = 1;
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.orcidSyncEnabled !== prevProps.orcidSyncEnabled) {
            this._loadOrcidSync();
            this.state.orcidSyncStatusRefreshCount = 1;
        }
        this.props.loadingOrcidSyncStatus !== prevProps.loadingOrcidSyncStatus &&
            !this.props.loadingOrcidSyncStatus &&
            this._waitForSyncSuccess();
    }

    _isWaitingForSync = () =>
        ['Pending', 'In Progress'].indexOf((this.props.orcidSyncStatus || /* istanbul ignore next */ {}).orj_status) >
        -1;

    // A repeating check for latest status that gets progressively longer
    _waitForSyncSuccess = () =>
        this._isWaitingForSync() &&
        this.setState(
            {
                orcidSyncStatusRefreshCount: this.state.orcidSyncStatusRefreshCount + 1,
            },
            () => this._loadOrcidSync(fibonacci(this.state.orcidSyncStatusRefreshCount, 1)),
        );

    _loadOrcidSync = (waitTime = 1) => {
        // considering loadOrcidSyncDelay props, we have to clear any previously scheduled requests
        !!this.state.lastOrcidSyncScheduledRequest && global.clearTimeout(this.state.lastOrcidSyncScheduledRequest);
        this.setState({
            lastOrcidSyncScheduledRequest: global.setTimeout(() => {
                !this.props.loadingOrcidSyncStatus &&
                    this.props.orcidSyncEnabled &&
                    (this.props.orcidSyncStatus === null || !!waitTime) &&
                    this.props.actions &&
                    this.props.actions.loadOrcidSyncStatus &&
                    this.props.actions.loadOrcidSyncStatus();
            }, waitTime * this.props.loadOrcidSyncDelay * 1000),
        });
    };

    _claimYourPublications = () => {
        this.props.navigate(pathConfig.records.possible);
    };

    _addPublication = () => {
        this.props.navigate(pathConfig.records.add.find);
    };

    handleTabChange = (event, value) => {
        this.setState({
            dashboardPubsTabs: value,
        });
    };

    redirectToIncompleteRecordlist = () => {
        this.props.navigate(pathConfig.records.incomplete);
    };

    requestOrcidSync = () => {
        this.props.actions && this.props.actions.requestOrcidSync && this.props.actions.requestOrcidSync();
    };

    renderAuthorProfile = () => (
        <Grid item xs={12}>
            <OrcidSyncContext.Provider
                value={{
                    showSyncUI: this.props.orcidSyncEnabled && !this.props.loadingOrcidSyncStatus,
                    orcidSyncProps: {
                        author: this.props.author,
                        orcidSyncStatus: this.props.orcidSyncStatus,
                        requestingOrcidSync: this.props.requestingOrcidSync,
                        requestOrcidSync: this.requestOrcidSync,
                    },
                }}
            >
                <DashboardAuthorProfile
                    authorDetails={this.props.authorDetails}
                    author={this.props.author}
                    navigate={this.props.navigate}
                />
            </OrcidSyncContext.Provider>
        </Grid>
    );

    getActualLowestYear = (citationCount, authorDetails) => {
        return citationCount.replace(
            '1000',
            !!authorDetails.espace && !!authorDetails.espace.first_year ? authorDetails.espace.first_year : 'N/A',
        );
    };

    render() {
        const txt = locale.pages.dashboard;
        const loading =
            // nothing to load for non author users
            // eslint-disable-next-line camelcase
            !!this.props.author?.aut_id &&
            (this.props.loadingPublicationsByYear ||
                this.props.accountAuthorDetailsLoading ||
                this.props.loadingPublicationsStats);
        const userHasPublications =
            this.props.authorDetails &&
            this.props.authorDetails.espace &&
            this.props.authorDetails.espace.doc_count > 0;
        const barChart =
            !loading &&
            !this.props.isMobileView &&
            this.props.publicationsByYear &&
            this.props.publicationsByYear.series.length > 0 ? (
                <StandardCard
                    className="barChart"
                    title={txt.publicationsByYearChart.title}
                    customBackgroundColor={theme.graphs.color2}
                    customTitleColor={theme.palette.white.main}
                >
                    <AuthorsPublicationsPerYearChart
                        className="barChart"
                        {...this.props.publicationsByYear}
                        yAxisTitle={txt.publicationsByYearChart.yAxisTitle}
                    />
                </StandardCard>
            ) : null;
        const donutChart =
            !loading &&
            !this.props.isMobileView &&
            this.props.publicationTypesCount &&
            this.props.publicationTypesCount.length > 0 ? (
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
                                data: this.props.publicationTypesCount,
                            },
                        ]}
                    />
                </StandardCard>
            ) : null;

        /**
         * where the 1000-01-01 date is provided as the lowest date, we replace it with the authorDetails date
         */
        const cleanPublicationsStats = publicationsStats => {
            const authorDetails = (!!this.props.authorDetails && this.props.authorDetails) || {};

            if (
                !!publicationsStats.scopus_citation_count_i &&
                !!publicationsStats.scopus_citation_count_i.years &&
                publicationsStats.scopus_citation_count_i.years.substring(0, 4) === '1000'
            ) {
                publicationsStats.scopus_citation_count_i.years = this.getActualLowestYear(
                    publicationsStats.scopus_citation_count_i.years,
                    authorDetails,
                );
            }
            if (
                !!publicationsStats.thomson_citation_count_i &&
                !!publicationsStats.thomson_citation_count_i.years &&
                publicationsStats.thomson_citation_count_i.years.substring(0, 4) === '1000'
            ) {
                publicationsStats.thomson_citation_count_i.years = this.getActualLowestYear(
                    publicationsStats.thomson_citation_count_i.years,
                    authorDetails,
                );
            }
            return publicationsStats;
        };

        const publicationStats =
            !loading &&
            this.props.publicationsStats &&
            (this.props.publicationsStats.thomson_citation_count_i.count > 0 ||
                this.props.publicationsStats.scopus_citation_count_i.count > 0) ? (
                <StandardCard noPadding noHeader fullHeight>
                    <PublicationStats publicationsStats={cleanPublicationsStats(this.props.publicationsStats)} />
                </StandardCard>
            ) : null;
        const pluralTextReplacement =
            this.props.incomplete &&
            this.props.incomplete.publicationsListPagingData &&
            this.props.incomplete.publicationsListPagingData.total > 1
                ? 's'
                : '';
        const verbEndingTextReplacement =
            this.props.incomplete &&
            this.props.incomplete.publicationsListPagingData &&
            this.props.incomplete.publicationsListPagingData.total > 1
                ? ''
                : 's';
        const isAdmin =
            this.props.authorDetails &&
            (this.props.authorDetails.is_administrator === 1 || this.props.authorDetails.is_super_administrator === 1);
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
                    {!loading && this.props.authorDetails && (
                        <React.Fragment>
                            {!!txt.incompleteRecordLure &&
                                !!this.props.incomplete &&
                                !this.props.incomplete.loadingPublicationsList &&
                                this.props.incomplete.publicationsListPagingData &&
                                this.props.incomplete.publicationsListPagingData.total > 0 && (
                                    <Grid item xs={12} style={{ marginTop: -27 }}>
                                        <Alert
                                            title={txt.incompleteRecordLure.title}
                                            message={txt.incompleteRecordLure.message
                                                .replace(
                                                    '[count]',
                                                    this.props.incomplete.publicationsListPagingData.total,
                                                )
                                                .replace('[plural]', pluralTextReplacement)
                                                .replace('[verbEnding]', verbEndingTextReplacement)}
                                            type={txt.incompleteRecordLure.type}
                                            actionButtonLabel={txt.incompleteRecordLure.actionButtonLabel}
                                            action={this.redirectToIncompleteRecordlist}
                                        />
                                    </Grid>
                                )}
                            {this.renderAuthorProfile()}
                            {!this.props.hidePossiblyYourPublicationsLure &&
                            !this.props.possiblyYourPublicationsCountLoading &&
                            this.props.possiblyYourPublicationsCount > 0 ? (
                                <Grid item xs={12} style={{ marginTop: -27 }}>
                                    <Alert
                                        title={txt.possiblePublicationsLure.title}
                                        message={txt.possiblePublicationsLure.message.replace(
                                            '[count]',
                                            this.props.possiblyYourPublicationsCount,
                                        )}
                                        type={txt.possiblePublicationsLure.type}
                                        actionButtonLabel={txt.possiblePublicationsLure.actionButtonLabel}
                                        action={this._claimYourPublications}
                                        allowDismiss
                                        dismissAction={this.props.actions.hidePossiblyYourPublicationsLure}
                                    />
                                </Grid>
                            ) : (
                                !this.props.possiblyYourPublicationsCountLoading &&
                                !this.props.hidePossiblyYourPublicationsLure &&
                                !this.props.possiblyYourPublicationsCount && (
                                    <Grid item xs={12} style={{ marginTop: -27 }}>
                                        <Alert {...txt.nothingToClaimLure} action={this._addPublication} />
                                    </Grid>
                                )
                            )}
                        </React.Fragment>
                    )}
                    {/* render charts/stats depending on availability of data */}
                    {/* render bar chart full width */}
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
                    {/* render donut chart chart next to publication stats if both available */}
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
                    {!loading &&
                        userHasPublications &&
                        (this.props.showLatestPublicationsTab || this.props.showTrendingPublicationsTab) && (
                            <Grid item xs={12}>
                                <StandardCard noHeader>
                                    <StyledTabs
                                        value={this.state.dashboardPubsTabs}
                                        onChange={this.handleTabChange}
                                        variant="fullWidth"
                                        centered
                                        indicatorColor="primary"
                                        textColor="inherit"
                                    >
                                        {this.props.showLatestPublicationsTab && (
                                            <StyledTab key={1} label={txt.myLatestPublications.title} value={1} />
                                        )}
                                        {this.props.showTrendingPublicationsTab && (
                                            <StyledTab key={2} label={txt.myTrendingPublications.title} value={2} />
                                        )}
                                    </StyledTabs>
                                    <Grid container spacing={3} style={{ marginTop: 24 }}>
                                        {this.props.showLatestPublicationsTab && (
                                            <Grid
                                                item
                                                xs={12}
                                                style={this.state.dashboardPubsTabs !== 1 ? { display: 'none' } : {}}
                                            >
                                                <MyLatestPublications isAdmin={!!isAdmin} />
                                            </Grid>
                                        )}
                                        {this.props.showTrendingPublicationsTab && (
                                            <Grid
                                                item
                                                xs={12}
                                                style={this.state.dashboardPubsTabs !== 2 ? { display: 'none' } : {}}
                                            >
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
    }
}

DashboardClass.defaultProps = {
    loadOrcidSyncDelay: 5,
};

const Dashboard = withNavigate()(withIsMobileView()(DashboardClass));
export default Dashboard;
