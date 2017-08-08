import React from 'react';
import PropTypes from 'prop-types';

import {Card, CardText, CardHeader} from 'material-ui/Card';
import {AuthorsPublicationsPerYearChart, Alert, InlineLoader} from 'uqlibrary-react-toolbox';

import DashboardAuthorProfile from './DashboardAuthorProfile';
import AuthorsPublicationsCount from 'modules/DonutChart/components/AuthorsPublicationsCount';
import {locale} from 'config';

class Dashboard extends React.Component {

    static propTypes = {
        account: PropTypes.object.isRequired,
        authorDetails: PropTypes.object,
        authorDetailsLoading: PropTypes.bool,
        publicationYearsData: PropTypes.object,
        possiblyYourPublicationsCount: PropTypes.object,
        actions: PropTypes.object,
        history: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.account && this.props.account.id) {
            this.props.actions.countPossiblyYourPublications(this.props.account.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.account && nextProps.account.id &&
            (!this.props.account || nextProps.account.id !== this.props.account.id)) {
            this.props.actions.countPossiblyYourPublications(this.props.account.id);
        }
    }

    claimYourPublications = () => {
        this.props.history.push('/claim-publications');
    };

    render() {
        const txt = locale.pages.dashboard;
        return (
            <div className="layout-fill">
                {
                    this.props.authorDetailsLoading && !this.props.authorDetails &&
                    <div className="columns is-multiline is-gapless">
                        <div className="column is-12 is-hidden-mobile">

                            <div className="isLoading is-centered">
                                <InlineLoader message={txt.loading}/>
                            </div>
                        </div>
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
                                           message={txt.possiblePublicationsLure.message.replace(this.props.possiblyYourPublicationsCount.most_likely_match_count)}
                                           type={txt.possiblePublicationsLure.type}
                                           actionButtonLabel={txt.possiblePublicationsLure.actionButtonLabel}
                                           action={this.claimYourPublications}
                                           allowDismiss
                                    />
                                </div>
                            }

                        </div>

                        <div className="columns is-gapless">
                            <div className="column">

                                <Card style={{backgroundColor: '#36B6D6'}}>
                                    <CardHeader className="card-header">
                                        <h2 className="title is-4 color-reverse">eSpace publications by year</h2>
                                    </CardHeader>

                                    <CardText className="body-1">
                                        <AuthorsPublicationsPerYearChart rawData={this.props.publicationYearsData}
                                                                         yAxisTitle="Total publications"/>
                                    </CardText>
                                </Card>
                            </div>
                        </div>

                        <div className="columns">
                            <div className="column is-4">
                                <Card style={{backgroundColor: '#ed5c8f'}}>
                                    <CardHeader className="card-header">
                                        <h2 className="title is-4 color-reverse">Document types overview</h2>
                                    </CardHeader>

                                    <CardText className="body-1">
                                        <AuthorsPublicationsCount/>
                                    </CardText>
                                </Card>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Dashboard;
