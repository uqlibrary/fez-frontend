import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardText, CardHeader} from 'material-ui/Card';
// import {publicationYearsBig as publicationYearsMockData} from '../../../mock/data/academic/publicationYears';

// import {AuthorsPublicationsPerYearChart} from 'uqlibrary-react-toolbox';
import './Dashboard.scss';
import AddAuthors from '../../SharedComponents/AddAuthors/components/AddAuthors';

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
                    <div className="columns">
                        <div className="column">
                            <div className="image-cover">
                                <div className="user-information" style={{color: '#FFF'}}>
                                    <span className="display-1">{account.get('title')} {account.get('name')}</span><br/>
                                    <span className="subhead">{account.get('fullTitle')}</span><br/>
                                    <span className="body-1">{account.get('school')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="columns">
                        <div className="column">
                            <Card>
                                <CardHeader className="card-header">
                                    <h2 className="headline">Authors module test</h2>
                                </CardHeader>

                                <CardText className="body-1">
                                    <div className="columns">
                                        <div className="column">
                                            <AddAuthors/>
                                        </div>
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
