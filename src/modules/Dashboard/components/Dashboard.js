import React from 'react';
import PropTypes from 'prop-types';

import {AuthorsPublicationsPerYearChart, AuthorsPublicationsCount, Alert, InlineLoader, StandardCard, StandardPage} from 'uqlibrary-react-toolbox';
import DashboardAuthorProfile from './DashboardAuthorProfile';
import {PublicationsList} from 'modules/PublicationsList';
import {locale} from 'config';

class Dashboard extends React.Component {

    static propTypes = {
        account: PropTypes.object.isRequired,
        authorDetails: PropTypes.object,
        authorDetailsLoading: PropTypes.bool,
        publicationsPerYear: PropTypes.object,
        publicationCountData: PropTypes.object,
        possiblyYourPublicationsCount: PropTypes.object,
        publicationsList: PropTypes.list,
        actions: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.account && this.props.account.id) {
            this.props.actions.countPossiblyYourPublications(this.props.account.id);
            console.log(this.props.account.id);
            this.props.actions.loadAuthorPublicationsByYear(this.props.account.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.account && nextProps.account.id &&
            (!this.props.account || nextProps.account.id !== this.props.account.id)) {
            this.props.actions.countPossiblyYourPublications(nextProps.account.id);
            console.log(this.props.account.id);
            this.props.actions.loadAuthorPublicationsByYear(nextProps.account.id);
        }
    }

    claimYourPublications = () => {
        this.props.history.push('/claim-publications');
    };

    render() {
        const txt = locale.pages.dashboard;

        return (
            <StandardPage>
                {
                    this.props.authorDetailsLoading && !this.props.authorDetails &&
                    <div className="isLoading is-centered">
                        <InlineLoader message={txt.loading}/>
                    </div>
                }
                {
                    !this.props.authorDetailsLoading && this.props.authorDetails &&
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
                    !this.props.authorDetailsLoading && this.props.publicationsPerYear &&
                    <StandardCard className="barChart" title="eSpace publications by year">
                        <AuthorsPublicationsPerYearChart
                            rawData={this.props.publicationsPerYear}
                            yAxisTitle="Total publications"/>
                    </StandardCard>
                }
                {
                    !this.props.authorDetailsLoading && this.props.publicationCountData &&
                    <div className="columns">
                        <div className="column is-gapless is-4 donutChart">
                            <StandardCard title="Document types overview">
                                <AuthorsPublicationsCount
                                    rawData={this.props.publicationsPerYear}
                                    yAxisTitle="Total publications" />
                            </StandardCard>
                        </div>

                        <div className="column is-9">
                            <StandardCard title="Author statistics">
                                some stats...
                            </StandardCard>
                        </div>
                    </div>
                }
                {
                    !this.props.authorDetailsLoading && this.props.publicationsList &&
                    <StandardCard title="Your publications">
                        <PublicationsList publicationsList={this.props.publicationsList} />
                    </StandardCard>
                }
            </StandardPage>
        );
    }
}

export default Dashboard;
