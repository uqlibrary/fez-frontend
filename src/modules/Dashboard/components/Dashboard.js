import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';

import {AuthorsPublicationsPerYearChart} from 'modules/SharedComponents/Toolbox/Charts';
import {AuthorsPublicationTypesCountChart} from 'modules/SharedComponents/Toolbox/Charts';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';

import {MyTrendingPublications} from 'modules/SharedComponents/MyTrendingPublications';
import {MyLatestPublications} from 'modules/SharedComponents/MyLatestPublications';
import DashboardAuthorProfile from './DashboardAuthorProfile';
import {PublicationStats} from 'modules/SharedComponents/PublicationStats';

import {pathConfig} from 'config/routes';
import locale from 'locale/pages';

import {mui1theme as theme} from 'config';

const styles = theme => ({
    tabs: {
        [theme.breakpoints.up('sm')]: {
            margin: '-16px -24px',
        },
        [theme.breakpoints.down('xs')]: {
            margin: -16
        },
        backgroundColor: theme.palette.primary.main,
        borderRadius: '4px 4px 0px 0px'
    },
    tab: {
        color: theme.palette.white.main
    },
    tabIndicator: {
        height: 4,
        backgroundColor: theme.palette.accent.main
    }
});

export class DashboardClass extends PureComponent {
    static propTypes = {
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
        history: PropTypes.object.isRequired,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            dashboardPubsTabs: 1
        };
    }

    componentDidMount() {
        if (this.props.account && this.props.account.id) {
            this.props.actions.countPossiblyYourPublications(this.props.account.id);
            this.props.actions.loadAuthorPublicationsStats(this.props.account.id);
            !this.props.incomplete.publicationsList.length &&
                this.props.actions.searchAuthorPublications({}, 'incomplete');
        }
    }

    _claimYourPublications = () => {
        this.props.history.push(pathConfig.records.possible);
    };

    _addPublication = () => {
        this.props.history.push(pathConfig.records.add.find);
    };

    handleTabChange = (event, value) => {
        this.setState({
            dashboardPubsTabs: value});
    };

    redirectToIncompleteRecordlist = () => {
        this.props.history.push(pathConfig.records.incomplete);
    };

    render() {
        const {classes} = this.props;
        const txt = locale.pages.dashboard;
        const loading = (
            this.props.loadingPublicationsByYear ||
            this.props.accountAuthorDetailsLoading ||
            this.props.loadingPublicationsStats
        );
        const userHasPublications = this.props.authorDetails && this.props.authorDetails.espace && this.props.authorDetails.espace.doc_count > 0;
        const barChart = !loading && this.props.publicationsByYear && this.props.publicationsByYear.series.length > 0
            ? (
                <StandardCard className="barChart" title={txt.publicationsByYearChart.title} customBackgroundColor={theme.graphs.color2} customTitleColor={theme.palette.white.main}>
                    <AuthorsPublicationsPerYearChart
                        className="barChart"
                        {...this.props.publicationsByYear}
                        yAxisTitle={txt.publicationsByYearChart.yAxisTitle}/>
                </StandardCard>
            ) : null;
        const donutChart = !loading && this.props.publicationTypesCount && this.props.publicationTypesCount.length > 0
            ? (
                <StandardCard
                    fullHeight
                    noPadding
                    customBackgroundColor={theme.graphs.color1} customTitleColor={theme.palette.white.main}
                    className="donutChart"
                    title={txt.publicationTypesCountChart.title}>
                    <AuthorsPublicationTypesCountChart
                        className="donutChart"
                        series={[{
                            name: txt.publicationTypesCountChart.title,
                            data: this.props.publicationTypesCount
                        }]}/>
                </StandardCard>
            ) : null;

        const publicationStats = !loading && this.props.publicationsStats
        && (this.props.publicationsStats.thomson_citation_count_i.count > 0 || this.props.publicationsStats.scopus_citation_count_i.count > 0)
            ? (
                <StandardCard noPadding noHeader fullHeight >
                    <PublicationStats publicationsStats={this.props.publicationsStats}/>
                </StandardCard>
            ) : null;
        const pluralTextReplacement = this.props.incomplete && this.props.incomplete.publicationsListPagingData
                                       && this.props.incomplete.publicationsListPagingData.total > 1 ? 's' : '';
        const verbEndingTextReplacement = this.props.incomplete && this.props.incomplete.publicationsListPagingData
                                       && this.props.incomplete.publicationsListPagingData.total > 1 ? '' : 's';

        return (
            <StandardPage>
                <Grid container spacing={24}>
                    {
                        loading &&
                        <React.Fragment>
                            <Grid item xs />
                            <Grid item><InlineLoader message={txt.loading}/></Grid>
                            <Grid item xs />
                        </React.Fragment>
                    }
                    {
                        !loading && this.props.authorDetails &&
                        <React.Fragment>
                            {
                                !!txt.incompleteRecordLure &&
                                !!this.props.incomplete &&
                                !this.props.incomplete.loadingPublicationsList &&
                                this.props.incomplete.publicationsListPagingData &&
                                this.props.incomplete.publicationsListPagingData.total > 0 &&
                                <Grid item xs={12} style={{marginTop: -27}}>
                                    <Alert
                                        title={txt.incompleteRecordLure.title}
                                        message={txt.incompleteRecordLure.message
                                            .replace('[count]', this.props.incomplete.publicationsListPagingData.total)
                                            .replace('[plural]', pluralTextReplacement)
                                            .replace('[verbEnding]', verbEndingTextReplacement)
                                        }
                                        type={txt.incompleteRecordLure.type}
                                        actionButtonLabel={txt.incompleteRecordLure.actionButtonLabel}
                                        action={this.redirectToIncompleteRecordlist}
                                    />
                                </Grid>
                            }
                            <Grid item xs={12}>
                                <DashboardAuthorProfile
                                    authorDetails={this.props.authorDetails}
                                    author={this.props.author}
                                    history={this.props.history}
                                />
                            </Grid>
                            {
                                !this.props.hidePossiblyYourPublicationsLure
                                && !this.props.possiblyYourPublicationsCountLoading
                                && this.props.possiblyYourPublicationsCount > 0 ?
                                    <Grid item xs={12} style={{marginTop: -27}}>
                                        <Alert
                                            title={txt.possiblePublicationsLure.title}
                                            message={txt.possiblePublicationsLure.message.replace('[count]', this.props.possiblyYourPublicationsCount)}
                                            type={txt.possiblePublicationsLure.type}
                                            actionButtonLabel={txt.possiblePublicationsLure.actionButtonLabel}
                                            action={this._claimYourPublications}
                                            allowDismiss
                                            dismissAction={this.props.actions.hidePossiblyYourPublicationsLure}/>
                                    </Grid>
                                    :
                                    !this.props.possiblyYourPublicationsCountLoading
                                    && !this.props.hidePossiblyYourPublicationsLure
                                    && !this.props.possiblyYourPublicationsCount &&
                                    <Grid item xs={12} style={{marginTop: -27}}>
                                        <Alert
                                            {...txt.nothingToClaimLure}
                                            action={this._addPublication}/>
                                    </Grid>
                            }
                        </React.Fragment>
                    }
                    {/* render charts/stats depending on availability of data */}
                    {/* render bar chart full width */}
                    {
                        barChart && (publicationStats || (!donutChart && !publicationStats)) &&
                        <Grid item xs={12}>
                            {barChart}
                        </Grid>
                    }
                    {/* render publication stats full width if donut chart not available */}
                    {
                        publicationStats && !donutChart &&
                        <Grid item xs={12}>
                            {publicationStats}
                        </Grid>
                    }
                    {/* render bar chart next to donut chart if publication stats not available */}
                    {
                        barChart && donutChart && !publicationStats &&
                        <React.Fragment>
                            <Grid item xs={12} sm={8}>
                                {barChart}
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                {donutChart}
                            </Grid>
                        </React.Fragment>
                    }
                    {/* render donut chart chart next to publication stats if both available */}
                    {
                        donutChart && publicationStats &&
                        <React.Fragment>
                            <Grid item xs={12} sm={4}>
                                {donutChart}
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                {publicationStats}
                            </Grid>
                        </React.Fragment>
                    }
                    {
                        !loading && userHasPublications && (this.props.showLatestPublicationsTab || this.props.showTrendingPublicationsTab) &&
                        <Grid item xs={12}>
                            <StandardCard noHeader>
                                <Tabs className={classes.tabs}
                                    classes={{indicator: classes.tabIndicator}}
                                    value={this.state.dashboardPubsTabs}
                                    onChange={this.handleTabChange}
                                    fullWidth
                                    centered>
                                    {this.props.showLatestPublicationsTab && <Tab className={classes.tab} key={1} label={txt.myLatestPublications.title} value={1}/>}
                                    {this.props.showTrendingPublicationsTab && <Tab className={classes.tab} key={2} label={txt.myTrendingPublications.title} value={2}/>}
                                </Tabs>
                                <Grid container spacing={24} style={{marginTop: 24}}>
                                    {
                                        this.props.showLatestPublicationsTab &&
                                        <Grid item xs={12} style={this.state.dashboardPubsTabs !== 1 ? {display: 'none'} : {}}>
                                            <MyLatestPublications/>
                                        </Grid>
                                    }
                                    {
                                        this.props.showTrendingPublicationsTab &&
                                        <Grid item xs={12} style={this.state.dashboardPubsTabs !== 2 ? {display: 'none'} : {}}>
                                            <MyTrendingPublications/>
                                        </Grid>
                                    }
                                </Grid>
                            </StandardCard>
                        </Grid>
                    }
                </Grid>
            </StandardPage>
        );
    }
}

const StyledDashboard = withStyles(styles, {withTheme: true})(DashboardClass);
const Dashboard = (props) => <StyledDashboard {...props}/>;
export default Dashboard;
