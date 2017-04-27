import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardText} from 'material-ui/Card';

import AuthorsPublicationsPerYearChart from './AuthorsPublicationsPerYearChart';
import TimeDisplay from './TimeDisplay';
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

        const authorStatsData = [{
            'name': 'Journal Article',
            'data': [1, 1, 3, 5, 5, 8, 8, 2, 5, 3, 6, 4, 4, 7, 7, 8, 6, 4, 10, 10, 8, 10, 12, 7, 19, 11, 11, 12, 6, 8, 15, 10, 9, 3, 13, 6, 5]
        }, {
            'name': 'Conference Paper',
            'data': [0, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 4, 1, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 0, 1, 0, 5, 0, 0, 2, 1, 1, 0, 3]
        }, {
            'name': 'Book Chapter',
            'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 1, 0, 0, 2, 1, 0, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0]
        }, {
            'name': 'Book',
            'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }, {
            'name': 'Other',
            'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }];

        const xAxis = [1977, 1980, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016];

        return (
            <div className="layout-fill">
                <div className="layout-card">
                    <div className="image-cover">
                        <div className="user-information" style={{color: '#FFF'}}>
                            <span className="display-1">{account.get('title')} {account.get('name')}</span><br />
                            <span className="subhead">{account.get('fullTitle')}</span><br />
                            <span className="body-1">{account.get('school')}</span>
                        </div>
                    </div>
                    <div className="time-display-wrap">
                        <TimeDisplay />
                    </div>
                </div>

                <div className="layout-fill">
                    <h1 className="page-title display-1">eSpace publications by year</h1>
                    <Card className="layout-card">
                        <CardText className="body-1">
                            <br />
                            <AuthorsPublicationsPerYearChart data={authorStatsData} xAxis={xAxis}/>
                        </CardText>
                    </Card>
                </div>

            </div>
        );
    }
}

export default Dashboard;
