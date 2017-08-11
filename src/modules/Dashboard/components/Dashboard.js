import React from 'react';
import PropTypes from 'prop-types';

import {AuthorsPublicationsPerYearChart, AuthorsPublicationTypesCountChart, Alert, InlineLoader, StandardCard, StandardPage} from 'uqlibrary-react-toolbox';
import DashboardAuthorProfile from './DashboardAuthorProfile';
import {PublicationsList} from 'modules/PublicationsList';
import {locale} from 'config';

class Dashboard extends React.Component {

    static propTypes = {
        account: PropTypes.object.isRequired,
        authorDetails: PropTypes.object,
        authorDetailsLoading: PropTypes.bool,
        loadingPublicationsByYear: PropTypes.bool,
        publicationsByYear: PropTypes.object,
        publicationTypesCount: PropTypes.array,
        possiblyYourPublicationsCount: PropTypes.object,
        publicationsList: PropTypes.array,
        loadingPublicationsStats: PropTypes.bool,
        publicationsStats: PropTypes.object,
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
        }
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.account && nextProps.account.id &&
    //         (!this.props.account || nextProps.account.id !== this.props.account.id)) {
    //         this.props.actions.countPossiblyYourPublications(nextProps.account.id);
    //         this.props.actions.loadAuthorPublicationsByYear(nextProps.account.id);
    //         this.props.actions.loadAuthorPublicationsStats(this.props.account.id);
    //     }
    // }

    claimYourPublications = () => {
        this.props.history.push('/claim-publications');
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
                    <div className="layout-card">
                        <div className="columns is-multiline is-gapless">
                            <div className="column is-12 is-hidden-mobile">
                                <DashboardAuthorProfile authorDetails={this.props.authorDetails}/>
                            </div>
                            {
                                this.props.possiblyYourPublicationsCount &&
                                <div className="notification-wrap column is-12">
                                    <Alert title={txt.possiblePublicationsLure.title}
                                           message={txt.possiblePublicationsLure.message.replace('[count]', this.props.possiblyYourPublicationsCount.most_likely_match_count)}
                                           type={txt.possiblePublicationsLure.type}
                                           actionButtonLabel={txt.possiblePublicationsLure.actionButtonLabel}
                                           action={this.claimYourPublications}
                                           allowDismiss
                                    />
                                </div>
                            }

                        </div>
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
                        <div className="column is-gapless is-4">
                            <StandardCard className="donutChart" title={txt.publicationTypesCountChart.title}>
                                <AuthorsPublicationTypesCountChart
                                    className="donutChart"
                                    series={[{name: txt.publicationTypesCountChart.title, data: this.props.publicationTypesCount}]} />
                            </StandardCard>
                        </div>

                        <div className="column is-9">
                            <StandardCard title="eSpace publications linked from: WOS/SCOPUS">
                                { this.props.loadingPublicationsStats && 'loading your stats...'}
                                { this.props.publicationsStats && JSON.stringify(this.props.publicationsStats)}
                            </StandardCard>
                        </div>
                    </div>
                }
                {
                    !loading && this.props.publicationsList &&
                    <StandardCard title="Your publications">
                        <PublicationsList publicationsList={this.props.publicationsList} />
                    </StandardCard>
                }
            </StandardPage>
        );
    }
}

export default Dashboard;
