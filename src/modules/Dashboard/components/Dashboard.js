import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardText, CardHeader} from 'material-ui/Card';
import {publicationYearsSmall as publicationYearsMockData} from '../../../mock/data/academic/publicationYears';
import {AuthorsPublicationsPerYearChart} from 'uqlibrary-react-toolbox';
import './Dashboard.scss';

class Dashboard extends React.Component {

    static propTypes = {
        account: PropTypes.object.isRequired
    };

    componentDidMount() {
        // fetch data to display here
    }

    render() {
        const {
            account
        } = this.props;

        return (
            <div className="layout-fill">
                <div className="layout-card">
                    <div className="image-cover">
                        <div className="user-information" style={{color: '#FFF'}}>
                            <span className="display-1">{account.get('title')} {account.get('name')}</span><br/>
                            <span className="subhead">{account.get('fullTitle')}</span><span className="body-1">{account.get('school')}</span>
                        </div>
                    </div>
                    <div className="time-display-wrap"/>

                    <div className="columns is-gapless">
                        <div className="column is-one-third">
                            <Card style={{backgroundColor: '#ED5C8F', marginRight: '12px', marginTop: '24px', height: '100%'}}>
                                <CardHeader className="card-header">
                                    <h2 className="title" style={{color: '#FFF'}}>eSpace publications by type</h2>
                                </CardHeader>

                                <CardText className="body-1">
                                    <div><br/>
                                        Some content
                                    </div>
                                </CardText>

                            </Card>
                        </div>
                        <div className="column is-two-thirds">
                            <Card style={{marginLeft: '12px', marginTop: '24px', height: '100%'}}>
                                <CardHeader className="card-header">
                                    <h2 className="title">eSpace publications by year</h2>
                                </CardHeader>

                                <CardText className="body-1"><br />
                                    <div><AuthorsPublicationsPerYearChart rawData={publicationYearsMockData} yAxisTitle="Total publications"/>
                                    </div>
                                </CardText>

                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
