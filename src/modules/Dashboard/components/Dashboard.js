import React from 'react';
import PropTypes from 'prop-types';

import {
    AuthorsPublicationsPerYearChart,
    AuthorsPublicationTypesCountChart,
    Alert,
    InlineLoader,
    StandardCard,
    StandardPage
} from 'uqlibrary-react-toolbox';
import DashboardAuthorProfile from './DashboardAuthorProfile';
import {PublicationsList} from 'modules/PublicationsList';
import {PublicationStats} from 'modules/SharedComponents';
import RaisedButton from 'material-ui/RaisedButton';
import {Tabs, Tab} from 'material-ui/Tabs';
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
        const publicationStats = this.props.publicationsStats
            && this.props.publicationsStats.thomson_citation_count_i && this.props.publicationsStats.thomson_citation_count_i.count
            && this.props.publicationsStats.scopus_citation_count_i && this.props.publicationsStats.scopus_citation_count_i.count
            ? (
                <StandardCard className="card-paddingless">
                    <PublicationStats publicationsStats={this.props.publicationsStats}/>
                </StandardCard>
            ) : null;

        return (
            <StandardPage>
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
                    <div className="columns is-mobile">
                        <div className="column">
                            {barChart}
                        </div>
                        <div className="column is-4 is-full-mobile">
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
                        <Tabs>
                            {
                                this.props.latestPublicationsList.length > 0 &&
                                <Tab label={txt.myPublications.title} value="myPublications">
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
                                <Tab label={txt.myTrendingPublications.title} value="myTrendingPublications">
                                    <div style={{padding: '12px 24px 24px 24px'}}>
                                        {
                                            this.props.trendingPublicationsList.map((metric, metricIndex) => (
                                                <div key={'metrics_' + metricIndex}>
                                                    <h2>{txt.myTrendingPublications.metrics[metric.key].title}</h2>
                                                    {/* TODO: remove temporary publication record render */}
                                                    {
                                                        metric.values.map((recordValue, recordIndex) => (
                                                            <div key={'trending_publication_' + recordIndex}>
                                                                {recordValue.title} {recordValue.count}
                                                                +{recordValue.difference}
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
