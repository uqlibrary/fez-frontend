import React from 'react';
import PropTypes from 'prop-types';

import {
    AuthorsPublicationsPerYearChart,
    AuthorsPublicationTypesCountChart,
    Alert,
    InlineLoader,
    StandardCard,
    StandardPage,
    HelpIcon
} from 'uqlibrary-react-toolbox';
import DashboardAuthorProfile from './DashboardAuthorProfile';
import {PublicationsList} from 'modules/PublicationsList';
import {PublicationStats} from 'modules/SharedComponents';
import RaisedButton from 'material-ui/RaisedButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import ActionOpenInNew from 'material-ui/svg-icons/action/open-in-new';
// import EditorFormatQuote from 'material-ui/svg-icons/editor/format-quote';
import SocialPerson from 'material-ui/svg-icons/social/person';
import {locale} from 'config';

class Dashboard extends React.Component {
    static propTypes = {
        // account data
        account: PropTypes.object.isRequired,
        authorDetails: PropTypes.object,
        authorDetailsLoading: PropTypes.bool,

        // graph data
        loadingPublicationsByYear: PropTypes.bool,
        publicationsByYear: PropTypes.object,
        publicationTypesCount: PropTypes.array,

        // lure data
        possiblyYourPublicationsCount: PropTypes.object,
        hidePossiblyYourPublicationsLure: PropTypes.bool,

        // wos/scopus data
        loadingPublicationsStats: PropTypes.bool,
        publicationsStats: PropTypes.object,

        // author's latest publications
        loadingLatestPublications: PropTypes.bool,
        latestPublicationsList: PropTypes.array,
        totalPublicationsCount: PropTypes.number,

        // author's trending publications
        loadingTrendingPublications: PropTypes.bool,
        trendingPublicationsList: PropTypes.array,

        // navigations, app actions
        actions: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.account && this.props.account.id) {
            this.props.actions.countPossiblyYourPublications(this.props.account.id);
            this.props.actions.loadAuthorPublicationsByYear(this.props.account.id);
            this.props.actions.loadAuthorPublicationsStats(this.props.account.id);
            this.props.actions.searchLatestPublications(this.props.account.id);
            this.props.actions.searchTrendingPublications(this.props.account.id);
        }
    }

    _claimYourPublications = () => {
        this.props.history.push('/claim-publications');
    };

    _viewYourResearch = () => {
        this.props.history.push('/research');
    };

    render() {
        const txt = locale.pages.dashboard;
        const loading = this.props.loadingPublicationsByYear || this.props.authorDetailsLoading
            || this.props.loadingPublicationsStats || this.props.loadingTrendingPublications
            || this.props.loadingLatestPublications;
        const barChart = !loading && this.props.publicationsByYear
            ? (
                <StandardCard className="barChart" title={txt.publicationsByYearChart.title}>
                    <AuthorsPublicationsPerYearChart
                        className="barChart"
                        {...this.props.publicationsByYear}
                        yAxisTitle={txt.publicationsByYearChart.yAxisTitle}/>
                </StandardCard>
            ) : null;
        const donutChart = !loading && this.props.publicationTypesCount
            ? (
                <StandardCard
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
                <StandardCard className="card-paddingless">
                    <PublicationStats publicationsStats={this.props.publicationsStats}/>
                </StandardCard>
            ) : null;

        return (
            <StandardPage className="dashboard">
                {
                    loading &&
                    <div className="isLoading is-centered">
                        <InlineLoader message={txt.loading}/>
                    </div>
                }
                {
                    !loading && this.props.authorDetails &&
                    <div className="columns is-multiline is-gapless">
                        <div className="column is-12 is-hidden-mobile">
                            <div className="is-hidden-mobile">
                                <DashboardAuthorProfile authorDetails={this.props.authorDetails}/>
                            </div>
                        </div>
                        <div className="column is-12 possiblePublicationLure">
                            {
                                !this.props.hidePossiblyYourPublicationsLure
                                && this.props.possiblyYourPublicationsCount
                                && this.props.possiblyYourPublicationsCount.most_likely_match_count > 0 &&
                                <Alert
                                    title={txt.possiblePublicationsLure.title}
                                    message={txt.possiblePublicationsLure.message.replace('[count]', this.props.possiblyYourPublicationsCount.most_likely_match_count)}
                                    type={txt.possiblePublicationsLure.type}
                                    actionButtonLabel={txt.possiblePublicationsLure.actionButtonLabel}
                                    action={this._claimYourPublications}
                                    allowDismiss
                                    dismissAction={this.props.actions.hidePossiblyYourPublicationsLure}/>
                            }
                        </div>
                    </div>
                }
                {/* render charts/stats depending on availability of data */}
                {/* render bar chart full width */}
                {
                    barChart && (publicationStats || (!donutChart && !publicationStats)) &&
                    barChart
                }
                {/* render publication stats full width if donut chart not available */}
                {
                    publicationStats && !donutChart &&
                    publicationStats
                }
                {/* render bar chart next to donut chart if publication stats not available */}
                {
                    barChart && donutChart && !publicationStats &&
                    <div className="columns">
                        <div className="column">
                            {barChart}
                        </div>
                        <div className="column is-4">
                            {donutChart}
                        </div>
                    </div>
                }
                {/* render donut chart chart next to publication stats if both available */}
                {
                    donutChart && publicationStats &&
                    <div className="columns">
                        <div className="column is-4">
                            {donutChart}
                        </div>
                        <div className="column">
                            {publicationStats}
                        </div>
                    </div>
                }

                {
                    !loading
                    && ((this.props.latestPublicationsList && this.props.latestPublicationsList.length > 0) ||
                        (this.props.trendingPublicationsList && this.props.trendingPublicationsList.length > 0)) &&
                    <StandardCard className="card-paddingless">
                        <Tabs className="publicationTabs">
                            {
                                this.props.latestPublicationsList.length > 0 &&
                                <Tab label={txt.myPublications.title} value="myPublications"
                                    className="publicationTabs">
                                    <div style={{padding: '12px 24px'}}>
                                        <PublicationsList
                                            publicationsList={this.props.latestPublicationsList}
                                            showDefaultActions/>
                                        <div className="columns">
                                            <div className="column is-hidden-mobile"/>
                                            <div className="column is-narrow">
                                                <RaisedButton
                                                    secondary
                                                    label={`${txt.myPublications.viewAllButtonLabel} (${this.props.totalPublicationsCount})`}
                                                    onTouchTap={this._viewYourResearch}/>
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                            }
                            {
                                this.props.trendingPublicationsList.length > 0 &&
                                <Tab label={txt.myTrendingPublications.title} value="myTrendingPublications"
                                    className="publicationTabs">
                                    <div style={{padding: '12px 24px'}}>
                                        {
                                            this.props.trendingPublicationsList.map((metric, metricIndex) => (
                                                <div key={'metrics_' + metricIndex}>
                                                    <div className="columns is-gapless is-mobile">
                                                        <div className="column">
                                                            <h2 className="title is-3 trendingPubsSource">{txt.myTrendingPublications.metrics[metric.key].title}</h2>
                                                        </div>
                                                        <div className="column is-narrow is-hidden-mobile">
                                                            <HelpIcon {...txt.myTrendingPublications.help} />
                                                        </div>
                                                    </div>
                                                    {/* TODO: remove temporary publication record render */}
                                                    {
                                                        metric.values.map((recordValue, recordIndex) => (
                                                            <div key={'trending_publication_' + recordIndex}
                                                                className="trendingPubItem">
                                                                <div className="columns is-gapless is-mobile">
                                                                    <div className="column">
                                                                        <div className="title is-5 trendingPubsTitle">
                                                                            {recordValue.title}
                                                                        </div>
                                                                        <div className="trendingPubsCitation">
                                                                            <SocialPerson className="trendingPubsIcon" />
                                                                            {recordValue.authors}
                                                                            <a href={recordValue.citation_url}
                                                                                className="trendingPubsLink"
                                                                                target="_blank"
                                                                                title={txt.myTrendingPublications.openNewWindowTitle.replace('[TITLE]', recordValue.title)}
                                                                            >
                                                                                {txt.myTrendingPublications.viewFullCitationLinkTitle}<ActionOpenInNew className="trendingPubsIcon" />
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                    <div className="column is-narrow trendingPubsCount">
                                                                        <span className="title is-1"
                                                                            title={txt.myTrendingPublications.trendSharesThisMonth}>{recordValue.count}</span>
                                                                    </div>
                                                                    <div className="column is-narrow trendingPubsDifference">
                                                                        <span className="title is-5"
                                                                            title={txt.myTrendingPublications.trendDifferenceSharesThisMonth}>+{recordValue.difference}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                    {/* TODO: when api returns full publication record - use publicationList to display items */}
                                                    {/* <PublicationsList publicationsList={this.props.trendingPublicationsList[metrics.key]}/> */}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </Tab>
                            }
                        </Tabs>
                    </StandardCard>
                }
            </StandardPage>
        );
    }
}

export default Dashboard;
