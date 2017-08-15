import React from 'react';
import PropTypes from 'prop-types';

import {AuthorsPublicationsPerYearChart, AuthorsPublicationTypesCountChart, Alert, InlineLoader, StandardCard, StandardPage} from 'uqlibrary-react-toolbox';
import DashboardAuthorProfile from './DashboardAuthorProfile';
import {PublicationsList} from 'modules/PublicationsList';
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
        trendingPublicationsList: PropTypes.object,

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
        const loading = this.props.loadingPublicationsByYear && this.props.authorDetailsLoading;

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
                                <DashboardAuthorProfile authorDetails={this.props.authorDetails}/>
                            </div>
                            {
                                !this.props.hidePossiblyYourPublicationsLure
                                && this.props.possiblyYourPublicationsCount
                                && this.props.possiblyYourPublicationsCount.most_likely_match_count > 0 &&
                                <div className="notification-wrap column is-12">
                                    <Alert
                                        title={txt.possiblePublicationsLure.title}
                                        message={txt.possiblePublicationsLure.message.replace('[count]', this.props.possiblyYourPublicationsCount.most_likely_match_count)}
                                        type={txt.possiblePublicationsLure.type}
                                        actionButtonLabel={txt.possiblePublicationsLure.actionButtonLabel}
                                        action={this._claimYourPublications}
                                        allowDismiss
                                        dismissAction={this.props.actions.hidePossiblyYourPublicationsLure}/>
                                </div>
                            }

                        </div>
                }
                {
                    !loading && this.props.publicationsByYear &&
                    <StandardCard className="barChart" title={txt.publicationsByYearChart.title}>
                        <AuthorsPublicationsPerYearChart
                            className="barChart"
                            {...this.props.publicationsByYear}
                            yAxisTitle={txt.publicationsByYearChart.yAxisTitle} />
                    </StandardCard>
                }
                {
                    !loading && this.props.publicationTypesCount &&
                    <div className="columns">
                        <div className="column is-4">
                            <StandardCard className="donutChart card-full-height" title={txt.publicationTypesCountChart.title}>
                                <AuthorsPublicationTypesCountChart
                                    className="donutChart"
                                    series={[{name: txt.publicationTypesCountChart.title, data: this.props.publicationTypesCount}]} />
                            </StandardCard>
                        </div>

                        <div className="column">
                            <StandardCard className="card-full-height" title="eSpace publications linked from: WOS/SCOPUS">
                                { this.props.loadingPublicationsStats && 'loading your stats...'}
                                { this.props.publicationsStats && JSON.stringify(this.props.publicationsStats)}
                            </StandardCard>
                        </div>
                    </div>
                }

                {
                    !loading && !this.props.loadingTrendingPublications && !this.props.loadingLatestPublications &&
                    <StandardCard>
                        <Tabs>
                            <Tab label={txt.myPublications.title} value="myPublications">
                                {
                                    !loading && !this.props.loadingLatestPublications && this.props.latestPublicationsList &&
                                    <div>
                                        <PublicationsList publicationsList={this.props.latestPublicationsList}
                                                          showDefaultActions/>
                                        <div className="is-pulled-right">
                                            <RaisedButton secondary
                                                          label={`${txt.myPublications.viewAllButtonLabel} (${this.props.totalPublicationsCount})`}
                                                          onTouchTap={this._viewYourResearch}/>
                                        </div>
                                    </div>
                                }
                            </Tab>
                            <Tab label={txt.myTrendingPublications.title} value="myTrendingPublications">
                                {
                                    !loading && !this.props.loadingTrendingPublications && this.props.trendingPublicationsList &&
                                    <div>
                                        {
                                            txt.myTrendingPublications.metrics.map((metrics, index) => (
                                                <div key={'metrics_' + index}>
                                                    <h2>{metrics.title}</h2>
                                                    {/* TODO: remove tempirary publication record render */}
                                                    {
                                                        this.props.trendingPublicationsList[metrics.key].map((item, itemIndex) => (
                                                            <div key={'trending_publication_' + itemIndex}>
                                                                {item.title} {item.count} +{item.difference}
                                                            </div>
                                                        ))
                                                    }
                                                    {/* TODO: when api returns full publication record - use publicationList to display items */}
                                                    {/* <PublicationsList publicationsList={this.props.trendingPublicationsList[metrics.key]}/> */}
                                                </div>
                                            ))
                                        }
                                    </div>
                                }
                            </Tab>
                        </Tabs>
                    </StandardCard>
                }
            </StandardPage>
        );
    }
}

export default Dashboard;
