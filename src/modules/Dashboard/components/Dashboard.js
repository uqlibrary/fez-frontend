import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardText, CardHeader } from 'material-ui/Card';
import { publicationYearsBig as publicationYearsMockData } from '../../../mock/data/academic/publicationYears';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Alert } from 'uqlibrary-react-toolbox';
import { AuthorsPublicationsPerYearChart } from 'uqlibrary-react-toolbox';
import './Dashboard.scss';

class Dashboard extends React.Component {

    static propTypes = {
        account: PropTypes.object.isRequired,
        history: PropTypes.object,
        loadUsersPublications: PropTypes.func,
        claimPublicationResults: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            showAppbar: true
        };
    }

    componentDidMount() {
        // fetch data to display here
        this.props.loadUsersPublications(123);
    }

    hideAppBar = () => {
        this.setState({showAppbar: false});
    };

    claimYourPublications = () => {
        this.props.history.push('/claim-publications');
    };

    render() {
        const {
            account
        } = this.props;

        return (
            <div className="layout-fill">
                <div className="layout-card">
                    <div className="columns is-multiline is-gapless">
                        <div className="column is-12 is-hidden-mobile">
                            <div className="image-cover">
                                <div className="user-information" style={{color: '#FFF'}}>
                                    <span
                                        className="title is-4">{account.get('title')} {account.get('name')}</span><br/>
                                    <span className="subtitle is-5">{account.get('fullTitle')}</span><span
                                    className="body-1">{account.get('school')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="notification-wrap column is-12">
                            <CSSTransitionGroup
                                transitionName="claim-publication-lure"
                                transitionEnterTimeout={100}
                                transitionLeaveTimeout={300}
                            >
                                {this.props.claimPublicationResults.size > 0 && this.state.showAppbar && (
                                    <AppBar
                                        className="claim-publication-lure"
                                        title={`We have found ${this.props.claimPublicationResults.size} articles that could possibly be your work.`}
                                        iconElementLeft={<FontIcon className="material-icons error_outline">warning</FontIcon>}
                                        iconElementRight={<span className="button-wrap">
                                    <FlatButton label="Claim your publications now"
                                                onTouchTap={this.claimYourPublications} className="claim-publications"/>
                                    <IconButton onTouchTap={this.hideAppBar}><NavigationClose className="hide-appbar"/></IconButton></span>}
                                    />
                                )}
                            </CSSTransitionGroup>
                        </div>
                    </div>

                    <Alert
                        title="INFO"
                        message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum varius felis purus, vel ultricies tortor varius at. Sed sagittis convallis ante sit amet vehicula. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque a felis sit amet est vehicula eleifend."
                        type="info"
                        />

                    <div className="columns is-gapless">
                        <div className="column is-12">
                            <Card>
                                <CardHeader className="card-header">
                                    <h2 className="title is-4">eSpace publications by year</h2>
                                </CardHeader>

                                <CardText className="body-1"><br/>
                                    <div><AuthorsPublicationsPerYearChart rawData={publicationYearsMockData}
                                                                          yAxisTitle="Total publications"/>

                                    </div>
                                    <Alert
                                        title="ERROR"
                                        message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum varius felis purus, vel ultricies tortor varius at. Sed sagittis convallis ante sit amet vehicula. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque a felis sit amet est vehicula eleifend."
                                        type="error"
                                    />
                                </CardText>

                            </Card>

                            <Alert
                                title="WARNING"
                                message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum varius felis purus, vel ultricies tortor varius at. Sed sagittis convallis ante sit amet vehicula. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque a felis sit amet est vehicula eleifend."
                                type="warning"
                            />

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
