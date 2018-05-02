import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {AuthorsPublicationsPerYearChart} from 'modules/SharedComponents/Toolbox/Charts';
import {AuthorsPublicationTypesCountChart} from 'modules/SharedComponents/Toolbox/Charts';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';

import DashboardAuthorProfile from './DashboardAuthorProfile';
import {PublicationStats} from 'modules/SharedComponents/PublicationStats';
import DashboardPublicationTabs from '../containers/DashboardPublicationTabs';

import {routes} from 'config';
import {locale} from 'locale';

class Dashboard extends PureComponent {
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

        // wos/scopus data
        loadingPublicationsStats: PropTypes.bool,
        publicationsStats: PropTypes.object,

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
            this.props.actions.loadAuthorPublicationsStats(this.props.account.id);
        }
    }
    _claimYourPublications = () => {
        this.props.history.push(routes.pathConfig.records.possible);
    };

    _addPublication = () => {
        this.props.history.push(routes.pathConfig.records.add.find);
    };

    render() {
        const txt = locale.pages.dashboard;
        const loading = (
            this.props.loadingPublicationsByYear ||
            this.props.accountAuthorDetailsLoading ||
            this.props.loadingPublicationsStats
        );
        const barChart = !loading && this.props.publicationsByYear && this.props.publicationsByYear.series.length > 0
            ? (
                <StandardCard className="barChart" title={txt.publicationsByYearChart.title}>
                    <AuthorsPublicationsPerYearChart
                        className="barChart"
                        {...this.props.publicationsByYear}
                        yAxisTitle={txt.publicationsByYearChart.yAxisTitle}/>
                </StandardCard>
            ) : null;
        const donutChart = !loading && this.props.publicationTypesCount && this.props.publicationTypesCount.length > 0
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
                                <DashboardAuthorProfile authorDetails={this.props.authorDetails} author={this.props.author} history={this.props.history} />
                            </div>
                        </div>
                        <div className="column is-12 possiblePublicationLure">
                            {
                                !this.props.hidePossiblyYourPublicationsLure
                                && !this.props.possiblyYourPublicationsCountLoading
                                && this.props.possiblyYourPublicationsCount > 0 ?
                                    <Alert
                                        title={txt.possiblePublicationsLure.title}
                                        message={txt.possiblePublicationsLure.message.replace('[count]', this.props.possiblyYourPublicationsCount)}
                                        type={txt.possiblePublicationsLure.type}
                                        actionButtonLabel={txt.possiblePublicationsLure.actionButtonLabel}
                                        action={this._claimYourPublications}
                                        allowDismiss
                                        dismissAction={this.props.actions.hidePossiblyYourPublicationsLure}/>
                                    :
                                    !this.props.possiblyYourPublicationsCountLoading
                                    && !this.props.hidePossiblyYourPublicationsLure
                                    && !this.props.possiblyYourPublicationsCount &&
                                    <Alert
                                        {...txt.nothingToClaimLure}
                                        action={this._addPublication}/>
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
                    !loading &&
                    <DashboardPublicationTabs/>
                }
            </StandardPage>
        );
    }
}
export default Dashboard;
