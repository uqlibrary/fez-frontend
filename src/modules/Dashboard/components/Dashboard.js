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
import FontIcon from 'material-ui/FontIcon';
import {locale} from 'config';

class Dashboard extends React.Component {
    static propTypes = {
        // account data
        account: PropTypes.object.isRequired,
        authorDetails: PropTypes.object,
        loadingAuthorDetails: PropTypes.bool,

        // graph data
        loadingPublicationsByYear: PropTypes.bool,
        publicationsByYear: PropTypes.object,
        publicationTypesCount: PropTypes.array,

        // lure data
        possiblyYourPublicationsCount: PropTypes.number,
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
        this.props.history.push('/records/possible');
    };

    _viewYourResearch = () => {
        this.props.history.push('/records/mine');
    };

    render() {
        const txt = locale.pages.dashboard;
        const loading = this.props.loadingPublicationsByYear || this.props.loadingAuthorDetails
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
                <div className="breakpoints">
                    <div className="mobile">Mobile</div>
                    <div className="tablet">Tablet</div>
                    <div className="desktop">Desktop</div>
                </div><br /><br/>

                <Alert title="Title" message="Message" type="warning" actionButtonLabel="Test" action={this._claimYourPublications} allowDismiss dismissAction={this.props.actions.hidePossiblyYourPublicationsLure}/>
                <Alert title="Title" message="Message" type="error" actionButtonLabel="Test" action={this._claimYourPublications} allowDismiss dismissAction={this.props.actions.hidePossiblyYourPublicationsLure}/>
                <Alert title="Title" message="Message" type="error_outline" actionButtonLabel="Test" action={this._claimYourPublications} allowDismiss dismissAction={this.props.actions.hidePossiblyYourPublicationsLure}/>
                <Alert title="Title" message="Message" type="info" actionButtonLabel="Test" action={this._claimYourPublications} allowDismiss dismissAction={this.props.actions.hidePossiblyYourPublicationsLure}/>
                <Alert title="Title" message="Message" type="info_outline" actionButtonLabel="Test" action={this._claimYourPublications} allowDismiss dismissAction={this.props.actions.hidePossiblyYourPublicationsLure}/>
                <Alert title="Title" message="Message" type="help" actionButtonLabel="Test" action={this._claimYourPublications} allowDismiss dismissAction={this.props.actions.hidePossiblyYourPublicationsLure}/>
                <Alert title="Title" message="Message" type="help_outline" actionButtonLabel="Test" action={this._claimYourPublications} allowDismiss dismissAction={this.props.actions.hidePossiblyYourPublicationsLure}/>
                <Alert title="Title" message="Message" type="done" actionButtonLabel="Test" action={this._claimYourPublications} allowDismiss dismissAction={this.props.actions.hidePossiblyYourPublicationsLure}/>

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
                                && this.props.possiblyYourPublicationsCount > 0 &&
                                <Alert
                                    title={txt.possiblePublicationsLure.title}
                                    message={txt.possiblePublicationsLure.message.replace('[count]', this.props.possiblyYourPublicationsCount)}
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
                                                            <h2 className="trendingPubsSource">{txt.myTrendingPublications.metrics[metric.key].title}</h2>
                                                        </div>
                                                        <div className="column is-narrow is-hidden-mobile">
                                                            <HelpIcon {...txt.myTrendingPublications.help} />
                                                        </div>
                                                    </div>
                                                    {
                                                        metric.values.map((recordValue, recordIndex) => (
                                                            <div className="publicationCitation" key={`trendingPublication_${recordIndex}`}>
                                                                <div className="columns is-gapless is-mobile">
                                                                    <div className="column">
                                                                        <div className="citationContent">
                                                                            <h3 className="publicationTitle">{recordValue.title}</h3>
                                                                            <FontIcon className="material-icons citationIcon" data-place="left">
                                                                                format_quote
                                                                            </FontIcon>
                                                                            {recordValue.authors} ({recordValue.rek_date.substring(0, 4)})
                                                                        </div>
                                                                        <div className="citationCounts">
                                                                            <div className="citationCount column" style={{margin: '0px', padding: '0px'}}>
                                                                                <a href={recordValue.citation_url} className="citationCountLink" target="_blank" title={txt.myTrendingPublications.openNewWindowTitle.replace('[TITLE]', recordValue.title)}>
                                                                                    <div className="columns is-mobile is-gapless">
                                                                                        <div className="column is-narrow citationCountNumber">{txt.myTrendingPublications.viewFullCitationLinkTitle}<FontIcon className="citationCountIcon material-icons">open_in_new</FontIcon></div>
                                                                                    </div>
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="column is-narrow">
                                                                        <span
                                                                            className="trendingPubsCount"
                                                                            title={txt.myTrendingPublications.trendSharesThisMonth}>{Math.round(recordValue.count)}</span>
                                                                    </div>
                                                                    <div
                                                                        className="column is-narrow">
                                                                        <span
                                                                            className="trendingPubsDifference"
                                                                            title={txt.myTrendingPublications.trendDifferenceSharesThisMonth}>+{Math.round(recordValue.difference)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
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
